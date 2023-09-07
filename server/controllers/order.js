const Order = require("../models/order.js");
const User = require("../models/user.js");
const Coupon = require("../models/coupon.js");
const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price description");

  const productList = userCart?.cart?.map((element) => ({
    productName: element.product._id,
    count: element.quantity,
    description: element.product.description,
    price: element.product.price,
  }));

  let totalBeforeDiscount = userCart?.cart?.reduce(
    (sum, element) => element.product.price * element.quantity + sum,
    0
  );
  let lastPrice = totalBeforeDiscount;

  if (coupon) {
    const applyCoupon = await Coupon.findById(coupon);
    if (applyCoupon) {
      const discountAmount = (totalBeforeDiscount * applyCoupon.discount) / 100;
      lastPrice = totalBeforeDiscount - discountAmount;
      lastPrice = parseFloat(lastPrice.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
    }
  }

  const dataStructor = { productList, lastPrice, buyer: _id, coupon };
  const result = await Order.create(dataStructor);

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
  const { _id } = req.params;
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
