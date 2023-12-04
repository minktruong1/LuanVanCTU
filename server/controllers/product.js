const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");
const PurchaseInfo = require("../models/purchaseInfo.js");
const moment = require("moment");
const slugify = require("slugify");

const productController = {
  createProduct: asyncHandler(async (req, res) => {
    const { title, price, description, brand, category, buyInPrice } = req.body;
    const images = req.files?.images?.map((element) => element.path);

    if (
      !title &&
      !price &&
      !description &&
      !brand &&
      !category &&
      !buyInPrice
    ) {
      throw new Error("Thiếu dữ liệu");
    }

    if (req.body.images) {
      req.body.images = images;
    }

    req.body.slug = slugify(title);

    const newProduct = await Product.create(req.body);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let purchaseInfo = await PurchaseInfo.findOne({
      createdAt: { $gte: today },
    });

    const getDate = moment().format("DD/MM/YYYY");

    // Nếu không có PurchaseInfo được tạo trong ngày hiện tại, tạo một PurchaseInfo mới
    if (!purchaseInfo) {
      purchaseInfo = await PurchaseInfo.create({
        title: `Phiếu nhập hàng ${getDate}`,
        productList: [
          {
            product: newProduct._id,
            category: newProduct.category,
            brand: newProduct.brand,
            title: newProduct.title,
            quantity: newProduct.quantity, // Set quantity as needed
            images: newProduct.images,
            price: newProduct.price,
            buyInPrice: newProduct.buyInPrice,
          },
        ],
        productCount: 1, // Đếm số lượng sản phẩm trong productList, bắt đầu từ 1
        totalPay: newProduct.buyInPrice * newProduct.quantity, // Set totalPay as needed
      });
    } else {
      // Nếu đã có PurchaseInfo được tạo trong ngày, thêm sản phẩm vào productList của PurchaseInfo đó
      purchaseInfo.productList.push({
        product: newProduct._id,
        category: newProduct.category,
        brand: newProduct.brand,
        title: newProduct.title,
        quantity: newProduct.quantity,
        images: newProduct.images,
        price: newProduct.price,
        buyInPrice: newProduct.buyInPrice,
      });

      // Tính lại productCount sau khi thêm sản phẩm mới vào productList
      purchaseInfo.productCount = purchaseInfo.productList.length;

      // Tính lại totalPay sau khi thêm sản phẩm mới vào productList
      purchaseInfo.totalPay += newProduct.buyInPrice * newProduct.quantity;
      await purchaseInfo.save();
    }

    return res.status(200).json({
      success: true,
      message: "Tạo sản phẩm mới và cập nhật PurchaseInfo thành công",
    });
  }),

  getAllProducts: asyncHandler(async (req, res) => {
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
          $regex: `^${element}$`,
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
  }),

  getProduct: asyncHandler(async (req, res) => {
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
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { quantity } = req.body;
    const files = req?.files;

    // Lấy thông tin sản phẩm cần cập nhật
    const productToUpdate = await Product.findById(pid);

    if (!productToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    // Lưu số lượng ban đầu trước khi cập nhật
    const initialQuantity = productToUpdate.quantity;

    // Cập nhật thông tin sản phẩm, bao gồm cả hình ảnh nếu có
    let updatedProduct = { ...req.body };

    if (files?.images) {
      updatedProduct.images = files.images.map((element) => element.path);
    }

    if (updatedProduct.title) {
      updatedProduct.slug = slugify(updatedProduct.title);
    }

    updatedProduct = await Product.findByIdAndUpdate(pid, updatedProduct, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật sản phẩm",
      });
    }

    // Nếu số lượng mới lớn hơn số lượng ban đầu, kiểm tra và thêm vào PurchaseInfo
    if (quantity > initialQuantity) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Tìm PurchaseInfo của ngày hiện tại
      let purchaseInfo = await PurchaseInfo.findOne({
        createdAt: { $gte: today },
      });

      // Nếu không có PurchaseInfo được tạo trong ngày hiện tại, tạo mới
      if (!purchaseInfo) {
        purchaseInfo = await PurchaseInfo.create({
          title: `Phiếu nhập hàng ${moment().format("DD/MM/YYYY")}`,
          productList: [
            {
              product: updatedProduct._id,
              category: updatedProduct.category,
              brand: updatedProduct.brand,
              title: updatedProduct.title,
              quantity: quantity - initialQuantity, // Số lượng mới trừ đi số lượng ban đầu
              images: updatedProduct.images,
              price: updatedProduct.price,
              buyInPrice: updatedProduct.buyInPrice,
            },
          ],
          productCount: 1, // Đếm số lượng sản phẩm trong productList, bắt đầu từ 1
          totalPay: (quantity - initialQuantity) * updatedProduct.buyInPrice, // Tính totalPay mới
        });
      } else {
        // Nếu đã có PurchaseInfo được tạo trong ngày, thêm sản phẩm vào productList của PurchaseInfo đó
        purchaseInfo.productList.push({
          product: updatedProduct._id,
          category: updatedProduct.category,
          brand: updatedProduct.brand,
          title: updatedProduct.title,
          quantity: quantity - initialQuantity, // Số lượng mới trừ đi số lượng ban đầu
          images: updatedProduct.images,
          price: updatedProduct.price,
          buyInPrice: updatedProduct.buyInPrice,
        });

        // Tính lại productCount sau khi thêm sản phẩm mới vào productList
        purchaseInfo.productCount = purchaseInfo.productList.length;

        // Tính lại totalPay sau khi thêm sản phẩm mới vào productList
        purchaseInfo.totalPay +=
          (quantity - initialQuantity) * updatedProduct.buyInPrice;
        await purchaseInfo.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      updatedProduct,
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
      success: deleteProduct ? true : false,
      message: deleteProduct ? "Xóa thành công" : "Xóa thất bại",
    });
  }),

  reviews: asyncHandler(async (req, res) => {
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
    }

    //Counting reviews point
    const updatedProduct = await Product.findById(pid);
    const totalOfReview = updatedProduct.reviews.length;
    const sumPoint = updatedProduct.reviews.reduce(
      (sum, element) => sum + +element.star,
      0
    );
    updatedProduct.reviewPoint =
      Math.round((sumPoint * 10) / totalOfReview) / 10;

    await updatedProduct.save();

    return res.status(200).json({
      success: true,
      updatedProduct,
    });
  }),
};

module.exports = productController;
