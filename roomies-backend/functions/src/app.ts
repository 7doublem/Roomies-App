import express from "express";
import {userRoutes} from "./routes/users.routes";
import {choreRoutes} from "./routes/chores.routes";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import serviceAccount from "../firebaseServiceAccount.json";
import cors from "cors";
import {groupRoutes} from "./routes/groups.routes";
import {commentRoutes} from "./routes/comments.routes";

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (!admin.apps.length) {
  if (isEmulator) {
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    console.log("Using Firestore and Auth Emulators");

    admin.initializeApp({projectId: "roomies-app-32362"});
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
}

export const app = express();

app.use(cors({origin: true}));
app.use(express.json());
app.use(userRoutes);
app.use(groupRoutes);
app.use(choreRoutes);
app.use(commentRoutes);

export const roomiesapi = functions.https.onRequest(app);
