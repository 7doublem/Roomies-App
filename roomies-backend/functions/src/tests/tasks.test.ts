import request from "supertest";
import { app } from "../app";
import { getFirestore } from "firebase-admin/firestore";

describe("Task Routes", () => {
  let server: ReturnType<typeof app.listen>;
  let groupId: string;

  beforeAll(async () => {
    server = app.listen(5003);

    const groupRef = await getFirestore()
      .collection("groups")
      .add({
        name: "testgroup",
        groupCode: "KLO903",
        members: ["K01"],
        admins: ["K01"],
        createdBy: "A",
      });

    groupId = groupRef.id;
    console.log("Created Id", groupId)

    await getFirestore()
      .collection("groups")
      .doc(groupId)
      .collection("tasks")
      .add({
        name: "Test task",
        description: "Desc",
        assigned_to: "K01",
        countdown: "24:00",
        reward_points: 5,
        status: "In Progress",
      });
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(async () => {
    const groups = await getFirestore().collection("groups").listDocuments();
    for (const group of groups) {
      const tasks = await getFirestore().collection("tasks").listDocuments();
      for (const task of tasks) await task.delete();
      await group.delete();
    }
  });

  describe("GET /groups/:group_id/tasks", () => {
    it("should return 200 and an array of tasks", async () => {
      const res = await request(app).get(`/groups/${groupId}/tasks`);
      expect(res.status).toBe(200);
      expect(res.body.tasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Test task",
            description: "Desc",
            assigned_to: "K01",
            id: expect.any(String),
            countdown: "24:00",
            reward_points: 5,
            status: "In Progress",
          }),
        ])
      );
    });
  });

  describe("POST /groups/:group_id/tasks", () => {
    it("201 - should return 201 and posted task", async () => {
      console.log("Sent Id", groupId)
      const res = await request(app)
        .post(`/groups/${groupId}/tasks`)
        .send({
          name: "Test task",
          description: "",
          assigned_to: "Test Name",
          countdown: "24-0-0",
          reward_points: 5,
          status: "In Progress",
        });
      expect(res.status).toBe(201);
      expect(res.body.task).toEqual(
        expect.objectContaining({
          name: "Test task",
          description: "",
          assigned_to: "Test Name",
          id: expect.any(String),
          countdown: "24-0-0",
          reward_points: 5,
          status: "In Progress",
        })
      );
    });
    it("400 - should return error message for missing fields", async () => {
      const res = await request(app)
        .post(`/groups/${groupId}/tasks`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing or invalid task fields.")
    })
    it("404 - should return error message for missing group id", async () => {
      const res = await request(app)
        .post(`/groups/jndwhdbnjsmksauhbfdjkfh/tasks`)
        .send({
          name: "Test task",
          description: "",
          assigned_to: "Test Name",
          countdown: "24-0-0",
          reward_points: 5,
          status: "In Progress",
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Group not found.")
    })
  });
});
