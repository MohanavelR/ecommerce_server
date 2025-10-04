const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// 1️⃣ Create Order
const createOrder = async (req, res) => {
  try {
    const { userId, cartId, addressId, paymentMethods, paymentId, payerId } = req.body;

    if (!userId || !cartId || !addressId || !paymentMethods) {
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
        title: item.type + " " + item.value,
        image: item.image,
        price: item.price.current,
        sale_price: item.price.original || 0,
        quantity: item.quantity,
        variationKey: item.variationKey,
        type: item.type,
        value: item.value,
        offer: item.offer || 0,
      })),
      addressId,
      paymentMethods:paymentMethods||"Paypal",
      paymentStatus: "Pending",
      totalAmount,
      paymentId: paymentId || null,
      payerId: payerId || null,
      orderStatus: "Pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate fields before sending response
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email")
      .populate("cartId")
      .populate("cartItems.productId", "title price image")
      .populate("addressId");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
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

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("cartItems.productId", "title price image")
      .populate("addressId");
 
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
    if (!orderId)
      return res.status(400).json({ success: false, message: "Order ID required", data: null });

    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("cartItems.productId", "title price image")
      .populate("addressId")


    if (!order)
      return res.status(404).json({ success: false, message: "Order not found", data: null });

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

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email")
      .populate("cartItems.productId", "title price image")
      .populate("addressId");

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: populatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};


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

// 6️⃣ Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email")
      .populate("cartItems.productId", "title price image")
      .populate("addressId");

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
      count:orders.length
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

// ✅ Cancel Order (don't delete it)
const cancelOrder = async (req, res) => {

  const { orderId } = req.body;
  console.log(orderId)
  try {

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🛑 Prevent cancelling after Shipped/Delivered
    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is '${order.status}'`,
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  cancelOrder
};
