import * as admin from "firebase-admin";
import {CollectionReference, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {generateGroupCode} from "../utils/GroupCodeGenerator";
import {User} from "../controllers/users.controller";

admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), }),});

const users = ["Alice", "Paul", "Harry", "Noah"];

// created a new_user and create a new group using the new_user data
async function createAuthedUser(userCollection: CollectionReference, userData: User) {
  // TODO check user exists
  const authUser = await getAuth().createUser({
    email: userData.email,
    displayName: userData.username,
    password: "123456",
    photoURL: userData.avatarUrl,
  });

  console.log(authUser.uid, "authUser.uid");
  await userCollection.doc(authUser.uid).set(userData);
  return authUser.uid;
}

(async function seed() {
  for (const name of users) {
    const userCollection = getFirestore().collection("users");
    const userData: User = {
      username: name,
      email: `${name}@example.com`,
      avatarUrl: "https://example.com/avatar.png",
      rewardPoints: 100,
    };

    const uid = await createAuthedUser(userCollection, userData);
    console.log((await userCollection.get()).docs);

    const groupCollection = getFirestore().collection("groups");
    const newCode = generateGroupCode();

    const GroupData = {
      name: `${name}'s Group`,
      members: [uid],
      admins: [uid],
      createdBy: uid,
      groupCode: newCode,
    };

    await groupCollection.add(GroupData);
    console.log((await groupCollection.get()).docs);
  }
})();
