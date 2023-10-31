const Order = require("../models/order.js");
const User = require("../models/user.js");
const Coupon = require("../models/coupon.js");
const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productList, totalPrice, address, status, method } = req.body;

  const buyerInfo = await User.findById(_id).select(
    "firstName lastName mobile address"
  );

  const data = {
    productList,
    totalPrice,
    buyer: _id,
    address,
    method,
  };
  if (status) {
    data.status = status;
  }

  data.buyer = {
    _id: _id,
    firstName: buyerInfo.firstName,
    lastName: buyerInfo.lastName,
    mobile: buyerInfo.mobile,
    address: buyerInfo.address,
  };

  const result = await Order.create(data);
  if (result) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }

  return res.json({
    success: result ? true : false,
    result: result ? result : "error when create Order ",
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) {
    throw new Error("Missing status");
  }

  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Cập nhật thành công" : "Lỗi cập nhật",
  });
});

const userGetOrder = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  //list type of filter
  const excludeFields = ["sort", "fields"];
  excludeFields.forEach((element) => {
    delete queries[element];
  });

  //syntax normalization
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );

  const formatQueries = JSON.parse(queryString);

  // Filtering(status, method)
  if (queries?.status) {
    formatQueries.status = { $regex: queries.status, $options: "i" };
  }

  let queryBlock = {};
  if (queries?.query) {
    delete formatQueries.query;
    queryBlock = {
      $or: [
        { "productList.title": { $regex: queries.query, $options: "i" } },
        { status: { $regex: queries.query, $options: "i" } },
      ],
    };
  }

  const groupQuery = { ...formatQueries, ...queryBlock };
  let queryCommand = Order.find(groupQuery);

  queryCommand = queryCommand.populate("buyer", "firstName lastName mobile");

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  try {
    const response = await queryCommand;
    const counts = await Order.find(groupQuery).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Lỗi lấy danh sách đơn",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

const getOrderList = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  //list type of filter
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((element) => {
    delete queries[element];
  });

  //syntax normalization
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );

  const formatQueries = JSON.parse(queryString);

  // Filtering(status, method)
  if (queries?.status) {
    formatQueries.status = { $regex: queries.status, $options: "i" };
  }
  if (queries?.method) {
    formatQueries.method = { $regex: queries.method, $options: "i" };
  }

  let queryBlock = {};
  if (queries?.query) {
    delete formatQueries.query;
    queryBlock = {
      $or: [
        { method: { $regex: queries.query, $options: "i" } },
        { status: { $regex: queries.query, $options: "i" } },
        { "buyer.lastName": { $regex: queries.query, $options: "i" } },
        // { _id: { $regex: queries.query, $options: "i" } },
      ],
    };
  }

  const groupQuery = { ...formatQueries, ...queryBlock };
  let queryCommand = Order.find(groupQuery);

  queryCommand = queryCommand.populate("buyer", "firstName lastName mobile");

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
  const limit = +req.query.limit || process.env.LIMIT_ORDERS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  try {
    const response = await queryCommand;
    const counts = await Order.find(groupQuery).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Lỗi lấy danh sách đơn",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

module.exports = {
  createOrder,
  updateOrderStatus,
  userGetOrder,
  getOrderList,
};
