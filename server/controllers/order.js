const Order = require("../models/order.js");
const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const productList = userCart?.cart?.map((element) => ({
    productName: element.product._id,
    count: element.quantity,
    description: element.product.description,
  }));
  const lastPrice = userCart?.cart?.reduce(
    (sum, element) => element.product.price * element.quantity + sum,
    0
  );
  if (coupon)
    lastPrice = Math.round((lastPrice * (1 - coupon / 100)) / 1000) * 1000;
  const result = await Order.create({ productList, lastPrice, buyer: _id });
  return res.json({
    success: result ? true : false,
    result: result ? result : "error when create Order ",
  });
});

module.exports = {
  createOrder,
};
