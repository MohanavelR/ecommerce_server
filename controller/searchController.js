const Product = require('../models/productModel')
const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        console.log(keyword)
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
        // console.log(searchProducts)
        res.json({
            success: true,
            message: "fetching Searching Products",
            data: searchedProducts,
            count:searchedProducts.length
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Some Error Occurred"
        })
    }
}

module.exports = { searchProducts }