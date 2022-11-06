const request = require("supertest");
const { connect } = require("./database");
const app = require("../app");
const BlogModel = require("../model/blog");
const UserModel = require("../model/user");

describe(" Testing All Blog Auth Routes", () => {
  let conn;
  let token;
  let user;
  let createdBlogId;
  beforeAll(async () => {
    conn = await connect();
    user = await UserModel.create({
      email: "pelza@gmail.com",
      password: "3123pex",
      first_name: "pelza",
      last_name: "pelx",
    });
    const loginResponse = await request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({ email: "pelza@gmail.com", password: "3123pex" });

    token = loginResponse.body.token;
  });
  afterEach(async () => {
    await conn.cleanup();
  });
  afterAll(async () => {
    await conn.disconnect();
  });
  it("should return a blog posts GET /blog/", async () => {
    await BlogModel.create({
      title: "How to use Python",
      description: "A guide on how to use Python",
      author: user._id,
      tags: ["Python"],
      body: "Python is an open source programming language used for general purpose. Python was developed by Google engineers to create dependable and efficient software. Most similarly modeled after C, Go is statically typed and explicit. The language was designed by taking inspiration for the productivity and relative simplicity of Python, with the ability of C. Some of the problems that Go addresses are slow build time, uncontrolled dependencies, effort duplication, difficulty of writing automatic tools and cross-language development.Go works by using 'goroutines,' or lightweight processe which allows further efficiencies. Go also uses a collection of packages for efficient dependency management. Some examples of organizations that use Go include Google, Cloudflare, Dropbox, MongoDB, Netflix, SoundCloud, Twitch and Uber",
    });
    await BlogModel.create({
      title: "How to use Go",
      description: "A guide on how to use Go",
      author: user._id,
      tags: ["Golang"],
      body: "Go (also called Golang or Go language) is an open source programming language used for general purpose. Python was developed by Google engineers to create dependable and efficient software. Most similarly modeled after C, Go is statically typed and explicit. The language was designed by taking inspiration for the productivity and relative simplicity of Python, with the ability of C. Some of the problems that Go addresses are slow build time, uncontrolled dependencies, effort duplication, difficulty of writing automatic tools and cross-language development.Go works by using 'goroutines,' or lightweight processe which allows further efficiencies. Go also uses a collection of packages for efficient dependency management. Some examples of organizations that use Go include Google, Cloudflare, Dropbox, MongoDB, Netflix, SoundCloud, Twitch and Uber",
    });
    const response = await await request(app).get("/blog/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("success", true);
  });
  it("should create a blog POST /blog/create", async () => {
    const response = await request(app)
      .post("/blog/create")
      .set("content-type", "application/json")
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        title: "How to use Python",
        description: "A guide on how t use Python",
        author: "63660305436852e9b14713b8",
        tags: ["Python"],
        body: "Go (also called Golang or Go language) is an open source programming language used for general purpose. Python was developed by Google engineers to create dependable and efficient software. Most similarly modeled after C, Go is statically typed and explicit. The language was designed by taking inspiration for the productivity and relative simplicity of Python, with the ability of C. Some of the problems that Go addresses are slow build time, uncontrolled dependencies, effort duplication, difficulty of writing automatic tools and cross-language development.Go works by using 'goroutines,' or lightweight processe which allows further efficiencies. Go also uses a collection of packages for efficient dependency management. Some examples of organizations that use Go include Google, Cloudflare, Dropbox, MongoDB, Netflix, SoundCloud, Twitch and Uber",
      });
    createdBlogId = response.body.data._id;
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("success", true);
  });
  it("should return the blogs of logged in user blog GET /blog/me", async () => {
    const response = await request(app)
      .get("/blog/me")
      .set("content-type", "application/json")
      .set(`Authorization`, `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("success", true);
  });
  it("should publish a blog PATCH /blog/:id", async () => {
    const response = await request(app)
      .patch(`/blog/${createdBlogId}`)
      .set("content-type", "application/json")
      .set(`Authorization`, `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("success", true);
  });
  it("should return a published blog GET /blog/:id", async () => {
    const response = await request(app)
      .get(`/blog/${createdBlogId}`)
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("success", true);
  });
  it("should delete a blog DELETE /blog/:id", async () => {
    const response = await request(app)
      .delete(`/blog/${createdBlogId}`)
      .set("content-type", "application/json")
      .set(`Authorization`, `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Blog deleted");
    expect(response.body).toHaveProperty("success", true);
  });
});
