const userRoute = require("./user.js");
const productRoute = require("./product.js");
const { notFound, errorHandler } = require("../middlewares/prettyError.js");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
