const userRoute = require("./user.js");
const productRoute = require("./product.js");
const categoryRoute = require("./category.js");
const blogTypeRoute = require("./blogType.js");
const blogRoute = require("./blog.js");
const brandRoute = require("./brand.js");
const couponRoute = require("./coupon.js");
const { notFound, errorHandler } = require("../middlewares/prettyError.js");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/blog-type", blogTypeRoute);
  app.use("/api/blog", blogRoute);
  app.use("/api/brand", brandRoute);
  app.use("/api/coupon", couponRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
