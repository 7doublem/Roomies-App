import express from "express";
import {userRoutes} from "./routes/users.routes";
import {choreRoutes} from "./routes/chores.routes";
import {groupRoutes} from "./routes/groups.routes";
import {commentRoutes} from "./routes/comments.routes";
import {https} from "firebase-functions/v2";
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
    admin.initializeApp({projectId: "roomies-migration"});
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
    admin.initializeApp();
  }
}
export const app = express();

const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:19000",
  "http://localhost:19006",
  "http://localhost:3000",
  "https://roomies-migration.web.app",
];

const corsOptions = {
  origin: function(
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (e.g., from native mobile apps)
    if (!origin) return callback(null, true);

    // Allow origins explicitly listed in allowedOrigins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the disallowed origin for debugging
      console.warn(`CORS: Blocking request from disallowed origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Testing");
});
app.use(userRoutes);
app.use(groupRoutes);
app.use(choreRoutes);
app.use(commentRoutes);

export const roomiesapi = https.onRequest({region: "europe-west2"}, app);
