const router = require("express").Router();
const controllers = require("../controllers/coupon.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", [verifyLoginToken, isAdmin], controllers.createCoupon);
router.get("/", controllers.getAllCoupons);
router.get("/user-get", controllers.userGetCoupon);
router.put("/:cid", [verifyLoginToken, isAdmin], controllers.updateCoupon);
router.delete("/:cid", [verifyLoginToken, isAdmin], controllers.deleteCoupon);

module.exports = router;
