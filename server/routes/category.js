const router = require("express").Router();
const controllers = require("../controllers/category.js");
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
  controllers.createCategory
);

router.get("/", controllers.getAllCategories);
router.put(
  "/:cateid",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  controllers.updateCategory
);
router.delete(
  "/:cateid",
  [verifyLoginToken, isAdmin],
  controllers.deleteCategory
);

module.exports = router;
