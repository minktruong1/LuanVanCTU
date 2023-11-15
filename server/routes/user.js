const router = require("express").Router();
const controllers = require("../controllers/user.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post("/register", controllers.registerUser);

router.put("/register-confirm/:token", controllers.registerCheck);
router.post("/login", controllers.loginUser);
router.get("/current", [verifyLoginToken], controllers.getUser);
router.post("/refreshtoken", controllers.refreshLoginToken);
router.get("/logout", controllers.logout);
router.post("/forgotpassword", controllers.forgotPassword);
router.put("/resetpassword", controllers.resetPassword);
router.put("/address", [verifyLoginToken], controllers.updateUserAddress);
router.put("/cart", [verifyLoginToken], controllers.addProductIntoUserCart);
router.put("/wishlist", [verifyLoginToken], controllers.addProductToWishList);
router.delete(
  "/remove-product/:pid",
  [verifyLoginToken],
  controllers.removeProductFromCart
);

router.get("/", controllers.getAllUsers); //[verifyLoginToken, isAdmin],
router.delete("/:uid", [verifyLoginToken, isAdmin], controllers.deleteUser);
router.put(
  "/current",
  [verifyLoginToken],
  upload.single("avatar"),
  controllers.updateUserByUser
);
router.put("/:uid", [verifyLoginToken, isAdmin], controllers.updateUserByAdmin);

module.exports = router;
