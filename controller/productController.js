const Product = require("../models/productModel");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      price,
      category,
      subCategory,
      brand,
      offer,
      description,
      features,
      additionalInfo,
      images,
      isTrending,
      variations
    } = req.body;

    const product = new Product({
      productName,
      sku,
      price,
      category,
      subCategory,
      brand,
      offer,
      description,
      features,
      additionalInfo,
      images,
      isTrending,
      variations
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
 
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: products,
      count:products.length
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message,
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
      return res.status(404).json({
        message: "Product not found",
        success: false,
        data: null
      });
    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// GET PRODUCTS BY SUBCATEGORY
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subCategory } = req.params;
    const products = await Product.find({ subCategory }).populate("category");
    if (!products.length)
      return res.status(404).json({
        message: "No products found for this subcategory",
        success: false,
        data: []
      });
    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  console.log(req.body)
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id,
  { $set: req.body },   // use $set to update only the fields in req.body
  { new: true, runValidators: true });
    if (!product)
      return res.status(404).json({
        message: "Product not found",
        success: false,
        data: null
      });

    // merge updates
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
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
      return res.status(404).json({
        message: "Product not found",
        success: false,
        data: null
      });
    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};
