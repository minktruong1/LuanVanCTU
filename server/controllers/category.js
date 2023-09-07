const Category = require("../models/category.js");
const asyncHandler = require("express-async-handler");

// Tạo một danh mục mới
const createCategory = asyncHandler(async (req, res) => {
  const { title, brand } = req.body;

  const response = await Category.create({ title, brand });

  return res.json({
    success: true,
    createdCategory: response,
  });
});

// Lấy tất cả danh mục
const getAllCategories = asyncHandler(async (req, res) => {
  const response = await Category.find().select("title brand _id");

  return res.json({
    success: true,
    categories: response,
  });
});

// Cập nhật danh mục dựa trên ID
const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { title, brand } = req.body;

  const response = await Category.findByIdAndUpdate(
    cid,
    { title, brand },
    { new: true }
  );

  return res.json({
    success: true,
    updatedCategory: response,
  });
});

// Xoá danh mục dựa trên ID
const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  const response = await Category.findByIdAndDelete(cid);

  return res.json({
    success: true,
    deletedCategory: response,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
