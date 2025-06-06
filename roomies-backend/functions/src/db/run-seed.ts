import * as admin from "firebase-admin";
import serviceAccount from "../../firebaseServiceAccount.json";
import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

async function createAuthedUser(userCollection: CollectionReference, userData: any) {
  // TODO check user exists

  const authUser = await getAuth().createUser({
    email: userData.email,
    displayName: userData.username,
    password: userData.password,
    photoURL: userData.avatarUrl,
  });

  await userCollection.doc(authUser.uid).set(userData);
}

(async function seed() {
  const userCollection = getFirestore().collection("users");
// const groupCollection = getFirestore().collection("groups");

  const userData = {
    username: "Alice",
    password: "123456",
    email: "Alice+1@gmail.com",
    avatarUrl: "https://example.com/avatar.png",
    rewardsPoints: 10,
  };

  await createAuthedUser(userCollection, userData);
  console.log((await userCollection.get()).docs);
})();