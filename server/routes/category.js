const router = require("express").Router();
const categoryController = require("../controllers/category.js");
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
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);
router.put(
  "/:cateid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  categoryController.updateCategory
);
router.delete(
  "/:cateid",
  [verifyLoginToken, isAdmin],
  categoryController.deleteCategory
);

module.exports = router;
