import request from "supertest";
import {app} from "../app";
import {DocumentReference, getFirestore} from "firebase-admin/firestore";
import {createUserAndGetToken, deleteUsersAuth} from "./test.utils/utils";
import {generateGroupCode} from "../utils/GroupCodeGenerator";
import {Chore} from "../controllers/chores.controller";

describe("Chore Tests", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;
  // let tokenAlice: string;
  let uidAlice: string;

  // let choreA: DocumentReference;
  let groupA: DocumentReference;

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
    // tokenAlice = resultAlice.idToken;
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

    groupA = await getFirestore().collection("groups").add({
      name: "Group Admin",
      members: [uid, uidAlice],
      admins: [uid],
      createdBy: uid,
      groupCode: generateGroupCode(),
    });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /groups/:group_id/chores", () => {
    it("should return 401 if user is not authenticated", async () => {
      const newChore = {
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      };

      const res = await request(app)
        .post(`/groups/${groupA.id}/chores`)
        .send(newChore);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no obligatory fields are provided - name", async () => {
      const newChore = {
        // groupId: groupA.id, // it should be a subcollection
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      };

      const res = await request(app)
        .post(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`)
        .send(newChore);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Name, rewardPoints, dueDate, and status are required");
    });

    it("should return 400 if no obligatory fields provided - dueDate", async () => {
      const newChore = {
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        // dueDate: 1754821200, // 10/jun/2025 13:00 missing field
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      };

      const res = await request(app)
        .post(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`)
        .send(newChore);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Name, rewardPoints, dueDate, and status are required");
    });

    it("should return 400 if status is not valid", async () => {
      const newChore = {
        // groupId: groupA.id, // it should be a subcollection
        name: "Clean the bathroom",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "InvalidStatus",
        createdBy: uid,
      };

      const res = await request(app)
        .post(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`)
        .send(newChore);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Chore' status must be: todo, doing or done");
    });

    it("should return 404 if group does not exist", async () => {
      const newChore = {
        // groupId: groupA.id,
        name: "Chore to test",
        description: "Let's testing", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00 Timestamp.now(),seconds
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        // createdBy: uid,
      };
      const res = await request(app)
        .post("/groups/groupNotFound/chores")
        .set("Authorization", `Bearer ${token}`)
        .send(newChore);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 201 and create a chore", async () => {
      const newChore = {
        // groupId: groupA.id,
        name: "Chore to test",
        // description: "Let's testing", //optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00 Timestamp.now(),seconds
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        // createdBy: uid,
      };

      const res = await request(app)
        .post(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`)
        .send(newChore);
      expect(res.status).toBe(201);
      const chore = res.body;
      console.log(chore, "post chore");
      expect(chore.name).toContain("Chore to test");
      expect(chore).toMatchObject({
        // groupId: expect.any(String),
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        rewardPoints: expect.any(Number),
        startDate: expect.any(Number),
        dueDate: expect.any(Number),
        assignedTo: expect.any(String),
        status: expect.any(String),
        createdBy: expect.any(String),
      });
    });
  });

  describe("GET /groups/:group_id/chores", () => {
    it("should return 401 when group does not exist", async () => {
      const res = await request(app)
        .get(`/groups/${groupA.id}/chores`);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 404 when group does not exist", async () => {
      const res = await request(app)
        .get("/groups/choreNotFound/chores")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 200 and empty array", async () => {
      const res = await request(app)
        .get(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 200 and an array of chores", async () => {
      await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const res = await request(app)
        .get(`/groups/${groupA.id}/chores`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      const chores = res.body;
      console.log(chores, "get chores");
      expect(chores).toHaveLength(1);
      expect(Array.isArray(chores)).toBe(true);
      chores.forEach((chore: Chore) => {
        expect(chore).toMatchObject({
          // groupId: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          rewardPoints: expect.any(Number),
          startDate: expect.any(Number),
          dueDate: expect.any(Number),
          assignedTo: expect.any(String),
          status: expect.any(String),
          createdBy: expect.any(String),
        });
      });
    });
  });

  describe("PATCH /groups/:group_id/chores/:chore_id", () => {
    it("should return 401 if user is not authenticated", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const updatedChore = {
        // groupId: groupA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      };

      const res = await request(app)
        .patch(`/groups/${groupA.id}/chores/${choreA.id}`)
        .send(updatedChore);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if status is not valid", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const updatedChore = {
        // groupId: groupA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "InvalidStatus",
        createdBy: uid,
      };

      const res = await request(app)
        .patch(`/groups/${groupA.id}/chores/${choreA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedChore);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Chore' status must be: todo, doing or done");
    });

    it("should return 404 if group does not exist", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const updatedChore = {
        // groupId: groupA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      };

      const res = await request(app)
        .patch(`/groups/GroupNotFound/chores/${choreA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedChore);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 200 and update a chore, ignoring invalid fields", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const updatedChore = {
        // groupId: groupA.id,
        id: "ZpQwcGLzKq9DqgNn9HL",
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      };

      const res = await request(app)
        .patch(`/groups/${groupA.id}/chores/${choreA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedChore);
      expect(res.status).toBe(201);
      const chore = res.body;
      expect(chore).toMatchObject({
        // groupId: groupA.id,
        id: choreA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      });
    });

    it("should return 201 but createdBy must be ignored", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uidAlice, // can not be updated
      });

      const updatedChore = {
        // groupId: groupA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1749487200, // 9/jun/2025 14:00
        dueDate: 1750002000, // 15/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: "BANANA",
      };

      const res = await request(app)
        .patch(`/groups/${groupA.id}/chores/${choreA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedChore);
      expect(res.status).toBe(201);
      const chore = res.body;
      expect(chore).toMatchObject({
        // groupId: groupA.id,
        id: choreA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1749487200, // 9/jun/2025 14:00
        dueDate: 1750002000, // 15/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uidAlice,
      });
    });

    it("should return 201 and update a chore", async () => {
      const choreA = await getFirestore().collection("groups").doc(groupA.id).collection("chores").add({
        // groupId: groupA.id,
        name: "Chore to test",
        description: "", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });

      const updatedChore = {
        // groupId: groupA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      };

      const res = await request(app)
        .patch(`/groups/${groupA.id}/chores/${choreA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedChore);
      expect(res.status).toBe(201);
      const chore = res.body;
      console.log(chore, "patch chore");
      expect(chore).toMatchObject({
        // groupId: groupA.id,
        id: choreA.id,
        name: "Chore to test updated",
        description: "updated", // optional
        rewardPoints: 87,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "doing",
        createdBy: uid,
      });
    });
  });
});
