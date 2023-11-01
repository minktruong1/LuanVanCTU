const router = require("express").Router();
const controllers = require("../controllers/category.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  controllers.createCategory
);
router.post("/:cid/brands", controllers.addBrandToCategory);

router.get("/", controllers.getAllCategories);
router.put("/:cid", controllers.updateCategory);
router.delete("/:cid", controllers.deleteCategory);
router.put(
  "/uploadimg/:cid",
  upload.single("image"),
  controllers.uploadCategoryImage
);

module.exports = router;
