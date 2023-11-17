const router = require("express").Router();
const controllers = require("../controllers/image.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  [verifyLoginToken, isAdmin],
  upload.array("images", 10), // Tối đa 10 ảnh
  controllers.createImage
);

router.get("/", controllers.getAllImages);
router.put(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  upload.array("images", 10), // Tối đa 10 ảnh
  controllers.updateImage
);

router.delete(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  controllers.deleteImage
);

module.exports = router;
