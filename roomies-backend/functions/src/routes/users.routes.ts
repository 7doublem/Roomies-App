import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { authenticate } from "../middleware/auth.middleware";

export const userRoutes = Router();

userRoutes.get("/users", authenticate, UserController.getAllUser);
userRoutes.post("/users", authenticate, UserController.save);
