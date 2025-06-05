import {Router} from "express";
import {groupController} from "../controllers/groups.controller";
import {authenticateUser} from "../middleware/auth.middleware";

export const groupRoutes = Router();


// GET /groups - used for app administration
groupRoutes.get("/", groupController.getAllGroups);

// POST /groups - for users to create a group
groupRoutes.post("/", authenticateUser, groupController.createGroup);

// PATCH /groups/join - users can join group by the group code
groupRoutes.patch("/join", authenticateUser, groupController.addGroupMemberbyJoin);

// PATCH /groups/:group_id - users can update the group name
groupRoutes.patch("/:group_id", authenticateUser, groupController.updateGroupName);

// PATCH /groups/:group_id/members - users can add member to the group
groupRoutes.patch("/:group_id/members", authenticateUser, groupController.addMemberToGroup);

