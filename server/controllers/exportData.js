const Product = require("../models/product");
const Blog = require("../models/blog.js");
const Category = require("../models/category.js");
const Coupon = require("../models/coupon.js");
const ImageStore = require("../models/imageStore.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");
const moment = require("moment");
const archiver = require("archiver");
const fs = require("fs");

const asyncHandler = require("express-async-handler");
const fastcsv = require("fast-csv");
const { PassThrough } = require("stream");

const models = {
  Product: require("../models/product"),
  Blog: require("../models/blog.js"),
  Category: require("../models/category.js"),
  Coupon: require("../models/coupon.js"),
  ImageStore: require("../models/imageStore.js"),
  Order: require("../models/order.js"),
  User: require("../models/user.js"),
  PurchaseInfo: require("../models/purchaseInfo.js"),
};

const exportController = {
  exportProduct: asyncHandler(async (req, res) => {
    try {
      const products = [];
      const productData = await Product.find({});
      productData.forEach((item) => {
        const {
          title,
          slug,
          description,
          brand,
          buyInPrice,
          price,
          category,
          quantity,
          sold,
          images,
          reviews,
          reviewPoint,
        } = item;
        products.push({
          title,
          slug,
          description,
          brand,
          buyInPrice,
          price,
          category,
          quantity,
          sold,
          images,
          reviews,
          reviewPoint,
        });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      products.forEach((product) => {
        csvStream.write(product);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=productsData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportBlog: asyncHandler(async (req, res) => {
    try {
      const blogs = [];
      const blogData = await Blog.find({});
      blogData.forEach((item) => {
        const {
          title,
          slug,
          description,
          category,
          viewNumber,
          listOfLikes,
          listOfDislikes,
          image,
          author,
          updatedAt,
        } = item;
        blogs.push({
          title,
          slug,
          description,
          category,
          viewNumber,
          listOfLikes,
          listOfDislikes,
          image,
          author,
          updatedAt,
        });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      blogs.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=blogsData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportCategory: asyncHandler(async (req, res) => {
    try {
      const categories = [];
      const categoriesData = await Category.find({});
      categoriesData.forEach((item) => {
        const { title, slug, brand, image } = item;
        categories.push({ title, slug, brand, image });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      categories.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=categoriesData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportCoupon: asyncHandler(async (req, res) => {
    try {
      const coupons = [];
      const couponsData = await Coupon.find({});
      couponsData.forEach((item) => {
        const {
          name,
          code,
          quantity,
          percentDiscount,
          directDiscount,
          expire,
        } = item;
        coupons.push({
          name,
          code,
          quantity,
          percentDiscount,
          directDiscount,
          expire: `${moment(expire).format("YYYY-MM-DD HH:mm")}`,
        });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      coupons.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=couponsData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportImageStore: asyncHandler(async (req, res) => {
    try {
      const ImageStores = [];
      const imageStoresData = await ImageStore.find({});
      imageStoresData.forEach((item) => {
        const { title, slug, images } = item;
        ImageStores.push({ title, slug, images });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      ImageStores.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=imageStoresData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportOrder: asyncHandler(async (req, res) => {
    try {
      const Orders = [];
      const ordersData = await Order.find({});
      ordersData.forEach((item) => {
        const {
          productList,
          status,
          method,
          couponApply,
          note,
          shipPrice,
          totalPrice,
          lastPrice,
          profit,
          address,
          buyer,
          createdAt,
        } = item;
        Orders.push({
          productList,
          status,
          method,
          couponApply,
          note,
          shipPrice,
          totalPrice,
          lastPrice,
          profit,
          address,
          buyer,
          createdAt: `${moment(createdAt).format("YYYY-MM-DD HH:mm")}`,
        });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      Orders.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=ordersData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportUser: asyncHandler(async (req, res) => {
    try {
      const Users = [];
      const userData = await User.find({});
      userData.forEach((item) => {
        const {
          firstName,
          lastName,
          email,
          address,
          avatar,
          mobile,
          password,
          role,
          cart,
          wishList,
          recommendList,
          checkedProducts,
          refreshToken,
          passwordChangeAt,
          passwordResetToken,
          passwordResetExpires,
        } = item;
        Users.push({
          firstName,
          lastName,
          email,
          address,
          avatar,
          mobile,
          password,
          role,
          cart,
          wishList,
          recommendList,
          checkedProducts,
          refreshToken,
          passwordChangeAt: `${
            passwordChangeAt &&
            moment(passwordChangeAt).format("YYYY-MM-DD HH:mm")
          }`,
          passwordResetToken,
          passwordResetExpires,
        });
      });

      const csvStream = fastcsv.format({ headers: true });
      const utf8Stream = new PassThrough();
      utf8Stream.write("\ufeff", "utf8");
      utf8Stream.pipe(res);

      csvStream.pipe(utf8Stream);
      Users.forEach((item) => {
        csvStream.write(item);
      });
      csvStream.end();

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=userData-${moment(Date.now()).format(
          "DD/MM/YYYY"
        )}.csv`
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  exportAllData: asyncHandler(async (req, res) => {
    try {
      const data = {};

      // Fetch data from all models
      for (const modelName in models) {
        const Model = models[modelName];
        data[modelName] = await Model.find({}).lean();
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=allData-${moment(Date.now()).format(
          "DD-MM-YYYY"
        )}.zip`
      );

      const arch = require("archiver")("zip");
      arch.pipe(res);

      // Create a CSV file for each collection and add it to the zip
      for (const modelName in data) {
        const items = data[modelName];
        const csvStream = fastcsv.format({ headers: true });
        const utf8Stream = new PassThrough();
        utf8Stream.write("\ufeff", "utf8");

        csvStream.pipe(utf8Stream);

        // Correctly write each item into CSV
        items.forEach((item) => {
          const plainObject = item.toObject ? item.toObject() : item;
          Object.keys(plainObject).forEach((key) => {
            // Xử lý các giá trị mảng hoặc đối tượng thành chuỗi JSON
            if (
              Array.isArray(plainObject[key]) ||
              typeof plainObject[key] === "object"
            ) {
              plainObject[key] = JSON.stringify(plainObject[key]);
            }
          });
          csvStream.write(plainObject);
        });

        csvStream.end();

        arch.append(utf8Stream, { name: `${modelName}.csv` });
      }

      arch.finalize();
    } catch (error) {
      throw new Error(error.message);
    }
  }),
};

module.exports = exportController;
