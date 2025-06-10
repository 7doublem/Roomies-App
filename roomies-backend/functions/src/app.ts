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

if (!admin.apps.length) {
  const isEmulator =
    process.env.FUNCTIONS_EMULATOR === "true" ||
    !!process.env.FIRESTORE_EMULATOR_HOST;

  if (isEmulator) {
    process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
    console.log("Using Firestore and Auth Emulators");
    admin.initializeApp({projectId: "roomies-app-32362"});
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY

  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    console.log("Using application default credentials");
    admin.initializeApp();
  }
}

export const app = express();

app.use(cors({origin: true}));

// Handle preflight requests for all routes
app.options("*", cors({ origin: true }));

app.use(express.json());
app.use(userRoutes);
app.use(groupRoutes);
app.use(choreRoutes);
app.use(commentRoutes);
export const roomiesapi = functions.https.onRequest(app);
