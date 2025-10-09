
const Product = require("../models/productModel")
const mongoose = require('mongoose')
const getFilterProducts = async (req, res) => {
  try {
    const { category = "", sortBy = "price-lower", page = 1, limit = 9 } = req.query;

    let filters = {};

    // 🔹 Filter by category if provided
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    // 🔹 Define sorting rules
    let sort = {};
    switch (sortBy) {
      case "price-lower":
        sort["variations.0.price.current"] = 1;
        break;
      case "price-higher":
        sort["variations.0.price.current"] = -1;
        break;
      case "atoz":
        sort.productName = 1;
        break;
      case "ztoa":
        sort.productName = -1;
        break;
      default:
        sort["variations.0.price.current"] = 1;
        break;
    }

    // 🔹 Pagination setup
    const skip = (page - 1) * limit;
    // 🔹 Count total products (before pagination)
    const totalCount = await Product.countDocuments(filters);
    // 🔹 Fetch products with filters, sort & pagination
    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // ✅ Response
    res.json({
      success: true,
      message: "Products retrieved successfully.",
      data: products,
      currentCount: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page: parseInt(page),
    });

  } catch (error) {
    console.error("Error in getFilterProducts:", error);
    res.json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};



const getProductDetails = async(req,res)=>{
    try {
   const { sku } = req.params;

           const product = await Product.findOne({sku})
           if (!product) {
               return res.status(404).json({
                   success: false,
                   message: "Product not found."
               });
           }
           res.status(200).json({
               success: true,
               message: "Product get successfully.",
               product
           });
       } catch (error) {
           
           res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
           });
       }
   }


// 1️⃣ Fetch products by category
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Category is required"
    });
  }

  try {
    const products = await Product.find({ category });
    res.status(200).json({
      success: true,
      message: `Products fetched for category: ${category}`,
      data: products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products by category."
    });
  }
};

// 2️⃣ Fetch products by category and subcategory
const getProductsByCategoryAndSubcategory = async (req, res) => {
  const { category, subCategory } = req.params;


  if (!category || !subCategory) {
    return res.status(400).json({
      success: false,
      message: "Category and Subcategory are required"
    });
  }

  try {
    const products = await Product.find({ category, subCategory });
    res.status(200).json({
      success: true,
      message: `Products fetched for category: ${category}, subcategory: ${subCategory}`,
      data: products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products by category and subcategory."
    });
  }
};



module.exports={getFilterProducts,getProductDetails,getProductsByCategory,getProductsByCategoryAndSubcategory}