const router = require("express").Router();
const controllers = require("../controllers/product.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  [verifyLoginToken, isAdmin],
  upload.array("images", 10),
  controllers.createProduct
);
router.get("/", controllers.getAllProducts);
router.put("/reviews", verifyLoginToken, controllers.reviews);
router.post("/searchproduct", controllers.searchProduct);
router.put(
  "/uploadimg/:pid",
  [verifyLoginToken, isAdmin],
  upload.array("images", 6),
  controllers.uploadProductImg
);

router.put(
  "/:pid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  controllers.updateProduct
);
router.delete("/:pid", [verifyLoginToken, isAdmin], controllers.deleteProduct);
router.get("/:pid", controllers.getProduct);

module.exports = router;
