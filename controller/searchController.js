const Product = require('../models/productModel')
const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        
        const {page=1,limit=12}=req.query;

        if (!keyword || typeof keyword !== 'string') {
            return res.json({
                success: false,
                message: 'Keyword is Required and Must be in String format'
            })
        }

const regEx = new RegExp(keyword, 'i');
const createSearchQuery = {
    $or: [

        { productName: regEx },
 
        { description: regEx },

        { category: regEx },
     
        { brand: regEx },
      
        { subCategory: regEx }
    ]
};
 const skip = (page - 1) * limit;
const totalCount=await Product.countDocuments(createSearchQuery)
const searchedProducts = await Product.find(createSearchQuery).skip(skip).limit(limit)

        res.json({
            success: true,
            message: "fetching Searching Products",
            data: searchedProducts,
            currentCount:searchedProducts.length,
            page,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            page: parseInt(page),
        })
    } catch (error) {
        
        res.json({
            success: false,
            message: "Some Error Occurred"
        })
    }
}

module.exports = { searchProducts }