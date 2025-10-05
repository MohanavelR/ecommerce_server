const express = require("express");
const router = express.Router();
const {
  addReview,
  // getProductReviews,
  updateReview,
  deleteReview,
  getProductReviews,
} = require("../controller/reviewController");

// ✅ Create Review
router.post("/create", addReview);

// ✅ Get All Reviews for a Product
router.get("/get/:productId", getProductReviews);

// ✅ Update Review
router.put("/update", updateReview);

// ✅ Delete Review
router.delete("/delete", deleteReview);

module.exports = router;
