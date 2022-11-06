const express = require("express");
const protect = require("../authenticate");
const {
  getUserBlogs,
  createBlog,
  getPublishedBlogs,
  publishBlog,
  deleteBlog,
} = require("../controller/blog");
const blogRouter = express.Router();

blogRouter.get("/me", protect, getUserBlogs);
blogRouter.post("/create", protect, createBlog);
blogRouter.get("/", getPublishedBlogs);
blogRouter
  .patch("/:id", protect, publishBlog)
  .get("/:id", getPublishedBlogs)
  .delete("/:id", protect, deleteBlog);

module.exports = blogRouter;
