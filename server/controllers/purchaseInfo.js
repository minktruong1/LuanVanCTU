const PurchaseInfo = require("../models/purchaseInfo.js");
const Product = require("../models/product.js");

const asyncHandler = require("express-async-handler");

const purchaseInfoController = {
  getAllPurchaseInfo: asyncHandler(async (req, res) => {
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

    let queryBlock = {};
    if (queries?.query) {
      delete formatQueries.query;
      queryBlock = {
        $or: [{ title: { $regex: queries.query, $options: "i" } }],
      };
    }

    const groupQuery = {
      ...categoryQueryFields,
      ...formatQueries,
      ...queryBlock,
    };
    let queryCommand = PurchaseInfo.find(groupQuery);

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
      const counts = await PurchaseInfo.find(groupQuery).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        purchaseInfoData: response ? response : "Lỗi khi lấy dữ liệu",
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }),

  getDetail: asyncHandler(async (req, res) => {
    const { purchaseid } = req.params;
    const purchaseSearch = await PurchaseInfo.findById(purchaseid);
    return res.status(200).json({
      success: purchaseSearch ? true : false,
      purchaseDetail: purchaseSearch
        ? purchaseSearch
        : "Lỗi lấy chi tiết phiếu nhập",
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { purchaseInfoId, productId } = req.body;

    try {
      // Kiểm tra xem PurchaseInfo tồn tại
      const existingPurchaseInfo = await PurchaseInfo.findById(purchaseInfoId);
      if (!existingPurchaseInfo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy PurchaseInfo",
        });
      }

      // Kiểm tra xem có Product nào trong danh sách productList của PurchaseInfo không
      const productToDelete = existingPurchaseInfo.productList.find(
        (product) => product.product.toString() === productId
      );

      if (!productToDelete) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy Product trong PurchaseInfo",
        });
      }

      const updatedPurchaseInfo = await PurchaseInfo.findByIdAndUpdate(
        purchaseInfoId,
        {
          $pull: { productList: { product: productId } },
          $inc: {
            productCount: -1,
            totalPay: -(productToDelete.buyInPrice * productToDelete.quantity),
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công khỏi PurchaseInfo",
        updatedPurchaseInfo,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa sản phẩm khỏi PurchaseInfo",
        error: err.message,
      });
    }
  }),
};

module.exports = purchaseInfoController;
