const Coupon = require("../models/coupon.js");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, expire, percentDiscount, directDiscount, code, quantity } =
    req.body;
  if (!name || !expire || !code || !quantity) {
    throw new Error("Missing input");
  }

  const response = await Coupon.create({
    ...req.body,
    expire: Date.now() + +(expire * 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "error when create Coupon ",
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.status(200).json({
    success: response ? true : false,
    coupons: response ? response : "error when get all coupons ",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs");
  }

  if (req.body.expire)
    req.body.expire = Date.now() + +(req.body.expire * 24 * 60 * 60 * 1000);

  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updatedCoupon: response ? response : "error when update Coupon ",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    deletedCoupon: response ? response : "error when delete a Coupon ",
  });
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
