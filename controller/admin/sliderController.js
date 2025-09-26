const Slider = require("../../models/sliderModel");


exports.createSlider = async (req, res) => {
  try {
    const slider = await Slider.create(req.body);
    res.status(201).json({ success: true, data: slider,message:"Successfully created Slider" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: sliders.length, data: sliders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


exports.getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.json({ success: false, message: "Slider not found" });
    }
    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slider) {
      return res.json({ success: false, message: "Slider not found" });
    }

    res.status(200).json({ success: true, data: slider,message:"Successfully Updated Slider" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.json({ success: false, message: "Slider not found" });
    }
    res.status(200).json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
