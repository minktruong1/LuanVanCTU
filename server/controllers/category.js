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

const uploadCategoryImage = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  if (!req.file) throw new Error("Missing inputs");

  const updatedCategory = await Category.findByIdAndUpdate(
    cid,
    { image: req.file.path }, // Assuming you're storing the image path in the 'image' field of your Category model
    { new: true }
  );

  return res.status(200).json({
    success: updatedCategory ? true : false,
    updatedCategory: updatedCategory
      ? updatedCategory
      : "error when upload category image",
  });
});

// Lấy tất cả danh mục
const getAllCategories = asyncHandler(async (req, res) => {
  const response = await Category.find();

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
  uploadCategoryImage,
};
