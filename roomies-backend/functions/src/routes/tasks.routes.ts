import {Router} from "express";
import {taskController} from "../controllers/tasks.controller";

export const taskRoutes = Router();

// Get /tasks/:group_id - get all tasks of a given group
taskRoutes.get("/:group_id/tasks", taskController.getTasksByGroupId)
taskRoutes.post("/:group_id/tasks", taskController.postTaskByGroupId)