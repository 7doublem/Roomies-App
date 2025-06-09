import request from "supertest";
import {app} from "../app";
import {createUserAndGetToken, deleteUsersAuth} from "./test.utils/utils";
import {getFirestore} from "firebase-admin/firestore";

describe("User Routes", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;

  async function deleteData() {
    if (uid) await deleteUsersAuth([uid]);

    const users = await getFirestore().collection("users").listDocuments();
    for (const doc of users) await doc.delete();
  }

  beforeAll(() => {
    server = app.listen(5003);
  });

  beforeEach(async () => {
    await deleteData();

    const result = await createUserAndGetToken("testuser@example.com");
    token = result.idToken;
    uid = result.uid;

    await getFirestore().collection("users").doc(uid).set({
      username: "testuser",
      email: "testuser@example.com",
      avatarUrl: null,
      rewardPoints: 300,
      groupId: null,
    });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /users", () => {
    it("should create a new user successfully", async () => {
      const res = await request(app).post("/users").send({
        username: "testuser",
        email: "testuser2@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("uid");
      expect(res.body.message).toBe("User created successfully");

      await deleteUsersAuth([res.body.uid]);
    });

    it("should fail if required fields are missing", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "wrongemail@email.com",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required fields");
    });
  });

  describe("GET /users", () => {
    it("should return a 200 and list of users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].username).toEqual("testuser");
    });
  });

  describe("GET /users/currentUser", () => {
    it("should return current user profile", async () => {
      const res = await request(app)
        .get("/users/currentUser")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.uid).toBe(uid);
      expect(res.body.username).toBe("testuser");
    });

    it("should return 401 if user not authenticated", async () => {
      const res = await request(app).get("/users/currentUser");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 401 if user token is invalid", async () => {
      const res = await request(app)
        .get("/users/currentUser")
        .set("Authorization", "Bearer InvalidToken");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });
  });

  describe("GET /users/search", () => {
    beforeEach(async () => {
      const usernames = ["middle", "start", "test", "jest", "supertest"];
      await Promise.all(
        usernames.map((name, i) =>
          getFirestore()
            .collection("users")
            .doc(`user${i}`)
            .set({
              username: name,
              email: `${name}@example.com`,
              avatarUrl: null,
              rewardPoints: 0,
            })
        )
      );
    });

    it("should return 401 if unauthenticated", async () => {
      const res = await request(app).get("/users/search?username=mi");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no query is provided", async () => {
      const res = await request(app)
        .get("/users/search")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username is required");
    });

    it("should return matching users for prefix 'mi'", async () => {
      const res = await request(app)
        .get("/users/search?username=mi")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      const usernames = res.body.users.map(
        (u: { username: string }) => u.username
      );
      expect(usernames).toEqual(expect.arrayContaining(["middle"]));
    });

    it("should return empty array if no matches", async () => {
      const res = await request(app)
        .get("/users/search?username=zz")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBe(0);
    });
  });
});
