const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");

// Add Review (only for purchased products, multiple reviews allowed)
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["Confirmed", "Shipped", "Delivered"] }, // only completed/processing orders
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased",
        data: null,
      });
    }

    // Create review (multiple reviews allowed)
    const review = await Review.create({ userId, productId, rating, comment });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};

module.exports = { addReview };


// 2️⃣ Get All Reviews for a Product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required", data: null });
    }

    const reviews = await Review.find({ productId }).populate("userId", "name email").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

// 3️⃣ Update Review
const updateReview = async (req, res) => {
  try {
    const { reviewId, userId, rating, comment } = req.body;

    if (!reviewId || !userId) {
      return res.status(400).json({ success: false, message: "Review ID and user ID required", data: null });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found", data: null });

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only update your own review", data: null });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

// 4️⃣ Delete Review
const deleteReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    if (!reviewId || !userId) {
      return res.status(400).json({ success: false, message: "Review ID and user ID required", data: null });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found", data: null });

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own review", data: null });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

module.exports = { addReview, getProductReviews, updateReview, deleteReview };
