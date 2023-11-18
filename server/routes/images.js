const router = require("express").Router();
const controllers = require("../controllers/imageStore.js");
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
  controllers.createImage
);

router.get("/", controllers.getAllImages);
router.get("/getDetail/:title", controllers.getDetailImages);
router.put(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  controllers.updateImage
);

router.delete(
  "/:imageId",
  [verifyLoginToken, isAdmin],
  controllers.deleteImage
);

module.exports = router;
