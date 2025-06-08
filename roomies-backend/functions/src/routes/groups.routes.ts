import {Router} from "express";
import {groupController} from "../controllers/groups.controller";
import {authenticateUser} from "../middleware/auth.middleware";

export const groupRoutes = Router();


// GET /groups - used for app administration
groupRoutes.get("/groups", groupController.getAllGroups);

// POST /groups - for users to create a group
groupRoutes.post("/groups", authenticateUser, groupController.createGroup);

// PATCH /groups/join - users can join group by the group code
groupRoutes.patch("/groups/join", authenticateUser, groupController.addGroupMemberbyJoin);

// PATCH /groups/:group_id - users can update the group name
groupRoutes.patch("/groups/:group_id", authenticateUser, groupController.updateGroupName);

// PATCH /groups/:group_id/members - users can add member to the group
groupRoutes.patch("/groups/:group_id/members", authenticateUser, groupController.addMemberToGroup);

// GET /groups/:group_id/users - users can see the leaderboard screen
groupRoutes.get("/groups/:group_id/members", authenticateUser, groupController.getUsersByGroupId);
