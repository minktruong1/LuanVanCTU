const Order = require("../models/order.js");
const User = require("../models/user.js");
const Coupon = require("../models/coupon.js");
const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productList, totalPrice, address, status } = req.body;

  const data = {
    productList,
    totalPrice,
    buyer: _id,
    address,
  };
  if (status) {
    data.status = status;
  }
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
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    updateOrderStatus: response ? response : "error when update Order status",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ Buyer: _id });
  return res.json({
    success: response ? true : false,
    userOrder: response ? response : "error when get user order",
  });
});

const getOrderList = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    userOrderList: response ? response : "error when get user order list",
  });
});

module.exports = {
  createOrder,
  updateOrderStatus,
  getUserOrder,
  getOrderList,
};
