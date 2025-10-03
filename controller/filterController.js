
const Product = require("../models/productModel")
const mongoose = require('mongoose')

const getFilterProducts = async(req,res)=>{
    try {
        const {category=[],sortBy="price-lower"}=req.query;
        let filters={}
        if(category.length){
            filters.category={$in:category.split(",")}
        }
        let sort={}
        switch(sortBy){
            case 'price-lower':
                sort.price=1
                break
            case 'price-higher':
                sort.price=-1
                break
            case 'atoz':
                sort.productName=1
                break
            case 'ztoa':
                sort.productName=-1
                break
            default :
               sort.price=1
               break    
        }
        const products= await Product.find(filters).sort(sort)
        
        res.json({
        count:products.length,
        success:true,
        data:products,
        message:"Product fetched Successfully "
       }) 
    } catch (error) {
       
       res.json({
        success:false,
        message:"An error occurred while processing your request."
       }) 
    }
}
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
  console.log(category)
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
  console.log(category,subCategory)
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