const userRoute = require("./user.js");
const productRoute = require("./product.js");
const categoryRoute = require("./category.js");
const blogTypeRoute = require("./blogType.js");
const { notFound, errorHandler } = require("../middlewares/prettyError.js");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/blog-type", blogTypeRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
