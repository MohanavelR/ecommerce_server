const CategoryModel = require("../models/categoryModel");

// Create category
exports.createCategory = async (req, res) => {
  console.log("Body:", req.body);
  try {
    const { categoryName, subcategories } = req.body;
    
    const existingCategory = await CategoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res.json({
        message: "A category with this name already exists.",
        success: false,
        data: null
      });
    }

    const category = new CategoryModel({ categoryName, subcategories });
    const savedCategory = await category.save();
    res.json({
      message: "Category successfully created.",
      success: true,
      data: savedCategory
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failed to create category: " + error.message,
      success: false,
      data: null
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json({
      message: "All categories successfully retrieved.",
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.json({
      message: "Failed to fetch categories: " + error.message,
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
      return res.json({
        message: "Category containing this subcategory was not found.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Category fetched successfully by subcategory search.",
      success: true,
      data: category
    });
  } catch (error) {
    res.json({
      message: "Failed to search category by subcategory: " + error.message,
      success: false,
      data: null
    });
  }
};

exports.getSubcategoryByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await CategoryModel.findOne({ categoryName });
    console.log(categoryName, category);

    if (!category) {
      return res.json({
        message: "Category not found with the provided name.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Category details fetched successfully.",
      success: true,
      data: category
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failed to fetch category details: " + error.message,
      success: false,
      data: null
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, subcategories } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.json({
        message: "Category not found to perform update.",
        success: false,
        data: null
      });
    }

    // Original logic: find, modify properties, save
    category.categoryName = categoryName || category.categoryName;
    category.subcategories = subcategories || category.subcategories;
    const updatedCategory = await category.save();

    res.json({
      message: "Category updated successfully.",
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    // Handling invalid ID format
    if (error.name === 'CastError') { 
      return res.json({
        message: "Invalid category ID format.",
        success: false,
        data: null
      });
    }
    // Handle validation errors if category.save() fails
    if (error.name === 'ValidationError') { 
       return res.json({
        message: "Update failed due to validation errors.",
        success: false,
        data: null
      });
    }
    // General error
    res.json({
      message: "Failed to update category: " + error.message,
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
      return res.json({
        message: "Category not found to delete.",
        success: false,
        data: null
      });
    }
    res.json({
      message: "Category successfully deleted.",
      success: true,
      data: category
    });
  } catch (error) {
    // Handling invalid ID format
    if (error.name === 'CastError') {
      return res.json({
        message: "Invalid category ID format.",
        success: false,
        data: null
      });
    }
    // General error
    res.json({
      message: "Failed to delete category: " + error.message,
      success: false,
      data: null
    });
  }
};