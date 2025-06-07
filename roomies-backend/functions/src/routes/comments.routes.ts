import {Router} from "express";
import {authenticateUser} from "../middleware/auth.middleware";
import {commentController} from "../controllers/comments.controller";

export const commentRoutes = Router();


// GET /comments - all user are able to see comments
commentRoutes.get("/tasks/:task_id", commentController.getAllCommentsByTaskId);

// POST /comments - for users to create a comment
commentRoutes.post("/tasks/:task_id", authenticateUser, commentController.createComment);


