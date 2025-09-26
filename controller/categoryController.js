const CategoryModel = require("../models/categoryModel");

// Create category
exports.createCategory = async (req, res) => {
     console.log("Body:",req.body)
  try {
    const { categoryName, subcategories } = req.body;
    const category = new CategoryModel({ categoryName, subcategories });
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      data: savedCategory
    });
  } catch (error) {
    console.log(error)
    res.json({
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
      data: categories,
      count:categories.length
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

exports.getSubcategoryByCategory = async (req, res) => {
  try {
    const {categoryName} = req.params;
   
    const category = await CategoryModel.findOne({categoryName});
    console.log(categoryName,category)
    if (!category) {
      return res.json({
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
    console.log(error)
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
    const { categoryName, subcategories } = req.body;
   
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        data: null
      });
    }

    category.categoryName = categoryName || category.categoryName;
    category.subcategories = subcategories || category.subcategories;
    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.json({
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
