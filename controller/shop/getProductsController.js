const Product = require("../../models/productModel");


// 🧩 Helper function: check if any variation has offer > 0
const hasOfferVariation = (product) =>
  product.variations?.some((v) => v.offer && v.offer > 0);

// ✅ GET Grouped Products (feature, offer, trending)
exports.getGroupedProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    const featureProducts = [];
    const offerProducts = [];
    const trendingProducts = [];

    // 🧠 Categorize all products
    for (const product of products) {
      if (product.isTrending) {
        trendingProducts.push(product);
      } else if (hasOfferVariation(product)) {
        offerProducts.push(product);
      } else {
        featureProducts.push(product);
      }
    }

    // 🔽 Sort each group by createdAt (latest first)
    const sortByDate = (arr) =>
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 🔁 Sort and limit each category
    const sortedFeature = sortByDate(featureProducts);
    const sortedOffer = sortByDate(offerProducts);
    const sortedTrending = sortByDate(trendingProducts);

    // ✅ Limit only if more than 25
    const limitTo25 = (arr) => (arr.length > 25 ? arr.slice(0, 25) : arr);

    res.status(200).json({
      success: true,
      counts: {
        feature: sortedFeature.length,
        offer: sortedOffer.length,
        trending: sortedTrending.length,
      },
      featureProducts: limitTo25(sortedFeature),
      offerProducts: limitTo25(sortedOffer),
      trendingProducts: limitTo25(sortedTrending),
    });
  } catch (error) {
    console.error("Error fetching grouped products:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getRelatedProducts = async (req, res) => {
  try {
    const { category, excludeSku,page=1,limit=10 } = req.query; // pass ?category=Dogs&excludeSku=DO-123
  
    if (!category)
      return res.status(400).json({ message: "Category is required" });
   const skip = (page - 1) * limit;
    const relatedProducts = await Product.find({
      category,
      sku: { $ne: excludeSku },
    }).skip(skip).limit(limit);
    const totalCount=await Product.countDocuments({category,sku:{$ne:excludeSku}})
    res.status(200).json({
      success: true,
      currentCount: relatedProducts.length,
      data:relatedProducts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page: parseInt(page)
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};