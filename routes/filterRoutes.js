// const { getFilterProducts, getProductDetails } = require('../../controllers/shop/shop-ProductController')

const { getFilterProducts, getProductDetails, getProductsByCategory, getProductsByCategoryAndSubcategory } = require('../controller/filterController')

const router = require('express').Router()

router.get('/products',getFilterProducts)
router.get('/products/:sku',getProductDetails)
router.get('/products/category/:category',getProductsByCategory)
router.get("/products/sub-category/:category/:subCategory",getProductsByCategoryAndSubcategory)

module.exports=router