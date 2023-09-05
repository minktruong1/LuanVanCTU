const router = require("express").Router();
const controllers = require("../controllers/order.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", verifyLoginToken, controllers.createOrder);

module.exports = router;
