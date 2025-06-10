import {Request, Response, NextFunction} from "express";
import {getFirestore} from "firebase-admin/firestore";
import {generateGroupCode} from "../utils/GroupCodeGenerator";

export type Group = {
  // groupId: string; //generated
  name: string;
  members: string[];
  admins: string[];
  createdBy: string;
  groupCode: string;
};

export class groupController {
  // GET /groups - get all groups
  static async getAllGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groupDoc = await getFirestore().collection("groups").get();
      const groups = groupDoc.docs.map((doc) => {
        return {
          groupId: doc.id,
          ...doc.data(),
        };
      });
      res.status(200).json(groups);
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // POST /groups - creator of group is group admin, can add multiple members by username
  static async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const {name, members} = req.body;
      const creatorUid = req.user?.uid;

      if (!creatorUid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }

      if (!name) {
        res.status(400).json({message: "Group name is required"});
        return;
      }

      let memberUids: string[] = [];
      if (Array.isArray(members) && members.length > 0) {
        const userDocs = await getFirestore()
          .collection("users")
          .where("username", "in", members)
          .get();

        memberUids = userDocs.docs.map((doc) => doc.id);

        const foundUsernames = userDocs.docs.map((doc) => doc.data()?.username);
        const notFound = members.filter((u) => !foundUsernames.includes(u));
        if (notFound.length) {
          console.warn("Members not found:", notFound);
        }
      }

      // ensure group creator is in members and admins
      memberUids = Array.from(new Set([creatorUid, ...memberUids]));
      const admins = [creatorUid];

      // generate unique groupCode
      let groupCode = generateGroupCode();
      let attempts = 0;
      const maxAttempts = 100;
      // eslint-disable-next-line no-constant-condition
      while (attempts < maxAttempts) {
        // check if the groupCode exists, if it does... create a new one
        const groupDoc = await getFirestore()
          .collection("groups")
          .where("groupCode", "==", groupCode)
          .get();

        if (groupDoc.empty) break;
        groupCode = generateGroupCode();
        attempts++;
      }

      if (attempts === maxAttempts) {
        throw new Error(
          "Unable to generate unique group code after 100 attempts"
        );
      }

      const newGroup: Group = {
        name,
        members: memberUids,
        admins,
        createdBy: creatorUid,
        groupCode,
      };

      const docRef = await getFirestore().collection("groups").add(newGroup);
      res.status(201).json({groupId: docRef.id, ...newGroup});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // PATCH /groups/join - User joins group via join code
  static async addGroupMemberbyJoin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      const {groupCode} = req.body;

      if (!uid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }
      if (!groupCode || typeof groupCode !== "string") {
        res.status(400).json({message: "Group code is required"});
        return;
      }

      const groupJoin = await getFirestore()
        .collection("groups")
        .where("groupCode", "==", groupCode)
        .get();

      if (groupJoin.empty) {
        res.status(404).json({message: "Group not found"});
        return;
      }

      const groupDoc = groupJoin.docs[0];
      const group = groupDoc.data() as Group;

      const currentMembers = Array.isArray(group.members) ? group.members : [];
      if (currentMembers.includes(uid)) {
        res.status(200).json({message: "Already a member"});
        return;
      }

      await groupDoc.ref.update({members: [...group.members, uid]});
      const updatedGroupDoc = await getFirestore().collection("groups").doc(groupDoc.id).get();

      res.status(200).json({groupId: groupDoc.id, ...updatedGroupDoc.data()});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // PATCH /groups/:group_id - only admins can rename the group
  static async updateGroupName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      const {name} = req.body;
      const groupId = req.params.group_id;

      if (!uid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }
      if (!name) {
        res.status(400).json({message: "New group name is required"});
        return;
      }

      const groupRef = getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).json({message: "Group not found"});
        return;
      }

      const group = groupDoc.data() as Group;
      if (!group.admins.includes(uid)) {
        res.status(403).json({message: "Forbidden"});
        return;
      }

      await groupRef.update({name});
      res.status(200).json({message: "Group name updated"});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // PATCH /groups/:group_id/members - only admins can edit it
  static async updateGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      const groupId = req.params.group_id;
      const {name, members} = req.body;

      if (!uid) {
        res.status(401).json({message: "Unauthorized"});
        return;
      }

      if (!name && (!Array.isArray(members) || members.length === 0)) {
        res.status(401).json({message: "Nothing to update"});
        return;
      }

      const groupRef = getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).json({message: "Group not found"});
        return;
      }

      const group = groupDoc.data() as Group;

      if (!group.admins.includes(uid)) {
        res.status(403).json({message: "Only admins can update"});
        return;
      }

      const updateSet: Partial<{name: string, members:string[]}> = {};

      let updatedMembers: {uid: string, username: string}[] =[];

      if (name) {
        updateSet.name = name;
      }

      if (Array.isArray(members) && members.length > 0) {
        const userDocs = await getFirestore()
          .collection("users")
          .where("username", "in", members)
          .get();

        updatedMembers = userDocs.docs.map((doc) => ({
          uid: doc.id,
          username: doc.data()?.username,
        }));

        const membersUids = updatedMembers.map((member) => member.uid);

        if (!membersUids.includes(uid)) {
          const userDoc = await getFirestore().collection("users").doc(uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            updatedMembers.push({
              uid,
              username: userData?.username,
            });
          }
        }

        updateSet.members = updatedMembers.map((member) => member.uid);
      }

      if (Object.keys(updateSet).length === 0) {
        res.status(400).json({message: "Nothing to update"});
        return;
      }

      await groupRef.update(updateSet);
      const updatedGroupDoc = await groupRef.get();

      res.status(200).send({groupId: groupRef.id, ...updatedGroupDoc.data()});
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // GET /groups/:group_id/members - get all members from a specific group
  static async getUsersByGroupId(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.group_id;
      const groupDoc = await getFirestore().collection("groups").doc(groupId).get();

      if (!groupDoc.exists) {
        res.status(404).json({message: "Group not found"});
        return;
      }

      const members = groupDoc.data()?.members || [];
      const userDocs = await Promise.all(
        members.map(async (uid: string) => {
          const userDoc = await getFirestore().collection("users").doc(uid).get();
          return userDoc;
        })
      );

      const users = userDocs
        .filter((userDoc) => userDoc.exists)
        .map((userDoc) => ({uid: userDoc.id, ...userDoc.data()}))
        .sort((a, b) => (b.rewardPoints as number) - (a.rewardPoints as number));


      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
