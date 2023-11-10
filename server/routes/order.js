const router = require("express").Router();
const controllers = require("../controllers/order.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", verifyLoginToken, controllers.createOrder);
router.put("/status/:oid", [verifyLoginToken], controllers.updateOrderStatus);
router.put(
  "/review",
  [verifyLoginToken],
  controllers.updateProductReviewStatus
);
router.get("/", verifyLoginToken, controllers.userGetOrder);
router.get("/all", [verifyLoginToken, isAdmin], controllers.getOrderList);
router.get(
  "/all-count",
  [verifyLoginToken, isAdmin],
  controllers.getOrderForCount
);

module.exports = router;
