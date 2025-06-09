import * as admin from "firebase-admin";
import request from "supertest";

export const createUserAndGetToken = async (
  email: string,
  password = "password123"
) => {
  const user = await admin.auth().createUser({email, password});

  const signInResponse = await request("http://127.0.0.1:9099")
    .post("/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key")
    .send({
      email,
      password,
      returnSecureToken: true,
    });

  if (!signInResponse.body.idToken) {
    console.error("Sign-in failed:", signInResponse.body);
    throw new Error("Failed to get ID token");
  }

  return {
    uid: user.uid,
    idToken: signInResponse.body.idToken,
  };
};

export const deleteUsersAuth = (uids: string[]) => {
  return admin.auth().deleteUsers(uids.filter((id) => id)); // filter when id exists
};
