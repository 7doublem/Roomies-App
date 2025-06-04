import { Router } from "express";
import { GroupController } from "../controllers/groups.controller";

export const groupRoutes = Router();

groupRoutes.post("/groups", GroupController.createGroup);
groupRoutes.patch("/groups/:group_id", GroupController.addMemberToGroup);
groupRoutes.patch("/groups/:group_id", GroupController.updateGroupName);
groupRoutes.get("/groups", GroupController.getGroups);
groupRoutes.patch("/groups/join/:groupCode", GroupController.addGroupMemberbyJoin);