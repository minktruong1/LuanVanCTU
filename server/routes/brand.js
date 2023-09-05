const router = require("express").Router();
const controllers = require("../controllers/brand.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.post("/", controllers.createBrand);
router.get("/", controllers.getAllBrand);
router.put("/:brid", controllers.updateBrand);
router.delete("/:brid", controllers.deleteBrand);

module.exports = router;
