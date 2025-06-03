import request from "supertest";
import app from "../index"; 

const BASE_URL = "/users"
const testUserToken = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhdXRoX3RpbWUiOjE3NDg4OTg2MzAsInVzZXJfaWQiOiJRTmxoTFZlQnA1SGw2R2FmQWtsYkU5NThnZHN1IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0dXNlckBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn0sImlhdCI6MTc0ODg5ODYzMCwiZXhwIjoxNzQ4OTAyMjMwLCJhdWQiOiJyb29taWVzLWFwcC0zMjM2MiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yb29taWVzLWFwcC0zMjM2MiIsInN1YiI6IlFObGhMVmVCcDVIbDZHYWZBa2xiRTk1OGdkc3UifQ."; 

describe("Users API", () => {
  it("GET /users → 200 and returns users", async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set("Authorization", `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /users → 201 and returns new user", async () => {
    const newUser = {
      id: "jest_test_user",
      name: "Jest User",
      user_avatar_url: "https://example.com/avatar.png",
    };

    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${testUserToken}`)
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newUser);
  });

  it("GET /users → 401 with no token", async () => {
    const res = await request(app).get(BASE_URL);
    expect(res.status).toBe(401);
  });
});
