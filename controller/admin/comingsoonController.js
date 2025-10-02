const ComingSoonProduct = require("../../models/comingsoonModel");

// ✅ Create product
exports.createCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.create(req.body);
    res.json({ 
        success: true, 
        data: product,
        message: "Coming Soon Product successfully created." 
    });
  } catch (error) {
    res.json({ 
        success: false, 
        message: "Failed to create Coming Soon Product: " + error.message
    });
  }
};

// ✅ Get all products
exports.getCSProducts = async (req, res) => {
  try {
    const products = await ComingSoonProduct.find().sort({ createdAt: -1 });
    console.log(products)
    res.json({ 
        success: true, 
        data: products,
        count: products.length,
        message: "All Coming Soon Products retrieved successfully."
    });
  } catch (error) {
    res.json({ 
        success: false, 
        message: "Failed to retrieve Coming Soon Products: " + error.message
    });
  }
};

// ✅ Get single product
exports.getCSProductById = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findById(req.params.id);
    if (!product)
      return res.json({ 
          success: false, 
          message: "Coming Soon Product not found with the provided ID."
      });
    res.json({ 
        success: true, 
        data: product,
        message: "Coming Soon Product details fetched successfully."
    });
  } catch (error) {
    // Handling invalid ID format (CastError)
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for Coming Soon Product ID."
        });
    }
    // Original general error handling
    res.json({ 
        success: false, 
        message: error.message 
    });
  }
};

exports.updateCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res.json({ 
          success: false, 
          message: "Coming Soon Product not found to update."
      });
    res.json({ 
        success: true, 
        data: product,
        message: "Coming Soon Product successfully updated."
    });
  } catch (error) {
    // Handle specific errors for invalid ID format or validation
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for Coming Soon Product ID."
        });
    }
    res.json({ 
        success: false, 
        message: "Update failed: " + error.message
    });
  }
};


exports.deleteCSProduct = async (req, res) => {
  try {
    const product = await ComingSoonProduct.findByIdAndDelete(req.params.id);
    if (!product)
      return res.json({ 
          success: false, 
          message: "Coming Soon Product not found to delete."
      });
    res.json({ 
        success: true, 
        message: "Coming Soon Product successfully deleted."
    });
  } catch (error) {
    // Handle specific error for invalid ID format
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for Coming Soon Product ID."
        });
    }
    res.json({ 
        success: false, 
        message: "Failed to delete Coming Soon Product: " + error.message
    });
  }
};