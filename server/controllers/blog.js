const Blog = require("../models/blog.js");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    createdBlog: response ? response : "error when create Blog ",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    updatedBlog: response ? response : "error when update Blog ",
  });
});

const getAllBlog = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    Blogs: response ? response : "error when get all Blogs ",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.listOfDislikes?.find(
    (el) => el.toString() === _id
  );
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { listOfDislikes: _id, isDisliked: false } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  }
  const isLiked = blog?.listOfLikes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { listOfLikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { listOfLikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.listOfLikes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { listOfLikes: _id, isDisliked: false } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  }
  const isDislike = blog?.listOfDislikes?.find((el) => el.toString() === _id);
  if (isDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { listOfDislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { listOfDislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      results: response,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { viewNumber: 1 } },
    { new: true }
  )
    .populate("listOfLikes", "firstName lastName")
    .populate("listOfDislikes", "firstName lastName");
  return res.json({
    success: blog ? true : false,
    results: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    delete: blog,
  });
});

const uploadBlogImg = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing inputs");
  const response = await Blog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  );
  console.log(response);
  return res.status(200).json({
    status: response ? true : false,
    updatedBlogImg: response ? response : "Error when upload blog image",
  });
});

module.exports = {
  createBlog,
  updateBlog,
  getAllBlog,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadBlogImg,
};
