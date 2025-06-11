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

  // In your backend file: src/controllers/users.controller.ts (or wherever this lives)

  // POST /users - user signs up
  static async createUser(req: Request, res: Response, next: NextFunction) {
    console.log("Backend: POST /users route hit.");
    try {
      const {username, email, password, avatarUrl} = req.body;
      console.log(`Backend: Received signup request for email: ${email}, username: ${username}`);

      if (!username || !email || !password) {
        console.warn("Backend: Missing required fields for user creation.");
        res.status(400).json({message: "Missing required fields"});
        return;
      }

      const validPhotoURL =
      typeof avatarUrl === "string" && avatarUrl.startsWith("http") ?
        avatarUrl :
        undefined;

      // Check for existing username in Firestore
      console.log(`Backend: Checking for existing username: ${username}`);
      const existingUser = await getFirestore().collection("users")
        .where("username", "==", username)
        .get();

      if (!existingUser.empty) {
        console.warn(`Backend: Username '${username}' is already being used.`);
        res.status(400).json({message: "Username is already being used"});
        return;
      }

      // Create user in Firebase Auth
      let authUser;
      try {
        console.log(`Backend: Attempting to create user in Firebase Auth for email: ${email}`);
        authUser = await getAuth().createUser({
          email,
          password,
          displayName: username,
          photoURL: validPhotoURL,
        });
        console.log(`Backend: Firebase Auth user created with UID: ${authUser.uid}`);
      } catch (authError: unknown) { // Use 'unknown' as recommended by TypeScript
      // Type guard to safely access properties of authError
        if (authError instanceof Error) {
          console.error("Backend: Firebase Auth user creation failed:", authError.name, authError.message);
          // Check for specific Firebase Auth error codes
          if ("code" in authError && typeof authError.code === "string") {
            if (authError.code === "auth/email-already-in-use") {
              res.status(400).json({message: "Email is already being used"});
            } else {
              res.status(500).json({message: `Failed to create user in Authentication: ${authError.message}`});
            }
          } else {
            res.status(500).json({message: `Failed to create user in Authentication: ${authError.message}`});
          }
        } else {
          console.error("Backend: An unknown error occurred during Firebase Auth user creation:", authError);
          res.status(500).json({message: "An unexpected error occurred during user authentication"});
        }
        return;
      }


      // Save user profile in Firestore
      const userDoc: User = {
        username,
        email,
        avatarUrl: validPhotoURL || null,
        rewardPoints: 0,
      };

      console.log(`Backend: Attempting to save user profile to Firestore for UID: ${authUser.uid}`);
      console.log("Backend: User profile data being sent to Firestore:", JSON.stringify(userDoc));
      await getFirestore().collection("users").doc(authUser.uid).set(userDoc);
      console.log(`Backend: Firestore user profile saved successfully for UID: ${authUser.uid}`);


      res.status(201).json({uid: authUser.uid, message: "User created successfully"});
      return;
    } catch (error: unknown) { // Use 'unknown' for the main catch block as well
    // Type guard for the main error
      if (error instanceof Error) {
        console.error("Backend: Uncaught error in createUser function:", error.name, error.message, error);
        // You might want to handle specific HTTP-related errors or just pass it to the next middleware
        next(error);
      } else {
        console.error("Backend: An unknown error occurred in createUser function:", error);
        next(new Error("An unexpected error occurred")); // Wrap unknown errors for consistent handling
      }
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
