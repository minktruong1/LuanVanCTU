const Category = require("../models/category.js");
const asyncHandler = require("express-async-handler");

// Tạo một danh mục mới
const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const image = req?.files?.image[0]?.path;

  if (!title) {
    throw new Error("Thiếu dữ liệu");
  }

  if (req.body.image) {
    req.body.image = image;
  }

  const response = await Category.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    message: response ? response : "Lỗi tạo nhóm",
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
  const { title } = req.body;

  const response = await Category.findByIdAndUpdate(
    cid,
    { title },
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

const addBrandToCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { brand } = req.body;

  const response = await Category.findById(cid);

  if (response) {
    if (response.brand.includes(brand)) {
      return res.status(200).json({
        success: false,
        message: "Thương hiệu đã tồn tại trong danh mục",
      });
    } else {
      response.brand.push(brand);
      await response.save();
      return res.status(200).json({
        success: true,
        message: "Thương hiệu đã được thêm vào danh mục",
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy danh mục",
    });
  }
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  addBrandToCategory,
};
