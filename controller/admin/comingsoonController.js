const ComingSoonProduct = require("../../models/comingsoonModel");

// ✅ Create product
exports.createCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.create(req.body);
    res.status(201).json({ success: true, data: product,message:"Successfully created Poster" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all products
exports.getCSProducts = async (req, res) => {
  try {
    const products = await ComingSoonProduct.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products,count:products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single product
exports.getCSProductById = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.updateCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product,message:"successfully Updated Poster" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.deleteCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
