const { getSliders, getSliderById, createSlider, updateSlider, deleteSlider } = require("../../controller/admin/sliderController")

const router=require("express").Router()


router.get("/get_all",getSliders)
router.get("/get/:id",getSliderById)
router.post("/create",createSlider)
router.put("/update/:id",updateSlider)
router.delete("/delete/:id",deleteSlider)

module.exports=router