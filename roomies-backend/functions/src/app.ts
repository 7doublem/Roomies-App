import express from "express";
import {userRoutes} from "./routes/users.routes";
import {choreRoutes} from "./routes/chores.routes";
import {groupRoutes} from "./routes/groups.routes";
import {commentRoutes} from "./routes/comments.routes";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true" || process.env.FIRESTORE_EMULATOR_HOST;

if (!admin.apps.length) {
  if (isEmulator) {
    process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
    console.log("Using Firestore and Auth Emulators");

    admin.initializeApp({projectId: "roomies-app-32362"});
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase service account environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
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
