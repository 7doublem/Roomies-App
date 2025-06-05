import {Request, Response, NextFunction} from "express";
import {getFirestore} from "firebase-admin/firestore";
import {generateGroupCode} from "../utils/GroupCodeGenerator";

type Group = {
  name: string;
  groupCode: string;
  members: string[];
  admins: string[];
  createdBy: string;
};

export class groupController {
  // GET /groups
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
      const {name, usernames} = req.body;
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
      if (Array.isArray(usernames) && usernames.length > 0) {
        const userDocs = await getFirestore()
          .collection("users")
          .where("username", "in", usernames)
          .get();

        memberUids = userDocs.docs.map((doc) => doc.id);
        const foundUsernames = userDocs.docs.map((doc) => doc.data().username);
        const notFound = usernames.filter((u) => !foundUsernames.includes(u));
        if (notFound.length) {
          console.warn("Usernames not found:", notFound);
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
        groupCode,
        members: memberUids,
        admins,
        createdBy: creatorUid,
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
      res.status(200).json({message: "Successfully joined group"});
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
  // PATCH /groups/:group_id/members - only admins can add new user by username
  static async addMemberToGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      const groupId = req.params.group_id;
      const {usernames} = req.body;

      if (!uid) {
        res.status(401).json({message: "Unauthorized"});
        return;
      }
      if (!Array.isArray(usernames) || usernames.length === 0) {
        res.status(400).json({message: "Username(s) required"});
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

      const userDocs = await getFirestore()
        .collection("users")
        .where("username", "in", usernames)
        .get();
      const newUids = userDocs.docs.map((doc) => doc.id);
      const currentMembers = new Set(group.members);
      newUids.forEach((uid) => currentMembers.add(uid));

      await groupRef.update({members: Array.from(currentMembers)});
      res.status(200).json({message: "Members added successfully"});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // GET /groups/:group_id/members - get all members from a specific group
  static async getUsersByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.group_id;
      let users = [];
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

      users = userDocs
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
