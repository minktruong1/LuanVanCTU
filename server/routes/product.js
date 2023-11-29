const router = require("express").Router();
const productController = require("../controllers/product.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.put("/reviews", verifyLoginToken, productController.reviews);

router.put(
  "/:pid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  productController.updateProduct
);

router.delete(
  "/:pid",
  [verifyLoginToken, isAdmin],
  productController.deleteProduct
);
router.get("/:pid", productController.getProduct);

module.exports = router;
