const express = require("express");
const { createCSProduct, getCSProducts, getCSProductById, updateCSProduct, deleteCSProduct } = require("../../controller/admin/comingsoonController");
const router = express.Router();


// Create product
router.post("/create", createCSProduct);

// Get all products
router.get("/get_all", getCSProducts);

// Get single product
router.get("/get/:id", getCSProductById);

// Update product
router.put("/update/:id", updateCSProduct);

// Delete product
router.delete("/delete/:id", deleteCSProduct);

module.exports = router;
