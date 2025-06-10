import * as admin from "firebase-admin";
import {CollectionReference, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {User} from "../controllers/users.controller";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});


// seeds new_user individually, update username and email manually
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

(async function seedUser() {
  const userCollection = getFirestore().collection("users");
  const userData = {
    username: "Jordon",
    email: "jordon@example.com",
    avatarUrl: "https://example.com/avatar.png",
    rewardPoints: 100,
    groupId: null,
  };

  await createAuthedUser(userCollection, userData);
  console.log((await userCollection.get()).docs);
})();


