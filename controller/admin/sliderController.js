const Slider = require("../../models/sliderModel");


exports.createSlider = async (req, res) => {
  try {
    const slider = await Slider.create(req.body);
    res.json({ 
        success: true, 
        data: slider,
        message: "Slider created successfully." // Improved message
    });
  } catch (error) {
    // 400 equivalent message for client-side errors
    res.json({ 
        success: false, 
        message: "Failed to create slider: " + error.message 
    });
  }
};


exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1, createdAt: -1 });
    res.json({ 
        success: true, 
        count: sliders.length, 
        data: sliders,
        message: "All sliders retrieved successfully." // Added message
    });
  } catch (error) {
    // 500 equivalent message for server errors
    res.json({ 
        success: false, 
        message: "Failed to retrieve sliders: " + error.message 
    });
  }
};


exports.getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.json({ 
          success: false, 
          message: "Slider not found with the provided ID." // Improved message
      });
    }
    res.json({ 
        success: true, 
        data: slider,
        message: "Slider details fetched successfully." // Added message
    });
  } catch (error) {
    // Handle specific error for invalid ID format (CastError)
    if (error.name === 'CastError') {
      return res.json({
        success: false,
        message: "Invalid format for slider ID."
      });
    }
    res.json({ 
        success: false, 
        message: "Failed to fetch slider: " + error.message 
    });
  }
};


exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slider) {
      return res.json({ 
          success: false, 
          message: "Slider not found to update." // Improved message
      });
    }

    res.json({ 
        success: true, 
        data: slider,
        message: "Slider successfully updated." // Improved message
    });
  } catch (error) {
    // Handle specific errors for invalid ID format or validation
    if (error.name === 'CastError') {
      return res.json({
        success: false,
        message: "Invalid format for slider ID."
      });
    }
    res.json({ 
        success: false, 
        message: "Update failed: " + error.message 
    });
  }
};


exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.json({ 
          success: false, 
          message: "Slider not found to delete." // Improved message
      });
    }
    res.json({ 
        success: true, 
        message: "Slider successfully deleted." // Improved message
    });
  } catch (error) {
    // Handle specific error for invalid ID format
    if (error.name === 'CastError') {
      return res.json({
        success: false,
        message: "Invalid format for slider ID."
      });
    }
    res.json({ 
        success: false, 
        message: "Failed to delete slider: " + error.message 
    });
  }
};