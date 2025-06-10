import {Request, Response, NextFunction} from "express";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
type Comment = {
  // commentId:string,
  // choreId: string, //its nested
  commentBody: string,
  createdAt: number,
  createdBy: string,
};

export class commentController {
  // POST /chores/:chore_id/comments - creator of comments for a chore
  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const {commentBody} = req.body;
      const creatorUid = req.user?.uid;
      const groupId = req.params.group_id;
      const choreId = req.params.chore_id;

      if (!creatorUid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }

      if (!commentBody) {
        res.status(400).json({message: "Commment's body is required"});
        return;
      }

      const groupRef = await getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).send({message: "Group not found"});
        return;
      }

      const choreRef = groupRef.collection("chores").doc(choreId);
      const choreDoc = await choreRef.get();

      if (!choreDoc.exists) {
        res.status(404).json({message: "Chore not found"});
        return;
      }

      const newComment: Comment = {
        commentBody,
        createdAt: Timestamp.now().seconds,
        createdBy: creatorUid,
      };

      const commentRef = await choreRef.collection("comments").add(newComment);
      res.status(201).json({commentId: commentRef.id, ...newComment});
      return;
    } catch (error) {
      next(error);
    }
  }

  // GET /chores/:chore_id/comments - get all comments related to an specific chore
  static async getAllCommentsByChoreId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groupId = req.params.group_id;
      const choreId = req.params.chore_id;

      const groupRef = await getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).send({message: "Group not found"});
        return;
      }

      const choreRef = groupRef.collection("chores").doc(choreId);
      const choreDoc = await choreRef.get();

      if (!choreDoc.exists) {
        res.status(404).json({message: "Chore not found"});
        return;
      }

      const commentDocs = await choreRef.collection("comments").get();
      const comments = commentDocs.docs.map((doc) => {
        return {
          commentId: doc.id,
          ...doc.data(),
        };
      });
      res.status(200).json(comments);
      return;
    } catch (error) {
      next(error);
    }
  }
  // GET /chores/:chore_id/comment/:comment_id - get a single comment related to a chore by it's id
  static async getCommentByCommentId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groupId = req.params.group_id;
      const choreId = req.params.chore_id;
      const commentId = req.params.comment_id;

      const groupRef = await getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).send({message: "Group not found"});
        return;
      }

      const choreRef = groupRef.collection("chores").doc(choreId);
      const choreDoc = await choreRef.get();

      if (!choreDoc.exists) {
        res.status(404).json({message: "Chore not found"});
        return;
      }

      const commentRef = choreRef.collection("comments").doc(commentId);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        res.status(404).json({message: "Comment not found"});
        return;
      }

      const comment = await getFirestore()
        .collection("groups")
        .doc(groupId)
        .collection("chores")
        .doc(choreId)
        .collection("comments")
        .doc(commentId)
        .get();
      res.status(200).json(comment);
      return;
    } catch (error) {
      next(error);
    }
  }
  // DELETE /chores/:chore_id/comments/:comment_id - get all comments related to an specific chore
  static async deleteCommentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groupId = req.params.group_id;
      const choreId = req.params.chore_id;
      const commentId = req.params.comment_id;

      const groupRef = await getFirestore().collection("groups").doc(groupId);
      const groupDoc = await groupRef.get();

      if (!groupDoc.exists) {
        res.status(404).send({message: "Group not found"});
        return;
      }

      const choreRef = groupRef.collection("chores").doc(choreId);
      const choreDoc = await choreRef.get();

      if (!choreDoc.exists) {
        res.status(404).json({message: "Chore not found"});
        return;
      }

      const commentRef = choreRef.collection("comments").doc(commentId);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        res.status(404).json({message: "Comment not found"});
        return;
      }

      // await commentRef.delete(); //mycode
      // res.status(204).send();

      await getFirestore()
        .collection("groups")
        .doc(groupId)
        .collection("chores")
        .doc(choreId)
        .collection("comments")
        .doc(commentId)
        .delete();
      res.status(204).send("Comment deleted successfully");

      return;
    } catch (error) {
      next(error);
    }
  }
}
