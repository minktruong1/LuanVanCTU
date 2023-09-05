const router = require("express").Router();
const controllers = require("../controllers/blog.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.get("/", controllers.getAllBlog);
router.get("/detail/:bid", controllers.getBlog);
router.post("/", controllers.createBlog);
router.put("/:bid", controllers.updateBlog);
router.put("/like/:bid", verifyLoginToken, controllers.likeBlog);
router.put("/dislike/:bid", verifyLoginToken, controllers.dislikeBlog);
router.delete("/:bid", controllers.deleteBlog);

module.exports = router;
