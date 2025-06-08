import {Router} from "express";
import {ChoreController} from "../controllers/chores.controller";
import {authenticateUser} from "../middleware/auth.middleware";

export const choreRoutes = Router();

// POST /groups/:group_id/chores - create a new chore
choreRoutes.post("/groups/:group_id/chores", authenticateUser, ChoreController.createChoreByGroupId);

// GET /groups/:group_id/chores - get all chores by groupId
choreRoutes.get("/groups/:group_id/chores", authenticateUser, ChoreController.getAllChoresByGroupId);

// PATCH /groups/:group_id/chores/:chore_id - patch a chore by chore_id that is a subcollection of group_id
choreRoutes.patch("/groups/:group_id/chores/:chore_id", authenticateUser, ChoreController.patchChoreByChoreId);
