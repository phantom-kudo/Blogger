const express = require("express");
const blogRouter = express.Router();
const {
  createBlogs,
  updateBlogs,
  deleteBlogs,
  getBlogsByUserId,
} = require("../controller/blog");
const { auth } = require("../middleware/auth");

blogRouter.get("/get-blogs-user-id", auth, getBlogsByUserId);
blogRouter.post("/add-blog", auth, createBlogs);
blogRouter.put("/update-blog", auth, updateBlogs);
blogRouter.delete("/delete-blog", auth, deleteBlogs);

module.exports = blogRouter;
