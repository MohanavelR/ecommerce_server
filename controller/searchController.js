const Product = require('../models/productModel')
const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
 
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
        const searchedProducts = await Product.find(createSearchQuery)
     
        res.json({
            success: true,
            message: "fetching Searching Products",
            data: searchedProducts,
            count:searchedProducts.length
        })
    } catch (error) {
        
        res.json({
            success: false,
            message: "Some Error Occurred"
        })
    }
}

module.exports = { searchProducts }