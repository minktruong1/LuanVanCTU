const router = require("express").Router();
const controllers = require("../controllers/product.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post("/", controllers.createProduct);
router.get("/", controllers.getAllProducts);
router.put("/reviews", verifyLoginToken, controllers.reviews);

router.put(
  "/uploadimg/:pid",
  upload.array("images", 6),
  controllers.uploadProductImg
);
router.put("/:pid", controllers.updateProduct);
router.delete("/:pid", controllers.deleteProduct);
router.get("/:pid", controllers.getProduct);

module.exports = router;
