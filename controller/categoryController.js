const CategoryModel = require("../models/Category");

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { categotyName, subcategories } = req.body;
    const category = new CategoryModel({ categotyName, subcategories });
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      data: savedCategory
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// Get category by subcategory
exports.getCategoryBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.params;
    const category = await CategoryModel.findOne({ subcategories: subcategory });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        data: null
      });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categotyName, subcategories } = req.body;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        data: null
      });
    }

    category.categotyName = categotyName || category.categotyName;
    category.subcategories = subcategories || category.subcategories;
    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        data: null
      });
    }
    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
};
