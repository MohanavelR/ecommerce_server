const express = require("express");
const { createBanner, getBanners, getBannerById, updateBanner, deleteBanner } = require("../../controller/admin/adBannerController");
const router = express.Router();



router.post("/create", createBanner);       // Create
router.get("/get_all", getBanners);          // Get all
router.get("/get/:id", getBannerById);    // Get one
router.put("/update/:id", updateBanner);     // Update
router.delete("/delete/:id", deleteBanner);  // Delete

module.exports = router;