import request from "supertest";
import {app} from "../app";
import {createUserAndGetToken, deleteUsers} from "./test.utils/utils";
import {DocumentReference, getFirestore} from "firebase-admin/firestore";
import {generateGroupCode} from "../utils/GroupCodeGenerator";

describe("Comments Tests", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;
  let tokenAlice: string;
  let uidAlice: string;

  let taskA: DocumentReference;

  async function deleteData() {
    await deleteUsers([uid, uidAlice]);

    const users = await getFirestore().collection("users").listDocuments();
    for (const doc of users) await doc.delete();

    const groups = await getFirestore().collection("groups").listDocuments();
    for (const doc of groups) await doc.delete();

    const tasks = await getFirestore().collection("tasks").listDocuments();
    for (const doc of tasks) await doc.delete();

    const comments = await getFirestore().collection("comments").listDocuments();
    for (const doc of comments) await doc.delete();
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

    const groupA = await getFirestore().collection("groups").add({
      name: "Group Admin",
      members: [uid, uidAlice],
      admins: [uid],
      createdBy: uid,
      groupCode: generateGroupCode(),
    });

    taskA = await getFirestore().collection("tasks").add({
      groupId: groupA.id,
      name: "Wash the dishes",
      description: "Use fairy original washing up",
      assigned_to: uidAlice,
      countdown: 0,
      reward_points: 246,
      status: "to do",
    });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /comments/tasks/:task_id", () => { // confirm the right router
    it("should return 401 if unauthenticated", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
        createdBy: uid,
      };
      const res = await request(app)
        .post(`/comments/tasks/${taskA.id}`)
        .send(newComment);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no commentBody provided", async () => {
      const newComment = {
        createdBy: uid,
      };
      const res = await request(app)
        .post(`/comments/tasks/${taskA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Commment's body is required");
    });

    it("should return 404 if no task_id found", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
        createdBy: uid,
      };
      const res = await request(app)
        .post("/comments/tasks/taskNotFound")
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found");
    });

    it("should create a comment and return 201", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
        createdBy: uid,
      };
      const res = await request(app)
        .post(`/comments/tasks/${taskA.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("taskId");
      expect(res.body.taskId).toContain(taskA.id);
      expect(res.body.commentBody).toEqual("Don't forget to wash gold porcelain glasses by hand");
    });
  });


  describe("GET /comments/tasks/:task", () => { // confirm the right router
    it("should return 404", async () => {
      const res = await request(app)
        .get("/comments/tasks/taskNotFound")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found");
    });

    it("should return 200 and empty array", async () => {
      const res = await request(app)
        .get(`/comments/tasks/${taskA.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 200 and get all comments related to a task", async () => {
      await getFirestore().collection("comments").add({
        taskId: taskA.id,
        commentBody: "That's super boring!",
        createdBy: uidAlice,
        createdAt: 123356,
      });

      const res = await request(app)
        .get(`/comments/tasks/${taskA.id}`)
        .set("Authorization", `Bearer ${tokenAlice}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(Array.isArray(res.body)).toBe(true);
      const comments = res.body;
      comments.forEach((comment: Comment) => {
        expect(comment).toMatchObject({
          commentId: expect.any(String),
          taskId: expect.any(String),
          commentBody: expect.any(String),
          createdAt: expect.any(Number),
          createdBy: expect.any(String),
        });
      });
    });
  });
});
