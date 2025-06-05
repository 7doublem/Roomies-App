import request from "supertest";
import {app} from "../app";
import {createUserAndGetToken} from "./test.utils/utils";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";

describe("User Routes", () => {
  let server: ReturnType<typeof app.listen>;

  beforeAll((done) => {
    server = app.listen(5002, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(async () => {
    const db = getFirestore();
    const users = await db.collection("users").listDocuments();
    for (const doc of users) await doc.delete();

    const list = await admin.auth().listUsers();
    for (const user of list.users) {
      await admin.auth().deleteUser(user.uid);
    }
  });

  describe("POST /users", () => {
    it("should create a new user successfully", async () => {
      const res = await request(app).post("/users").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("uid");
      expect(res.body.message).toBe("User created successfully");
    });

    it("should fail if required fields are missing", async () => {
      const res = await request(app).post("/users").send({
        email: "wrongemail@email.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required fields");
    });
  });

  describe("GET /users", () => {
    it("should return a 200 and list of users", async () => {
      await request(app).post("/users").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("uid");
    });
  });

  describe("GET /users/currentUser", () => {
    it("should return current user profile", async () => {
      const {idToken, uid} = await createUserAndGetToken(
        "testprofile@example.com"
      );

      await getFirestore().collection("users").doc(uid).set({
        username: "profileuser",
        email: "testprofile@example.com",
        avatarUrl: null,
        rewardPoints: 0,
        groupId: null,
      });

      const res = await request(app)
        .get("/users/currentUser")
        .set("Authorization", `Bearer ${idToken}`);

      expect(res.status).toBe(200);
      expect(res.body.uid).toBe(uid);
      expect(res.body.username).toBe("profileuser");
    });

    it("should return 401 if user not authenticated", async () => {
      const res = await request(app).get("/users/currentUser");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 404 if user doc is missing", async () => {
      const {idToken} = await createUserAndGetToken("nouserdoc@example.com");

      const res = await request(app)
        .get("/users/currentUser")
        .set("Authorization", `Bearer ${idToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
