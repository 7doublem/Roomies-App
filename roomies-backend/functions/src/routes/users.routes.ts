import {Router} from "express";
import {userController} from "../controllers/users.controller";
import {authenticateUser} from "../middleware/auth.middleware";

export const userRoutes = Router();

// GET /users - used for app administration
userRoutes.get("/users", authenticateUser, userController.getAllUsers);

// POST /users - for users to sign up to app
userRoutes.post("/users", userController.createUser);

// GET /users/currentUser - for signed up user to read/write their profile
userRoutes.get("/users/currentUser", authenticateUser, userController.getCurrentUser);

// GET /users/search?username= - search for user by username
userRoutes.get("/users/search", authenticateUser, userController.searchUsersByUsername);

// PATCH /users/:user_uid - update user's avatarUrl and reward points
userRoutes.patch("/users/:user_uid", authenticateUser, userController.updateUser);

