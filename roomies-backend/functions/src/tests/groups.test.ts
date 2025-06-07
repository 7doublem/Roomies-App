import request from "supertest";
import {app} from "../app";
import {createUserAndGetToken, deleteUsers} from "./test.utils/utils";
import {getFirestore} from "firebase-admin/firestore";

describe("Group Tests", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;

  let tokenAlice: string;
  let uidAlice: string;

  async function deleteData() {
    await deleteUsers([uid, uidAlice]);

    const users = await getFirestore().collection("users").listDocuments();
    for (const doc of users) await doc.delete();

    const groups = await getFirestore().collection("groups").listDocuments();
    for (const doc of groups) await doc.delete();
  }

  beforeAll(async () => {
    server = app.listen(5003);
  });

  beforeEach(async () => {
    await deleteData();

    const result = await createUserAndGetToken("adminuser@example.com");
    token = result.idToken;
    uid = result.uid;

    const resultAlice = await createUserAndGetToken("alice@example.com");
    tokenAlice = resultAlice.idToken;
    uidAlice = resultAlice.uid;

    await getFirestore().collection("users").doc(uid).set({
      username: "adminuser",
      email: "adminuser@example.com",
      avatarUrl: null,
      rewardPoints: 300,
      groupId: null,
    });

    await getFirestore().collection("users").doc(uidAlice).set({
      username: "Alice",
      email: "alice@example.com",
      avatarUrl: null,
      rewardPoints: 100,
      groupId: null,
    });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("GET /groups", () => {
    it("should return 200 and empty array", async () => {
      const res = await request(app).get("/groups");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /groups", () => {
    it("should return 401 if unauthenticated", async () => {
      const res = await request(app).post("/groups").send({name: "My Group"});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no name provided", async () => {
      const res = await request(app)
        .post("/groups")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Group name is required");
    });

    it("should create a group and return 201", async () => {
      const res = await request(app)
        .post("/groups")
        .set("Authorization", `Bearer ${token}`)
        .send({name: "My Group", usernames: []});

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("groupId");
      expect(res.body.members).toContain(uid);
    });
  });

  describe("PATCH /groups/join", () => {
    let groupCode: string;

    beforeEach(async () => {
      groupCode = "JOIN123";

      // Clear previous groups to avoid duplicates
      const groupDocs = await getFirestore().collection("groups").get();
      await Promise.all(groupDocs.docs.map((doc) => doc.ref.delete()));

      await getFirestore()
        .collection("groups")
        .add({
          name: "Joinable Group",
          groupCode,
          members: [],
          admins: [uid],
          createdBy: uid,
        });
    });

    it("should return 401 if unauthenticated", async () => {
      const res = await request(app).patch("/groups/join").send({groupCode});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no groupCode provided", async () => {
      const res = await request(app)
        .patch("/groups/join")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Group code is required");
    });

    it("should return 404 if group not found", async () => {
      const res = await request(app)
        .patch("/groups/join")
        .set("Authorization", `Bearer ${token}`)
        .send({groupCode: "ZZZZZZ"});
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 200 if already a member", async () => {
      await getFirestore()
        .collection("groups")
        .where("groupCode", "==", groupCode)
        .get()
        .then((group) => group.docs[0].ref.update({members: [uid]}));

      const res = await request(app)
        .patch("/groups/join")
        .set("Authorization", `Bearer ${token}`)
        .send({groupCode});

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Already a member");
    });

    it("should return 200 and join group", async () => {
      const res = await request(app)
        .patch("/groups/join")
        .set("Authorization", `Bearer ${token}`)
        .send({groupCode});

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successfully joined group");
    });
  });

  describe("PATCH /groups/:group_id", () => {
    let groupId: string;

    beforeEach(async () => {
      const docRef = await getFirestore()
        .collection("groups")
        .add({
          name: "Old Group",
          groupCode: "ABC123",
          members: [uid],
          admins: [uid],
          createdBy: uid,
        });
      groupId = docRef.id;
    });

    it("should return 401 if unauthenticated", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}`)
        .send({name: "New Name"});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no name provided", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("New group name is required");
    });

    it("should update name and return 200", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({name: "New Name"});

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Group name updated");
    });

    it("should return 403 if not an admin", async () => {
      const {idToken: newToken, uid: newUid} = await createUserAndGetToken(
        "nonadmin@example.com"
      );

      await getFirestore().collection("users").doc(newUid).set({
        username: "nonadmin",
        email: "nonadmin@example.com",
      });

      const res = await request(app)
        .patch(`/groups/${groupId}`)
        .set("Authorization", `Bearer ${newToken}`)
        .send({name: "Hacked"});

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Forbidden");
    });

    it("should return 404 if group does not exist", async () => {
      const res = await request(app)
        .patch("/groups/doesnotexist")
        .set("Authorization", `Bearer ${token}`)
        .send({name: "LastMinute"});

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });
  });

  describe("PATCH /groups/:group_id/members", () => {
    let groupId: string;

    beforeEach(async () => {
      const docRef = await getFirestore()
        .collection("groups")
        .add({
          name: "Group to Add Members",
          groupCode: "JOIN123",
          members: [uid],
          admins: [uid],
          createdBy: uid,
        });
      groupId = docRef.id;

      await getFirestore().collection("users").doc("otherUser").set({
        username: "otherUser",
        email: "other@example.com",
      });
    });

    it("should return 401 if unauthenticated", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .send({usernames: ["otherUser"]});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if usernames not provided", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username(s) required");
    });

    it("should return 404 if group not found", async () => {
      const res = await request(app)
        .patch("/groups/invalidgroup/members")
        .set("Authorization", `Bearer ${token}`)
        .send({usernames: ["otherUser"]});
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 403 if not an admin", async () => {
      const {idToken: newToken, uid: newUid} = await createUserAndGetToken(
        "outsider@example.com"
      );

      await getFirestore().collection("users").doc(newUid).set({
        username: "outsider",
        email: "outsider@example.com",
      });

      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${newToken}`)
        .send({usernames: ["otherUser"]});

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Forbidden");
    });

    it("should return 200 and add member", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({usernames: ["otherUser"]});

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Members added successfully");
    });
  });

  describe("GET /groups/:group_id/members", () => {
    let groupId: string;

    beforeEach(async () => {
      const docRef = await getFirestore()
        .collection("groups")
        .add({
          name: "Group to get all members",
          groupCode: "JOIN123",
          members: [uidAlice, uid],
          admins: [uidAlice],
          createdBy: uidAlice,
        });
      groupId = docRef.id;
    });

    it("should return 404 and get all members related to a group", async () => {
      const res = await request(app)
        .get("/groups/projectThatDoesNotExist/members")
        .set("Authorization", `Bearer ${tokenAlice}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 200 and get all members related to a group", async () => {
      const res = await request(app)
        .get(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${tokenAlice}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty("uid");
      expect(res.body[0].rewardPoints).toBe(300);
    });
  });
});
