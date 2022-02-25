// Write your tests here
const Users = require("./auth/users-model");
const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");

const sampleUser1 = {
  username: "Tom Brady",
  password: "I retired",
};
const sampleUser2 = {
  username: "Aaron Rodgers",
  password: "I retired too",
};
const sampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6IkdsZW4iLCJpYXQiOjE2NDU3NjIxNTYsImV4cCI6MTY0NTg0ODU1Nn0.n8sVk1GWsUdfQxzPlRyvOyJjT_gw26XEZtaFgvbCNVM";

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

test("verify we are using the correct environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("test server endpoints", () => {
  test("[POST] /api/auth/register", async () => {
    let result = await request(server)
      .post("/api/auth/register")
      .send(sampleUser1);
    expect(result.status).toBe(201);

    result = await Users.findById(1);
    expect(result.username).toBe(sampleUser1.username);
  });

  test("[POST] /api/auth/register | returns 401 when missing username", async () => {
    let result = await request(server)
      .post("/api/auth/register")
      .send({ password: "I retired" });
    expect(result.status).toBe(401);
  });

  test("[POST] /api/auth/login", async () => {
    await request(server).post("/api/auth/register").send(sampleUser2);

    let result = await request(server)
      .post("/api/auth/login")
      .send(sampleUser2);
    expect(result.status).toBe(200);
  });

  test("[POST] /api/auth/login | returns 401 with invalid credentials", async () => {
    await request(server).post("/api/auth/register").send(sampleUser1);

    let result = await request(server)
      .post("/api/auth/login")
      .send({ username: "Tom Brady", password: "I'm still playing!" });
    expect(result.status).toBe(401);
  });

  test("[GET] /api/jokes", async () => {
    let result = await request(server)
      .get("/api/jokes")
      .set({ authorization: sampleToken });
    expect(result.status).toBe(200);
  });

  test("[GET] /api/jokes | returns 401 when missing token", async () => {
    let result = await request(server).get("/api/jokes");
    expect(result.status).toBe(401);
  });
});
