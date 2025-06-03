import { Request, Response, NextFunction } from "express";
import { getFirestore } from "firebase-admin/firestore";

type User = {
  id: number;
  name: string;
  user_avatar_url: string;
  rewards_points: number;
};

export class UserController {
  static async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
        const db = getFirestore();

        //temporary code to seed db and check firestore emulator
        const testUserRef = db.collection("users").doc("testuser");
        const doc = await testUserRef.get();

        if (!doc.exists) {
            await testUserRef.set({
                name: "test user",
                user_avatar_url: "https://example.com/avatar.png",
                rewards_points: 0,

            })
            console.log("seed test user inside controller")
        }
      const snapshot = await db.collection("users").get();
      const users = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
  static async save(req: Request, res: Response, next: NextFunction) {
    try {
      let user = req.body as User;
      const savedUser = await getFirestore().collection("users").add(user);
      res.status(201).send({ message: `User ${savedUser.id} created!` });
    } catch (error) {
      next(error);
    }
  }
}
