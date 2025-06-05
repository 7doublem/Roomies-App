import * as admin from "firebase-admin";

process.env.FUNCTIONS_EMULATOR = "true";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "roomies-app-32362",
  });
}
