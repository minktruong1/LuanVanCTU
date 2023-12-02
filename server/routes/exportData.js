const router = require("express").Router();
const exportController = require("../controllers/exportData.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.get(
  "/products",
  [verifyLoginToken, isAdmin],
  exportController.exportProduct
);
router.get("/blogs", [verifyLoginToken, isAdmin], exportController.exportBlog);
router.get(
  "/categories",
  [verifyLoginToken, isAdmin],
  exportController.exportCategory
);
router.get(
  "/coupons",
  [verifyLoginToken, isAdmin],
  exportController.exportCoupon
);
router.get(
  "/imagestore",
  [verifyLoginToken, isAdmin],
  exportController.exportImageStore
);
router.get(
  "/orders",
  [verifyLoginToken, isAdmin],
  exportController.exportOrder
);
router.get("/users", [verifyLoginToken, isAdmin], exportController.exportUser);

router.get("/all", exportController.exportAllData);

module.exports = router;
