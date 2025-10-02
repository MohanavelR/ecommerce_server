const Product = require("../models/productModel");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      category,
      subCategory,
      brand,
      description,
      features,
      additionalInfo,
      images,
      isTrending,
      variations
    } = req.body;

    // Ensure variations array is provided
    if (!variations || !variations.length) {
      return res.json({
        message: "At least one variation is required.",
        success: false,
        data: null
      });
    }

    const product = new Product({
      productName,
      sku,
      category,
      subCategory,
      brand,
      description,
      features,
      additionalInfo,
      images,
      isTrending,
      variations
    });

    const savedProduct = await product.save();

    res.json({
      message: "Product successfully created and saved.",
      success: true,
      data: savedProduct
    });
  } catch (error) {
    res.json({
      message: "Failed to create product: " + error.message,
      success: false,
      data: null
    });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      message: "All products retrieved successfully.",
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failed to retrieve all products: " + error.message,
      success: false,
      data: null
    });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.json({
        message: "Product not found with the provided ID.",
        success: false,
        data: null
      });
    res.json({
      message: "Product details fetched successfully.",
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.json({
        message: "Invalid product ID format or Product not found.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Failed to fetch product by ID: " + error.message,
      success: false,
      data: null
    });
  }
};

// GET PRODUCTS BY SUBCATEGORY
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subCategory } = req.params;
    const products = await Product.find({ subCategory });
    if (!products.length)
      return res.json({
        message: "No products found matching this subcategory.",
        success: false,
        data: []
      });
    res.json({
      message: "Products for subcategory retrieved successfully.",
      success: true,
      data: products
    });
  } catch (error) {
    res.json({
      message: "Failed to fetch products by subcategory: " + error.message,
      success: false,
      data: null
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },   // only update fields provided
      { new: true, runValidators: true }
    );

    if (!product)
      return res.json({
        message: "Product not found to update.",
        success: false,
        data: null
      });

    res.json({
      message: "Product successfully updated.",
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.json({
        message: "Invalid product ID format.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Update failed: " + error.message,
      success: false,
      data: null
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.json({
        message: "Product not found to delete.",
        success: false,
        data: null
      });
    res.json({
      message: "Product successfully deleted.",
      success: true,
      data: deletedProduct
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.json({
        message: "Invalid product ID format or Product not found.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Failed to delete product: " + error.message,
      success: false,
      data: null
    });
  }
};
