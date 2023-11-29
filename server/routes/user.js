const router = require("express").Router();
const userController = require("../controllers/user.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post("/register", userController.registerUser);
router.put("/register-confirm/:token", userController.registerCheck);
router.post("/login", userController.loginUser);
router.get("/current", [verifyLoginToken], userController.getUser);
router.post("/refreshtoken", userController.refreshLoginToken);
router.get("/logout", userController.logout);
router.post("/forgotpassword", userController.forgotPassword);
router.put(
  "/changepassword",
  [verifyLoginToken],
  userController.changePassword
);
router.put("/resetpassword", userController.resetPassword);
router.put("/address", [verifyLoginToken], userController.updateUserAddress);
router.put("/cart", [verifyLoginToken], userController.addProductIntoUserCart);
router.put(
  "/wishlist",
  [verifyLoginToken],
  userController.addProductToWishList
);
router.delete(
  "/remove-product/:pid",
  [verifyLoginToken],
  userController.removeProductFromCart
);

//recommend product
router.get("/recommendfornew/", userController.getRandomForNewUser);
router.get("/recommend/", [verifyLoginToken], userController.setRecommendList);
router.get("/iscart/", [verifyLoginToken], userController.isCartProduct);

router.put("/pushProduct", userController.pushCheckedProduct);
router.get("/", userController.getAllUsers);
router.delete("/:uid", [verifyLoginToken, isAdmin], userController.deleteUser);
router.put(
  "/current",
  [verifyLoginToken],
  upload.single("avatar"),
  userController.updateUserByUser
);
router.put(
  "/:uid",
  [verifyLoginToken, isAdmin],
  userController.updateUserByAdmin
);

module.exports = router;
