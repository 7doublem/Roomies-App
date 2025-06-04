import { Request, Response, NextFunction } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { generateGroupCode } from "../utils/GroupCodeGenerator";

type Group = {
  groupId: number;
  name: string;
  groupCode: string;
  members: string[];
};

export class GroupController {
  static async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      let groupCode = generateGroupCode();
      while (true) {
        // check if the groupCode exists, if it does... create a new one
        const groupDoc = await getFirestore()
          .collection("groups")
          .where("groupCode", "==", groupCode)
          .get();
        if (groupDoc.empty) {
          break;
        }
        groupCode = generateGroupCode();
      }
      let group = req.body as Group;
      await getFirestore()
        .collection("groups")
        .add({
          //TODO check if group.members exist before adding it and name is not empty (can we duplicate names?)
          ...group,
          groupCode,
        });
      res.send({ message: `Group created!` });
    } catch (error) {
      next(error);
    }
  }

  //PATCH body:{"name": "Group A", "members": ["A5Bo7SlfAkhuQi6lKWw0"]}
  static async addMemberToGroup( //adding, remove  
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("entered addMemberToGroup")
      const  groupId = req.params.group_id;
      const { member } = req.body;  //we can receive one or more user uids since its a update group
      const groupDoc = await getFirestore()
        .collection("groups")
        .doc(groupId)
        .get();
      const currentMembers = groupDoc.data()?.members || [];
      if (!currentMembers.includes(member)) {
        const newMembers = [...currentMembers, member];
        const updateSet = { members: newMembers };
        await getFirestore()
          .collection("groups")
          .doc(groupId)
          .update(updateSet);
        res.status(200).send({ message: "User added to the group!" });
      } else {
        res.status(200).send({ message: "User is already a member!" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // static async updateGroupName( //TODO not working 
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     console.log("entered here")
  //     const { name } = req.body;
  //     console.log(name)
  //     const groupId = req.params.group_id;
  //     console.log(groupId, "groupId")
  //     const groupDoc = await getFirestore().collection("groups").where("groupId", "==", groupId).get();

  //     const updateDoc = groupDoc.docs[0].ref

  //     await updateDoc.update({name})
  
  //     //doc(groupId).update(name);
  //     res.status(200).send({ message: "Group name updated!" });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  //patch /groups/join/:groupCode
  // body: { “member”: “A5Bo7SlfAkhuQi6lKWw0"}
  static async addGroupMemberbyJoin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //let { groupCode, member } = req.body;
      let { groupCode } = req.params;
      let body = req.body;
      const groupDocbygroupCode = await getFirestore()
        .collection("groups")
        .where("groupCode", "==", groupCode)
        .get();
      if (groupDocbygroupCode.empty) {
        throw new Error("Group not found!");
      } else {
        const groupDoc = groupDocbygroupCode.docs[0];
        let groupId = groupDoc.id;
        const currentMembers = groupDoc.data().members || [];
        if (!currentMembers.includes(body.member)) {
          const newMembers = [...currentMembers, body.member];
          const updateSet = { members: newMembers };
          await getFirestore().collection("groups").doc(groupId).update(updateSet);
          res.send({ message: "User added to the group!" });
        } else {
          res.send({ message: "User is already a member!" });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
  static async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groupDoc = await getFirestore().collection("groups").get();
      const groups = groupDoc.docs.map((doc) => {
        return {
          groupId: doc.id,
          ...doc.data(),
        };
      });
      res.send(groups);
    } catch (error) {
      next(error);
    }
  }
}
