const Category = require("../models/category.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Tạo một danh mục mới
const createCategory = asyncHandler(async (req, res) => {
  const { title, brand } = req.body;
  const image = req?.files?.image[0]?.path;

  if (!(title && brand)) {
    throw new Error("Thông tin đầu vào bị thiếu");
  }

  if (req.body.image) {
    req.body.image = image;
  }

  if (req.body.brand && typeof req.body.brand === "string") {
    req.body.brand = req.body.brand.split(",").map((item) => item.trim());
  }

  req.body.slug = slugify(title);

  const response = await Category.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Tạo danh mục thành công" : "Không tạo được danh mục",
  });
});

// Lấy tất cả danh mục
const getAllCategories = asyncHandler(async (req, res) => {
  const response = await Category.find();

  return res.json({
    success: response ? true : false,
    categories: response ? response : "Lỗi lấy danh sách nhóm sản phẩm",
  });
});

// Cập nhật danh mục dựa trên ID
const updateCategory = asyncHandler(async (req, res) => {
  const { cateid } = req.params;
  const files = req?.files;

  if (req.body.brand && typeof req.body.brand === "string") {
    req.body.brand = req.body.brand.split(",").map((item) => item.trim());
  }

  if (files?.image) {
    req.body.image = files?.image[0]?.path;
  }

  req.body.slug = slugify(req.body.title);

  const response = await Category.findByIdAndUpdate(cateid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? "Cập nhật sản phẩm thành công"
      : "Lỗi cập nhật sản phẩm",
  });
});

// Xoá danh mục dựa trên ID
const deleteCategory = asyncHandler(async (req, res) => {
  const { cateid } = req.params;

  const response = await Category.findByIdAndDelete(cateid);

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
