const moment = require("moment");

const asyncHandler = require("express-async-handler");

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

      for (const modelName in data) {
        const jsonData = JSON.stringify(data[modelName], null, 2);
        const fileName = `${modelName}-${moment(Date.now()).format(
          "DD-MM-YYYY"
        )}.json`;

        arch.append(jsonData, { name: fileName });
      }

      arch.finalize();
    } catch (error) {
      throw new Error(error.message);
    }
  }),
};

module.exports = exportController;
