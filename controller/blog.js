const User = require("../model/User");
const Blog = require("../model/Blog");

const getAllBlogs = async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find();
    if (!blogs) {
      return res.status(400).json({
        message: "No Blogs Found!",
      });
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({
    allBlogs: {
      blogs,
    },
  });
};

module.exports = { getAllBlogs };
