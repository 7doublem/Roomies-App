import request from "supertest";
import { app } from "../app";
import { createUserAndGetToken, deleteUsersAuth } from "./test.utils/utils";
import { DocumentReference, getFirestore } from "firebase-admin/firestore";
import { generateGroupCode } from "../utils/GroupCodeGenerator";

describe("Comments Tests", () => {
  let server: ReturnType<typeof app.listen>;
  let token: string;
  let uid: string;
  let tokenAlice: string;
  let uidAlice: string;

  let groupA: DocumentReference;
  let choreA: DocumentReference;

  async function deleteData() {
    await deleteUsersAuth([uid, uidAlice]);

    const users = await getFirestore().collection("users").listDocuments();
    for (const doc of users) await doc.delete();

    await getFirestore().recursiveDelete(getFirestore().collection("groups"));
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

    groupA = await getFirestore()
      .collection("groups")
      .add({
        name: "Group Admin",
        members: [uid, uidAlice],
        admins: [uid],
        createdBy: uid,
        groupCode: generateGroupCode(),
      });

    choreA = await getFirestore()
      .collection("groups")
      .doc(groupA.id)
      .collection("chores")
      .add({
        name: "Wash the dishes",
        description: "Use fairy original washing up",
        rewardPoints: 246,
        startDate: 1754648400, // 8/jun/2025 13:00
        dueDate: 1754821200, // 10/jun/2025 13:00
        assignedTo: uidAlice,
        status: "todo",
        createdBy: uid,
      });
  });

  afterEach(async () => {
    await deleteData();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /groups/:group_id/chores/:chore_id/comments", () => {
    // confirm the right router
    it("should return 401 if user is not authenticated", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
        createdBy: uid,
      };
      const res = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .send(newComment);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 400 if no commentBody are provided", async () => {
      const newComment = {};
      const res = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Commment's body is required");
    });

    it("should return 404 if no chore_id found", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
        createdBy: uid,
      };
      const res = await request(app)
        .post(`/groups/${groupA.id}/chores/choreNotFound/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Chore not found");
    });

    it("should return 201 and create a comment", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
      };
      const res = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      expect(res.status).toBe(201);
      const comment = res.body;
      expect(comment).toMatchObject({
        commentId: comment.commentId,
        commentBody: comment.commentBody,
        createdAt: expect.any(Number),
        createdBy: expect.any(String),
      });
    });
  });

  describe("GET /groups/:group_id/chores/:chore_id/comments", () => {
    // confirm the right router
    it("should return 401 if user is not authenticated", async () => {
      const res = await request(app).get(
        `/groups/${groupA.id}/chores/${choreA.id}/comments`
      );
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorised");
    });

    it("should return 404 if group does not exist", async () => {
      const res = await request(app)
        .get(`/groups/groupNotFound/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found");
    });

    it("should return 404 if chore does not exist", async () => {
      const res = await request(app)
        .get(`/groups/${groupA.id}/chores/choreNotFound/comments`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Chore not found");
    });

    it("should return 200 and empty array", async () => {
      const res = await request(app)
        .get(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 200 and get all comments related to a chore", async () => {
      await choreA.collection("comments").add({
        commentBody: "That's super boring!",
        createdBy: uidAlice,
        createdAt: 123356,
      });
      const res = await request(app)
        .get(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${tokenAlice}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(Array.isArray(res.body)).toBe(true);
      const comments = res.body;
      comments.forEach((comment: Comment) => {
        expect(comment).toMatchObject({
          commentId: expect.any(String),
          commentBody: expect.any(String),
          createdAt: expect.any(Number),
          createdBy: expect.any(String),
        });
      });
    });
  });

  describe("DELETE /groups/:group_id/chores/:chore_id/comment/:comment_id", () => {
    it("204 - Comment is successfully deleted", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
      };

      const commentRes = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      
      const comment = commentRes.body;
      const deleteRes = await request(app)
        .delete(
          `/groups/${groupA.id}/chores/${choreA.id}/comments/${comment.commentId}`
        )
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.status).toBe(204);

      const checkRes = await request(app)
        .get(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`);

      expect(checkRes.status).toBe(200);
      expect(checkRes.body).toEqual([]);
      expect(Array.isArray(checkRes.body)).toBe(true);
    });
    it("404 - Fails when group is invalid", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
      };
      const commentRes = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      const comment = commentRes.body;
      const deleteRes = await request(app)
        .delete(
          `/groups/FAIL/chores/${choreA.id}/comments/${comment.commentId}`
        )
        .set("Authorization", `Bearer ${token}`);
      expect(deleteRes.status).toBe(404);
      expect(deleteRes.body.message).toBe("Group not found")
    });
    it("404 - Fails when chore is invalid", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
      };
      const commentRes = await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      const comment = commentRes.body;
      const deleteRes = await request(app)
        .delete(
          `/groups/${groupA.id}/chores/FAIL/comments/${comment.commentId}`
        )
        .set("Authorization", `Bearer ${token}`);
      expect(deleteRes.status).toBe(404);
      expect(deleteRes.body.message).toBe("Chore not found")
    });
    it("404 - Fails when comment is invalid", async () => {
      const newComment = {
        commentBody: "Don't forget to wash gold porcelain glasses by hand",
      };
      await request(app)
        .post(`/groups/${groupA.id}/chores/${choreA.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send(newComment);
      const deleteRes = await request(app)
        .delete(
          `/groups/${groupA.id}/chores/${choreA.id}/comments/FAIL`
        )
        .set("Authorization", `Bearer ${token}`);
      expect(deleteRes.status).toBe(404);
      expect(deleteRes.body.message).toBe("Comment not found")
    });
  });
});
