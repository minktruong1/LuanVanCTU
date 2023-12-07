const router = require("express").Router();
const exportController = require("../controllers/exportData.js");
const { verifyLoginToken, isAdmin } = require("../middlewares/verifyToken.js");

router.get("/all", exportController.exportAllData);

module.exports = router;
