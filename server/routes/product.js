const router = require("express").Router();
const controllers = require("../controllers/product.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", controllers.createProduct);
router.get("/", controllers.getAllProducts);
router.put("/:pid", controllers.updateProduct);
router.delete("/:pid", controllers.deleteProduct);
router.get("/:pid", controllers.getProduct);

module.exports = router;
