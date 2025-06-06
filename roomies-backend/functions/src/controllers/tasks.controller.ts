import { Request, Response, NextFunction } from "express";
import { getFirestore } from "firebase-admin/firestore";

type Task = {
  name: string;
  description: string;
  assigned_to: string;
  countdown: string;
  reward_points: number;
  status: string;
};

export class taskController {
  // GET /tasks/:group_id - gets array of tasks by id
  static async getTasksByGroupId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groupId = req.params.group_id;

      const tasksRef = await getFirestore()
        .collection("groups")
        .doc(groupId)
        .collection("tasks")
        .get();
      const tasks: (Task & { id: string })[] = tasksRef.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Task),
      }));
      res.status(200).json({ tasks });
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async postTaskByGroupId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groupId = req.params.group_id;
      console.log("Group Id in Controller", groupId);
      const task = req.body as Task;
      if (
        !task.name ||
        !task.assigned_to ||
        !task.countdown ||
        !task.reward_points ||
        !task.status
      ) {
        res.status(400).send({ message: "Missing or invalid task fields." });
        return;
      }
      const groupDoc = await getFirestore().collection("groups").doc(groupId).get();
      console.log("GroupDoc", groupDoc.data());
      if (!groupDoc.exists){
        res.status(404).send({ message: "Group not found." });
        return;
      }
      // const groupRef = getFirestore().collection("groups").doc(groupId)
      // console.log("GroupRef", groupRef)
      // const groupDoc = await groupRef.get()
      console.log("GroupDoc", groupDoc.data())
      console.log("GroupDoc Exists Before if", groupDoc.exists);
      if (!groupDoc.exists) {
        res.status(404).send({ message: "Group not found." });
        return;
      }
      console.log("GroupDoc Exists Post if", groupDoc.exists);
      const taskRef = await getFirestore().collection("groups").doc(groupId).collection("tasks").add(task);
      res.status(201).send({ id: taskRef.id, ...task });
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
