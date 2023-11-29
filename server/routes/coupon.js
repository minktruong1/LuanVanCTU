const router = require("express").Router();
const couponController = require("../controllers/coupon.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", [verifyLoginToken, isAdmin], couponController.createCoupon);
router.get("/", couponController.getAllCoupons);
router.post("/detail", couponController.getCouponDetail);
router.get("/user-get", couponController.userGetCoupon);
router.put("/:cid", [verifyLoginToken, isAdmin], couponController.updateCoupon);
router.delete(
  "/:cid",
  [verifyLoginToken, isAdmin],
  couponController.deleteCoupon
);

module.exports = router;
