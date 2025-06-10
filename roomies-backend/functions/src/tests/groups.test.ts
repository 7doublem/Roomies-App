import request from "supertest";
import {app} from "../app";
import {createUserAndGetToken, deleteUsersAuth} from "./test.utils/utils";
import {getFirestore} from "firebase-admin/firestore";
import {generateGroupCode} from "../utils/GroupCodeGenerator";
import {Group} from "../controllers/groups.controller";

describe("Group Tests", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;

  let tokenAlice: string;
  let uidAlice: string;

  async function deleteData() {
    await deleteUsersAuth([uid, uidAlice]);

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
      avatarUrl: "https://adminuser.com",
      rewardPoints: 300,
    });

    await getFirestore().collection("users").doc(uidAlice).set({
      username: "Alice",
      email: "alice@example.com",
      avatarUrl: "https://adminuser.com",
      rewardPoints: 100,
    });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("GET /groups", () => {
    it("should return 401 if user is not authenticated", async () => {
      const res = await request(app)
        .get("/groups");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 200 and empty array", async () => {
      const res = await request(app)
        .get("/groups")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 200 and an array of chores", async () => {
      await getFirestore().collection("groups").add({
        name: "Group Admin",
        members: [uid, uidAlice],
        admins: [uid],
        createdBy: uid,
        groupCode: generateGroupCode(),
      });

      const res = await request(app)
        .get("/groups")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      const groups = res.body;
      console.log(groups, "return a list of chores")
      expect(groups).toHaveLength(1);
      expect(Array.isArray(groups)).toBe(true);
      groups.forEach((group: Group) => {
        expect(group).toMatchObject({
          groupId: expect.any(String),
          name: group.name,
          members: group.members,
          admins: group.admins,
          createdBy: expect.any(String),
          groupCode: expect.any(String),
        });
      });
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

    it("should return 201 and create a group", async () => { // uid as a not found member
      const newGroup = {
        name: "Group Admin",
        members: ["adminuser", "Alice"],
      };

      const res = await request(app)
        .post("/groups")
        .set("Authorization", `Bearer ${token}`)
        .send(newGroup);
      expect(res.status).toBe(201);
      const group = res.body;
      console.log(group, "create a group")
      expect(group).toMatchObject({
        groupId: expect.any(String),
        name: group.name,
        members: [uid, uidAlice],
        admins: [uid],
        createdBy: uid,
        groupCode: expect.any(String),
      });
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
          members: [uid],
          admins: [uid],
          createdBy: uid,
        });
    });

    it("should return 401 if unauthenticated", async () => {
      const res = await request(app).patch("/groups/join")
        .send({groupCode});
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
        .set("Authorization", `Bearer ${tokenAlice}`)
        .send({groupCode});

      expect(res.status).toBe(200);
      const group = res.body;
      console.log(group, "user join a group by groupId")
      expect(group).toMatchObject({
        groupId: expect.any(String),
        name: group.name,
        members: [uid, uidAlice],
        admins: group.admins,
        createdBy: uid,
        groupCode: expect.any(String),
      });
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
      console.log(res.body, "update group name")
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

      await deleteUsersAuth([newUid]);
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
          members: ["adminuser"],
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
        .send({members: ["otherUser"]});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 401 if no name or members are provided", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Nothing to update");
    });

    it("should return 404 if group not found", async () => {
      const res = await request(app)
        .patch("/groups/invalidgroup/members")
        .set("Authorization", `Bearer ${token}`)
        .send({members: ["otherUser"]});
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
        .send({members: ["otherUser"]});

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Only admins can update");

      await deleteUsersAuth([newUid]);
    });

    it("should return 200 and update group - name and members", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({name: "Group with Alice", members: ["Alice"]});

      expect(res.status).toBe(200);
      const group = res.body;
      console.log(res.body, "update group - name and members")
      expect(group).toMatchObject({
        groupId: expect.any(String),
        name: group.name,
        members: group.members,
        admins: group.admins,
        createdBy: expect.any(String),
        groupCode: expect.any(String),
      });
    });
    it("should return 200 and add new name", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({members: ["Alice"]});
      expect(res.status).toBe(200);
      const group = res.body;
      expect(group).toMatchObject({
        groupId: expect.any(String),
        name: group.name,
        members: group.members,
        admins: group.admins,
        createdBy: expect.any(String),
        groupCode: expect.any(String),
      });
    });

    it("should return 200 and add new name", async () => {
      const res = await request(app)
        .patch(`/groups/${groupId}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({name: "That's my new name"});

      expect(res.status).toBe(200);
      const group = res.body;
      expect(group).toMatchObject({
        groupId: expect.any(String),
        name: group.name,
        members: group.members,
        admins: group.admins,
        createdBy: expect.any(String),
        groupCode: expect.any(String),
      });
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
      const groups = res.body;
      console.log(groups, "get all members related to a group")
      groups.forEach((group: Comment) => {
        expect(group).toMatchObject({
          uid: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          avatarUrl: expect.any(String),
          rewardPoints: expect.any(Number),
        });
      });
    });
  });
});
