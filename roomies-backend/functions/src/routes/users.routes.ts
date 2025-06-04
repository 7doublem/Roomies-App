import { Router } from "express";
import { UserController } from "../controllers/users.controller";
//import { authenticate } from "../middleware/auth.middleware";

export const userRoutes = Router();

userRoutes.get("/users", UserController.getAllUser);
userRoutes.post("/users", UserController.createUser);
userRoutes.get("/users/:uid", UserController.getUserByUid);