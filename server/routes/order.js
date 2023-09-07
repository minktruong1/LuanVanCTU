const router = require("express").Router();
const controllers = require("../controllers/order.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", verifyLoginToken, controllers.createOrder);
router.put("/status/:oid", verifyLoginToken, controllers.updateOrderStatus);
router.get("/", verifyLoginToken, controllers.getUserOrder);
router.get("/all", verifyLoginToken, isAdmin, controllers.getOrderList);

module.exports = router;
