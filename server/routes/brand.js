const router = require("express").Router();
const controllers = require("../controllers/brand.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", [verifyLoginToken, isAdmin], controllers.createBrand);
router.get("/", controllers.getAllBrand);
router.put("/:brid", [verifyLoginToken, isAdmin], controllers.updateBrand);
router.delete("/:brid", [verifyLoginToken, isAdmin], controllers.deleteBrand);

module.exports = router;
