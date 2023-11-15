const router = require("express").Router();
const controllers = require("../controllers/searchProduct");

router.get("/searchproduct/:searchProduct", controllers.searchProduct);

module.exports = router;
