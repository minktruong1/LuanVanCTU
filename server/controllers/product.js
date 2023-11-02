const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");
const slugify = require("slugify");
// const { query } = require("express");

const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, buyInPrice } = req.body;
  const images = req.files?.images?.map((element) => element.path);

  if (!title && !price && !description && !brand && !category && !buyInPrice) {
    throw new Error("Thiếu dữ liệu");
  }

  if (req.body.images) {
    req.body.images = images;
  }

  req.body.slug = slugify(title);

  const response = await Product.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Tạo sản phẩm mới thành công" : "Lỗi tạo sản phẩm",
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
  let categoryQueryFields = {};

  // Filtering(title, price);
  if (queries?.title) {
    formatQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    delete formatQueries.category;
    const cateArray = queries.category?.split(",");

    const cateQuery = cateArray.map((element) => ({
      category: {
        $regex: element,
        $options: "i",
      },
    }));
    categoryQueryFields = { $or: cateQuery };
  }

  let queryBlock = {};
  if (queries?.query) {
    delete formatQueries.query;
    queryBlock = {
      $or: [
        { title: { $regex: queries.query, $options: "i" } },
        { category: { $regex: queries.query, $options: "i" } },
        { brand: { $regex: queries.query, $options: "i" } },
        // { description: { $regex: queries.query, $options: "i" } },
      ],
    };
  }

  const groupQuery = {
    ...categoryQueryFields,
    ...formatQueries,
    ...queryBlock,
  };
  let queryCommand = Product.find(groupQuery);

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  //Range
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  try {
    const response = await queryCommand;
    const counts = await Product.find(groupQuery).countDocuments();
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
  const productSearch = await Product.findById(pid).populate({
    path: "reviews",
    populate: {
      path: "owner",
      select: "firstName lastName avatar",
    },
  });
  return res.status(200).json({
    success: productSearch ? true : false,
    getProduct: productSearch ? productSearch : "Error when get product",
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;

  if (files?.images) {
    req.body.images = files?.images?.map((element) => element.path);
  }

  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: updateProduct ? true : false,
    message: updateProduct ? "Cập nhật thành công" : "Lỗi cập nhật",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    message: deleteProduct ? "Xóa thành công" : "Xóa thất bại",
  });
});

const reviews = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
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
        $set: {
          "reviews.$.star": star,
          "reviews.$.comment": comment,
          "reviews.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    );
  } else {
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { reviews: { star, comment, owner: _id, updatedAt } },
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

//Handle upload img to cloudinary
const uploadProductImg = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) {
    throw new Error("Missing inputs");
  }
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((element) => element.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedProductImg: response ? response : "Error when upload product images",
  });
});

const searchProduct = async (req, res) => {
  const searchQuery = req.body.searchProduct;

  const response = await Product.find({
    title: { $regex: searchQuery, $options: "i" },
  });

  const counts = response.length;

  return res.status(200).json({
    success: response ? true : false,
    counts,
    searchProduct: response ? response : "Lỗi tìm kiếm",
  });
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  reviews,
  uploadProductImg,
  searchProduct,
};
