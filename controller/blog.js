const User = require("../model/User");
const Blog = require("../model/Blog");

//Create-new-blog
const createBlogs = async (req, res) => {
  const { title, imgUrl, description } = req.body;
  if (!title) {
    return res.status(400).json({
      message: "Please provide title",
    });
  }
  if (!imgUrl) {
    return res.status(400).json({
      message: "Please provide image url",
    });
  }
  if (!description) {
    return res.status(400).json({
      message: "Please provide description",
    });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(500).json({ message: "User not found by this Id!!!" });
    }
    const userBlog = new Blog({
      title,
      imgUrl,
      description,
      createdAt: Date.now(),
      user: req.user._id,
    });
    await userBlog.save();
    user.userBlogs.push(userBlog._id);
    await user.save();
    return res.status(200).json({
      Blog: {
        userBlog,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Update-existing-blog
const updateBlogs = async (req, res) => {
  if (!req.user._id) {
    return res.status(400).send("unAuthorized");
  }
  const { blogId } = req.query;
  const { imgUrl, description } = req.body;
  if (!blogId) {
    return res.status(400).json({
      message: "Please provide blog id",
    });
  }
  try {
    const blog = await Blog.findById(blogId);
    if (!description) {
      blog.imgUrl = imgUrl;
    }
    if (!imgUrl) {
      blog.description = description;
    }
    if (description && imgUrl) {
      blog.imgUrl = imgUrl;
      blog.description = description;
    }
    blog.updatedAt = Date.now;
    await blog.save();
    return res.status(200).json({
      updatedBlog: {
        blog,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Delete-existing-blog-from-db-and-removing-from-user-schema
const deleteBlogs = async (req, res) => {
  if (!req.user._id) {
    return res.status(400).send("unAuthorized");
  }
  const { blogId } = req.query;
  if (!blogId) {
    return res.status(400).json({
      message: "Please provide blog id",
    });
  }
  try {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      res.status(500).json({
        message: "No Blog exists",
      });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { userBlogs: blogId },
    });

    res.status(200).json({
      message: "Blog has been Deleted Successfully",
    });
    // await blog.user.userBlogs.pull(blog);
    // await blog.user.save();
  } catch (err) {
    console.log(err);
  }
};

//Get-Blogs-By-User-Id-with-pagination
const getBlogsByUserId = async (req, res) => {
  if (!req.user._id) {
    return res.status(400).send("unAuthorized!");
  }
  const { page = 1, recordsPerPage = 10 } = req.query;
  try {
    await Blog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(recordsPerPage)
      .skip((page - 1) * recordsPerPage)
      .then(async (blogs) => {
        if (!blogs) return res.status(400).send("No Blogs found");
        const count = await Blog.countDocuments({ user: req.user._id });
        return res.status(200).json({
          blogs: {
            blogs,
          },
          totalBlogs: count,
        });
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createBlogs,
  updateBlogs,
  deleteBlogs,
  getBlogsByUserId,
};
