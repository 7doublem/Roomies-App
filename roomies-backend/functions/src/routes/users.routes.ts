import {Router} from "express";
import {userController} from "../controllers/users.controller";
import {authenticateUser} from "../middleware/auth.middleware";

export const userRoutes = Router();

// GET /users - used for app administration
userRoutes.get("/", userController.getAllUsers);

// POST /users - for users to sign up to app
userRoutes.post("/", userController.createUser);

// GET /users/currentUser - for signed up user to read/write their profile
userRoutes.get("/currentUser", authenticateUser, userController.getCurrentUser);
