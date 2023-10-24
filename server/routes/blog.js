const router = require("express").Router();
const controllers = require("../controllers/blog.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.get("/", controllers.getAllBlog);
router.get("/:bid", controllers.getBlog);
router.post("/", controllers.createBlog);
router.put("/:bid", controllers.updateBlog);
router.put("/like/:bid", verifyLoginToken, controllers.likeBlog);
router.put("/dislike/:bid", verifyLoginToken, controllers.dislikeBlog);
router.put(
  "/uploadimg/:bid",
  upload.single("image"),
  controllers.uploadBlogImg
);
router.delete("/:bid", controllers.deleteBlog);

module.exports = router;
