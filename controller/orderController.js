const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// 1️⃣ Create Order
const createOrder = async (req, res) => {
  try {
    const { userId, cartId, addressInfo, paymentMethods, paymentId, payerId } = req.body;

    if (!userId || !cartId || !addressInfo || !paymentMethods) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
        data: null,
      });
    }

    const cart = await Cart.findById(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
        data: null,
      });
    }

    // Calculate totalAmount
    const totalAmount = cart.items.reduce((sum, item) => {
      const discountedPrice =
        item.price.current - (item.price.current * (item.offer || 0)) / 100;
      return sum + discountedPrice * item.quantity;
    }, 0);

    const order = await Order.create({
      userId,
      cartId,
      cartItems: cart.items.map((item) => ({
        productId: item.productId,
        title: item.type + " " + item.value, // optional
        image: item.image,
        price: item.price.current,
        sale_price: item.price.current - (item.price.current * (item.offer || 0)) / 100,
        quantity: item.quantity,
        variationKey: item.variationKey,
        type: item.type,
        value: item.value,
        offer: item.offer || 0,
      })),
      addressInfo,
      paymentMethods,
      paymentStatus: "Pending",
      totalAmount,
      paymentId: paymentId || null,
      payerId: payerId || null,
      orderStatus: "Pending",
    });

    // Optionally, clear cart after order
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
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

// 2️⃣ Get Orders by User
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required", data: null });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
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

// 3️⃣ Get Single Order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required", data: null });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found", data: null });

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
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

// 4️⃣ Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status required", data: null });
    }

    const allowedStatus = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status", data: null });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found", data: null });

    order.orderStatus = status;
    order.orderUpdateDate = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

// 5️⃣ Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required", data: null });

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found", data: null });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
