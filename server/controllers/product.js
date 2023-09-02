const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");
const slugify = require("slugify");
// const { query } = require("express");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Error when create product",
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //list type of filter
  const exclusiveFields = ["limit", "sort", "page", "fields"];
  exclusiveFields.forEach((element) => {
    delete queries[element];
  });

  //syntax normalization
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueries = JSON.parse(queryString);

  //Filtering(title, price)
  if (queries?.title) {
    formatQueries.title = { $regex: queries.title, $options: "i" };
  }
  let queryCommand = Product.find(formatQueries);

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join("");
    queryCommand = queryCommand.sort(sortBy);
  }

  //Range
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join("");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Running query
  try {
    const response = await queryCommand;
    const counts = await Product.find(formatQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Error when get product",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const productSearch = await Product.findById(pid);
  return res.status(200).json({
    success: productSearch ? true : false,
    createdProduct: productSearch ? productSearch : "Error when get product",
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

const reviews = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing input");
  const productTarget = await Product.findById(pid);
  const alreadyReview = productTarget?.reviews?.find(
    (element) => element.owner.toString() === _id
  );
  // console.log({ alreadyReview });

  //if already review, update previous review. Else post new review
  if (alreadyReview) {
    await Product.updateOne(
      {
        reviews: { $elemMatch: alreadyReview },
      },
      {
        $set: { "reviews.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { reviews: { star, comment, owner: _id } },
      },
      { new: true }
    );
    // console.log(response);
  }

  //Counting reviews point
  const updatedProduct = await Product.findById(pid);
  const totalOfReview = updatedProduct.reviews.length;
  const sumPoint = updatedProduct.reviews.reduce(
    (sum, element) => sum + +element.star,
    0
  );
  updatedProduct.reviewPoint = Math.round((sumPoint * 10) / totalOfReview) / 10;

  await updatedProduct.save();

  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  reviews,
};
