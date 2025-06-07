import {Request, Response, NextFunction} from "express";
import {getFirestore, Timestamp} from "firebase-admin/firestore";

type Comment = {
  // commentId:string,
  taskId: string,
  commentBody: string,
  createdAt: number,
  createdBy: string, // uid but show name for the front....
};

export class commentController {
  // confirm the right router
  // POST /comment/task/:task_id - creator of comments for a task
  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const {commentBody} = req.body;
      const creatorUid = req.user?.uid;
      const taskId = req.params.task_id;

      if (!creatorUid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }

      if (!commentBody) {
        res.status(400).json({message: "Commment's body is required"});
        return;
      }

      const taskRef = getFirestore().collection("tasks").doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        res.status(404).json({message: "Task not found"});
        return;
      }

      const newComment: Comment = {
        // commentId:string, //generated
        taskId,
        commentBody,
        createdAt: Timestamp.now().seconds,
        createdBy: creatorUid, // uid but show name for the front....
      };

      const commentRef = await getFirestore().collection("comments").add(newComment);
      res.status(201).json({commentId: commentRef.id, ...newComment});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // confirm the right router
  // GET /comment/task/:task_id - get all comments related to an specific task
  static async getAllCommentsByTaskId(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.task_id;

      const taskRef = await getFirestore().collection("tasks").doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        res.status(404).json({message: "Task not found"});
        return;
      }

      const commentDoc = await getFirestore().collection("comments").where("taskId", "==", taskId).get();
      const comments = commentDoc.docs.map((doc) => {
        return {
          commentId: doc.id,
          ...doc.data(),
        };
      });
      res.status(200).json(comments);
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
