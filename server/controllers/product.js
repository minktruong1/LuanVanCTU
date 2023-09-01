const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Error when create product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const productSearch = await Product.findById(pid);
  return res.status(200).json({
    success: productSearch ? true : false,
    createdProduct: productSearch ? productSearch : "Error when get product",
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const productSearch = await Product.find();
  return res.status(200).json({
    success: productSearch ? true : false,
    createdProduct: productSearch
      ? productSearch
      : "Error when get all products",
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    createdProduct: updateProduct ? updateProduct : "Error when update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    createdProduct: deleteProduct ? deleteProduct : "Error when delete product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
