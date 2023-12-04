const router = require("express").Router();
const purchaseInfoController = require("../controllers/purchaseInfo");

router.get("/", purchaseInfoController.getAllPurchaseInfo);
router.get("/:purchaseid", purchaseInfoController.getDetail);
router.delete("/", purchaseInfoController.deleteProduct);

module.exports = router;
