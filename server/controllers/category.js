const Category = require("../models/category.js");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await Category.create(req.body);
  return res.json({
    success: response ? true : false,
    createdCategory: response ? response : "error when create category",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const response = await Category.find().select("title _id");
  return res.json({
    success: response ? true : false,
    Categories: response ? response : "error when get all categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "error when update category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndDelete(cid);

  return res.json({
    success: response ? true : false,
    deletedCategory: response ? response : "error when delete category",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
