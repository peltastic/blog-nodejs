const request = require("supertest");
const { connect } = require("./database");
const UserModel = require("../model/user");
const app = require("../app");

describe("Auth: Signup", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .set("content-type", "application/json")
      .send({
        email: "pelz@gmail.com",
        password: "3123pex3123",
        first_name: "Pelumi",
        last_name: "Onasoga",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("first_name", "Pelumi");
    expect(response.body.user).toHaveProperty("last_name", "Onasoga");
    expect(response.body.user).toHaveProperty("email", "pelz@gmail.com");
  });

  it("should login a user", async () => {
    // create user in out db
    const user = await UserModel.create({
      email: "pelzo@gmail.com",
      password: "3123pex3123",
    });

    // login user
    const response = await request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({
        email: "pelzo@gmail.com",
        password: "3123pex3123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
