const router = require("express").Router();
const controllers = require("../controllers/blogType.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", controllers.createBlogType);
router.get("/", controllers.getAllBlogType);
router.put("/:btid", controllers.updateBlogType);
router.delete("/:btid", controllers.deleteBlogType);

module.exports = router;
