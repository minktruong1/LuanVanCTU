const router = require("express").Router();
const blogController = require("../controllers/blog.js");
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
  blogController.createBlog
);
router.get("/", blogController.userGetAllBlog);
router.get("/all", blogController.adminGetBlogList);
router.get("/:bid", blogController.getBlog);
router.put(
  "/:bid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  blogController.updateBlog
);
router.put("/like/:bid", verifyLoginToken, blogController.likeBlog);
router.put("/dislike/:bid", verifyLoginToken, blogController.dislikeBlog);
router.put(
  "/uploadimg/:bid",
  upload.single("image"),
  blogController.uploadBlogImg
);
router.delete("/:bid", blogController.deleteBlog);

module.exports = router;
