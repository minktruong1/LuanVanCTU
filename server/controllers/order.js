const Order = require("../models/order.js");
const User = require("../models/user.js");
const Coupon = require("../models/coupon.js");
const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");

const orderController = {
  createOrder: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const {
      productList,
      couponCode,
      couponApply,
      shipPrice,
      totalPrice,
      lastPrice,
      address,
      status,
      buyer,
      method,
      profit,
      note,
    } = req.body;

    if (address) {
      const buyerInfo = await User.findById(_id).select(
        "firstName lastName mobile address"
      );

      const couponDetail = await Coupon.findOne({
        code: { $regex: new RegExp("^" + couponCode + "$") },
      }).select("_id name quantity code expire percentDiscount directDiscount");

      const currentDate = new Date();
      if (couponDetail?.expire < currentDate) {
        throw new Error("Code đã hết hạn");
      }

      if (couponDetail?.quantity === 0) {
        throw new Error("Code đã hết lượt");
      }

      const data = {
        productList,
        couponApply,
        shipPrice,
        totalPrice,
        lastPrice,
        buyer,
        address,
        method,
        profit,
        note,
      };
      if (status) {
        data.status = status;
      }

      if (couponCode) {
        data.couponApply = {
          coupon: couponDetail._id,
          name: couponDetail.name,
          code: couponDetail.code,
          percentDiscount: couponDetail.percentDiscount,
          directDiscount: couponDetail.directDiscount,
        };

        // Giảm đi 1 từ trường quantity của Coupon
        await Coupon.findByIdAndUpdate(couponDetail._id, {
          $inc: { quantity: -1 },
        });
      }

      data.buyer = {
        user: _id,
        firstName: buyerInfo.firstName,
        lastName: buyerInfo.lastName,
        mobile: buyerInfo.mobile,
        address: buyerInfo.address,
      };

      const result = await Order.create(data);
      if (result) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
      }

      return res.status(200).json({
        success: result ? true : false,
        result: result ? result : "error when create Order ",
      });
    } else {
      throw new Error("Cập nhật địa chỉ giao hàng");
    }
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new Error("Missing status");
    }
    if (status === "Đang vận chuyển") {
      const findOrder = await Order.findById(oid);

      for (const product of findOrder.productList) {
        const productId = product.product;
        const findProduct = await Product.findOne(productId);
        if (!findProduct) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy dữ liệu sản phẩm",
          });
        }
        if (findProduct.quantity < product.quantity) {
          throw new Error("Không đủ hàng để vận chuyển");
        }
      }
    }
    const order = await Order.findByIdAndUpdate(oid, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if the status is "Hoàn thành"
    if (status === "Hoàn thành") {
      for (const product of order.productList) {
        const productId = product.product;
        const quantity = product.quantity;

        await Product.findByIdAndUpdate(
          productId,
          {
            $inc: {
              quantity: -quantity,
              sold: quantity,
            },
          },
          { new: true }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
    });
  }),

  userGetOrder: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const queries = { ...req.query };

    //syntax normalization
    let queryString = JSON.stringify(queries);

    const formatQueries = JSON.parse(queryString);

    // Filtering(status)
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

    const groupQuery = { "buyer.user": _id, ...formatQueries, ...queryBlock };
    let queryCommand = Order.find(groupQuery).sort({ createdAt: -1 });

    queryCommand = queryCommand.populate("buyer", "firstName lastName mobile");

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
  }),

  getOrderList: asyncHandler(async (req, res) => {
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
          { "buyer.firstName": { $regex: queries.query, $options: "i" } },
          { "buyer.mobile": { $regex: queries.query, $options: "i" } },
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
  }),

  getOrderForCount: asyncHandler(async (req, res) => {
    const response = await Order.find();
    const counts = await Order.countDocuments();

    return res.json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Lỗi lấy danh sách nhóm sản phẩm",
    });
  }),

  updateProductReviewStatus: asyncHandler(async (req, res) => {
    // oid là _id của đơn hàng, oIid là _id của sản phẩm trong danh sách đơn hàng
    const { oid, oIid } = req.body;

    // Kiểm tra xem đơn hàng tồn tại
    const order = await Order.findById(oid);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    // Tìm sản phẩm cần cập nhật
    const product = order.productList.find((item) => item._id == oIid);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại trong đơn hàng",
      });
    }

    // Cập nhật trường isReview thành true
    product.isReview = true;

    // Lưu thay đổi
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đánh giá thành công",
    });
  }),
};

module.exports = orderController;
