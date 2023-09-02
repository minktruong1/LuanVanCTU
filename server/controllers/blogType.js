const BlogType = require("../models/blogType.js");
const asyncHandler = require("express-async-handler");

const createBlogType = asyncHandler(async (req, res) => {
  const response = await BlogType.create(req.body);
  return res.json({
    success: response ? true : false,
    createdBlogType: response ? response : "error when create Blog type",
  });
});

const getAllBlogType = asyncHandler(async (req, res) => {
  const response = await BlogType.find().select("title _id");
  return res.json({
    success: response ? true : false,
    Categories: response ? response : "error when get all Blog type",
  });
});

const updateBlogType = asyncHandler(async (req, res) => {
  const { btid } = req.params;
  const response = await BlogType.findByIdAndUpdate(btid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedBlogType: response ? response : "error when update Blog type",
  });
});

const deleteBlogType = asyncHandler(async (req, res) => {
  const { btid } = req.params;
  const response = await BlogType.findByIdAndDelete(btid);

  return res.json({
    success: response ? true : false,
    deletedBlogType: response ? response : "error when delete BlogType",
  });
});

module.exports = {
  createBlogType,
  getAllBlogType,
  updateBlogType,
  deleteBlogType,
};
