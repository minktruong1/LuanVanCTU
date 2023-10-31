const router = require("express").Router();
const controllers = require("../controllers/VNpay.js");
const { verifyLoginToken } = require("../middlewares/verifyToken.js");

router.post("/", verifyLoginToken, controllers.createOrder);
router.get("/data", verifyLoginToken, controllers.dataBack);

module.exports = router;
