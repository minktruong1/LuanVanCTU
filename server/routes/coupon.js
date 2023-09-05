const router = require("express").Router();
const controllers = require("../controllers/coupon.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", controllers.createCoupon);
router.get("/", controllers.getAllCoupons);
router.put("/:cid", controllers.updateCoupon);
router.delete("/:cid", controllers.deleteCoupon);

module.exports = router;
