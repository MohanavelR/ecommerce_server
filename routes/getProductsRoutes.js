const express = require("express");
const router = express.Router();
const { getGroupedProducts, getRelatedProducts } = require("../controller/shop/getProductsController");

router.get("/grouped", getGroupedProducts);
router.get("/related", getRelatedProducts)

module.exports = router;
