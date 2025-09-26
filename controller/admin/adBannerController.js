const Banner = require("../../models/adBannerModel");


exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner,message:"Successfully created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: banners ,count:banners.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner)
      return res.status(404).json({ success: false, message: "Banner not found" });
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner)
      return res.status(404).json({ success: false, message: "Banner not found" });
    res.status(200).json({ success: true, data: banner,message:"Successfully Updated"});
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner)
      return res.status(404).json({ success: false, message: "Banner not found" });
    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
