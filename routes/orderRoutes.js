const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  cancelOrder,
} = require("../controller/orderController");

const router = express.Router();

// 1️⃣ Create Order
router.post("/create", createOrder);

// 2️⃣ Delete Order
router.delete("/delete", deleteOrder);

// 3️⃣ Get Orders by User
router.get("/get_user/:userId", getUserOrders);

// 4️⃣ Get All Orders (Admin)
router.get("/get_all", getAllOrders);

// 5️⃣ Get Single Order by ID
router.get("/get_by/:orderId", getOrderById);

// 6️⃣ Update Order Status
router.put("/update", updateOrderStatus);
router.put("/cancel", cancelOrder);

module.exports = router;
