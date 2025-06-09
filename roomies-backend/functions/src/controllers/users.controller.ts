import {Request, Response, NextFunction} from "express";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

export type User = {
  username: string;
  email: string;
  avatarUrl: string | null;
  rewardPoints: number;
};

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
      const validPhotoURL =
        typeof avatarUrl === "string" && avatarUrl.startsWith("http") ?
          avatarUrl :
          undefined;

      const existingUser = await getFirestore().collection("users")
        .where("username", "==", username)
        .get();

      if (!existingUser.empty) {
        res.status(400).json({message: "Username is already being used"});
        return;
      }

      // create user in firebase auth
      const authUser = await getAuth().createUser({
        email,
        password,
        displayName: username,
        photoURL: validPhotoURL,
      });

      // save user profile in firestore
      const userDoc: User = {
        username,
        email,
        avatarUrl: validPhotoURL || null,
        rewardPoints: 0,
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

  // GET /users/search?username= - search for user by username
  static async searchUsersByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const search = req.query.username?.toString().trim().toLowerCase();

      if (!search) {
        res.status(400).json({message: "Username is required"});
        return;
      }

      const usersRef = await getFirestore()
        .collection("users")
        .where("username", ">=", search)
        .where("username", "<=", search + "\uf8ff")
        .limit(10)
        .get();

      const users = usersRef.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl || null,
        };
      });

      res.status(200).json({users});
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
