const router = require("express").Router();
const controllers = require("../controllers/blog.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  controllers.createBlog
);
router.get("/", controllers.userGetAllBlog);
router.get("/all", controllers.adminGetBlogList);
router.get("/:bid", controllers.getBlog);
router.put(
  "/:bid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  controllers.updateBlog
);
router.put("/like/:bid", verifyLoginToken, controllers.likeBlog);
router.put("/dislike/:bid", verifyLoginToken, controllers.dislikeBlog);
router.put(
  "/uploadimg/:bid",
  upload.single("image"),
  controllers.uploadBlogImg
);
router.delete("/:bid", controllers.deleteBlog);

module.exports = router;
