const userRoute = require("./user.js");
const { notFound, errorHandler } = require("../middlewares/prettyError.js");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
