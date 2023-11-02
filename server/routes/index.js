const userRoute = require("./user.js");
const productRoute = require("./product.js");
const categoryRoute = require("./category.js");
const blogRoute = require("./blog.js");
const brandRoute = require("./brand.js");
const couponRoute = require("./coupon.js");
const orderRoute = require("./order.js");
const VNpayRoute = require("./VNpay.js");

const { notFound, errorHandler } = require("../middlewares/prettyError.js");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/blog", blogRoute);
  app.use("/api/brand", brandRoute);
  app.use("/api/coupon", couponRoute);
  app.use("/api/order", orderRoute);
  app.use("/api/vnpay", VNpayRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
