import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";

admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), }),});

// seeds new_group individually, update name and members manually
(async function seedGroup() {
  const groupCollection = getFirestore().collection("groups");

  const GroupData = {
    name: "Group Z",
    members: ["4A3sxUmAPBRw5NrmCQh8TL9y07J2"],
    admins: ["4A3sxUmAPBRw5NrmCQh8TL9y07J2"],
    createdBy: "4A3sxUmAPBRw5NrmCQh8TL9y07J2",
    groupCode: "JOIN123",
  };

  await groupCollection.add(GroupData);
  console.log((await groupCollection.get()).docs);
})();

