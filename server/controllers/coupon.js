const Coupon = require("../models/coupon.js");
const asyncHandler = require("express-async-handler");

const couponController = {
  createCoupon: asyncHandler(async (req, res) => {
    const { name, expire, code, quantity, percentDiscount, directDiscount } =
      req.body;
    if (!name || !expire || !code || !quantity) {
      throw new Error("Missing input");
    }

    const defaultPercentDiscount = percentDiscount === "" ? 0 : percentDiscount;
    const defaultDirectDiscount = directDiscount === "" ? 0 : directDiscount;

    const response = await Coupon.create({
      ...req.body,
      expire: Date.now() + +(expire * 24 * 60 * 60 * 1000),
      percentDiscount: defaultPercentDiscount,
      directDiscount: defaultDirectDiscount,
    });

    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Tạo mã giảm giá thành công" : "Lỗi tạo mã giảm giá",
    });
  }),

  getAllCoupons: asyncHandler(async (req, res) => {
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
          { name: { $regex: queries.query, $options: "i" } },
          { code: { $regex: queries.query, $options: "i" } },
          // { _id: { $regex: queries.query, $options: "i" } },
        ],
      };
    }

    const groupQuery = { ...formatQueries, ...queryBlock };
    let queryCommand = Coupon.find(groupQuery);

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
      const counts = await Coupon.find(groupQuery).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        coupons: response ? response : "Lỗi lấy danh sách đơn",
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }),

  updateCoupon: asyncHandler(async (req, res) => {
    const { cid } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing inputs",
      });
    }

    const updatedFields = {};

    if (req.body.name !== undefined && req.body.name !== "") {
      updatedFields.name = req.body.name;
    }

    if (req.body.code !== undefined && req.body.code !== "") {
      updatedFields.code = req.body.code;
    }

    if (req.body.percentDiscount !== undefined) {
      if (req.body.percentDiscount === "") {
        const existingCoupon = await Coupon.findById(cid);
        updatedFields.percentDiscount = existingCoupon.percentDiscount;
      } else {
        updatedFields.percentDiscount = req.body.percentDiscount;
      }
    }

    if (req.body.directDiscount !== undefined) {
      if (req.body.directDiscount === "") {
        const existingCoupon = await Coupon.findById(cid);
        updatedFields.directDiscount = existingCoupon.directDiscount;
      } else {
        updatedFields.directDiscount = req.body.directDiscount;
      }
    }

    if (req.body.expire !== undefined) {
      if (req.body.expire === "") {
        const existingCoupon = await Coupon.findById(cid);
        updatedFields.expire = existingCoupon.expire;
      } else {
        updatedFields.expire =
          Date.now() + +(req.body.expire * 24 * 60 * 60 * 1000);
      }
    }

    const response = await Coupon.findByIdAndUpdate(cid, updatedFields, {
      new: true,
    });

    return res.status(200).json({
      success: response ? true : false,
      message: response
        ? "Cập nhật mã giảm giá thành công"
        : "Lỗi cập nhật mã giảm giá",
    });
  }),

  deleteCoupon: asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Xóa mã giảm giá thành công" : "Lỗi xóa mã giảm giá",
    });
  }),

  userGetCoupon: asyncHandler(async (req, res) => {
    const response = await Coupon.find();

    return res.status(200).json({
      success: response ? true : false,
      coupons: response ? response : "Lỗi lấy tất cả mã giảm giá",
    });
  }),

  getCouponDetail: asyncHandler(async (req, res) => {
    const { code } = req.body;

    const response = await Coupon.findOne({
      code: { $regex: new RegExp("^" + code + "$") },
    });

    const currentDate = new Date();
    if (response?.expire < currentDate) {
      throw new Error("Đã hết hạn");
    }

    if (response?.quantity === 0) {
      throw new Error("Đã hết lượt");
    }

    return res.status(200).json({
      success: response ? true : false,
      coupon: response ? response : "Không tìm thấy mã giảm giá",
    });
  }),
};

module.exports = couponController;
