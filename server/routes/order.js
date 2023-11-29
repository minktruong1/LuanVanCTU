const router = require("express").Router();
const orderController = require("../controllers/order.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", verifyLoginToken, orderController.createOrder);
router.put(
  "/status/:oid",
  [verifyLoginToken],
  orderController.updateOrderStatus
);
router.put(
  "/review",
  [verifyLoginToken],
  orderController.updateProductReviewStatus
);
router.get("/", verifyLoginToken, orderController.userGetOrder);
router.get("/all", [verifyLoginToken, isAdmin], orderController.getOrderList);
router.get(
  "/all-count",
  [verifyLoginToken, isAdmin],
  orderController.getOrderForCount
);

module.exports = router;
