const { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductById, 
  getProductsBySubcategory 
} = require("../controller/productController");

const router = require("express").Router();

// Create Product
router.post("/create", createProduct);

// Update Product
router.put("/update/:id", updateProduct);

// Delete Product
router.delete("/delete/:id", deleteProduct);

// Get All Products
router.get("/get_all", getAllProducts);

// Get Product By ID
router.get("/:id", getProductById);

// Get Products By Subcategory
router.get("/get_subcategory/:subCategory", getProductsBySubcategory);

module.exports = router;
