const router = require("express").Router();
const controllers = require("../controllers/category.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", controllers.createCategory);
router.get("/", controllers.getAllCategories);
router.put("/:cid", controllers.updateCategory);
router.delete("/:cid", controllers.deleteCategory);

module.exports = router;
