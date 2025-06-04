import { Request, Response, NextFunction } from "express";
import { getFirestore } from "firebase-admin/firestore";

type User = {
  uid: string;
  username: string;
  email: string;
  user_avatar_url: string;
  rewards_points: number;
};

export class UserController {
  static async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const db = getFirestore();
      const userDoc = await db.collection("users").get();
      const users = userDoc.docs.map((doc) => {
        return { uid: doc.id, ...doc.data() };
      });
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered here")
      const user = req.body as User;
      const userDoc = await getFirestore().collection("users").add(user);
      res.status(201).send({ message: `User ${userDoc.id} created!` });
    } catch (error) {
      next(error);
    }
  }
  static async getUserByUid(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.params.uid
      const userDoc = await getFirestore().collection("users").doc(uid).get();
      if (!userDoc.exists){
        res.status(404).send({message: "User not found."})
        return
      }
      res.status(200).send({ uid: userDoc.id, ...userDoc.data()});
    } catch (error) {
      next(error);
    }
  }
}

//temporary code to seed db and check firestore emulator
// const testUserRef = db.collection("users").doc("testuser");
// const doc = await testUserRef.get();

// if (!doc.exists) {
//     await testUserRef.set({
//         name: "test user",
//         user_avatar_url: "https://example.com/avatar.png",
//         rewards_points: 0,
//     })
//     console.log("seed test user inside controller")
// }
