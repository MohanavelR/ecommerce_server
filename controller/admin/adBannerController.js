const Banner = require("../../models/adBannerModel");


exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.json({ 
        success: true, 
        data: banner,
        message: "Ad Banner successfully created." 
    });
  } catch (error) {
    res.json({ 
        success: false, 
        message: "Failed to create banner: " + error.message 
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json({ 
        success: true, 
        data: banners,
        count: banners.length,
        message: "All ad banners retrieved successfully." 
    });
  } catch (error) {
    res.json({ 
        success: false, 
        message: "Failed to retrieve banners due to a server error: " + error.message 
    });
  }
};


exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner)
      return res.json({ 
          success: false, 
          message: "Ad Banner not found with the provided ID." 
      });
    res.json({ 
        success: true, 
        data: banner,
        message: "Ad Banner details fetched successfully." 
    });
  } catch (error) {
    // Handle specific error for invalid ID format
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for banner ID." 
        });
    }
    res.json({ 
        success: false, 
        message: "Failed to retrieve banner: " + error.message 
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner)
      return res.json({ 
          success: false, 
          message: "Ad Banner not found to update." 
      });
    res.json({ 
        success: true, 
        data: banner,
        message: "Ad Banner successfully updated." 
    });
  } catch (error) {
    // Handle specific errors for invalid ID format or validation
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for banner ID." 
        });
    }
    res.json({ 
        success: false, 
        message: "Update failed: " + error.message 
    });
  }
};


exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner)
      return res.json({ 
          success: false, 
          message: "Ad Banner not found to delete." 
      });
    res.json({ 
        success: true, 
        message: "Ad Banner successfully deleted." 
    });
  } catch (error) {
    // Handle specific error for invalid ID format
    if (error.name === 'CastError') {
        return res.json({ 
            success: false, 
            message: "Invalid format for banner ID." 
        });
    }
    res.json({ 
        success: false, 
        message: "Failed to delete banner: " + error.message 
    });
  }
};