const { createCategory, updateCategory, deleteCategory, getAllCategories, getSubcategoryByCategory } = require("../controller/categoryController")

const router=require("express").Router()

router.post("/create",createCategory)
router.put("/update/:id",updateCategory)
router.delete("/delete/:id",deleteCategory)
router.get("/get_all",getAllCategories)
router.get("/get_subcategory/:categorySKU",getSubcategoryByCategory)


module.exports=router