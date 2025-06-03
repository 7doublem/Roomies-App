import express from "express";
import { userRoutes } from "./routes/users.routes";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import serviceAccount from "../firebaseServiceAccount.json";
import cors from "cors";

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (isEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  console.log("Using Firestore and Auth Emulators");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
} else {
  admin.initializeApp();
}

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/", userRoutes);

export default app;
exports.roomiesapi = functions.https.onRequest(app);
