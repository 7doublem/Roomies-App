import {Request, Response, NextFunction} from "express";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

export class userController {
  // GET /users - used for app administration
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userDoc = await getFirestore().collection("users").get();
      const users = userDoc.docs.map((doc) => {
        return {uid: doc.id, ...doc.data()};
      });
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      next(error);
      return;
    }
  }

  // POST /users - user signs up
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {username, email, password, avatarUrl} = req.body;

      if (!username || !email || !password) {
        res.status(400).json({message: "Missing required fields"});
        return;
      }

      // Validate photoURL if present
      const validPhotoURL = typeof avatarUrl === "string" && avatarUrl.startsWith("http") ?
        avatarUrl :
        undefined;

      // create user in firebase auth
      const authUser = await getAuth().createUser({
        email,
        password,
        displayName: username,
        photoURL: validPhotoURL,
      });

      // save user profile in firestore
      const userDoc = {
        username,
        email,
        avatarUrl: validPhotoURL || null,
        rewardPoints: 0,
        groupId: null,
      };

      await getFirestore().collection("users").doc(authUser.uid).set(userDoc);

      res
        .status(201)
        .json({uid: authUser.uid, message: "User created successfully"});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // GET /users/currentUser - signed up user views their profile
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({message: "Unauthorised"});
        return;
      }

      const userDoc = await getFirestore().collection("users").doc(uid).get();

      if (!userDoc.exists) {
        res.status(404).json({message: "User not found"});
        return;
      }

      res.status(200).json({uid, ...userDoc.data()});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
