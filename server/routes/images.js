const router = require("express").Router();
const imageStoreController = require("../controllers/imageStore.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");
const upload = require("../config/cloudinary.config.js");

router.post(
  "/",
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  imageStoreController.createImage
);

router.get("/", imageStoreController.getAllImages);
router.get("/getDetail/:title", imageStoreController.getDetailImages);
router.put(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  imageStoreController.updateImage
);

router.delete(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  imageStoreController.deleteImage
);

module.exports = router;
