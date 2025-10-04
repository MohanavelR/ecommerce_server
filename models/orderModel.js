const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        sale_price: { type: Number },
        quantity: { type: Number, required: true },
        variationKey: { type: String },
        type: { type: String },
        value: { type: String },
        offer: { type: Number, default: 0 },
      },
    ],

    // Reference to Address model instead of embedding
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "address", required: true },

    orderStatus: {
      type: String,
      enum: ["Pending","Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethods: {
      type: String,
      // enum: ["COD", "Card", "UPI", "NetBanking"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    payerId: { type: String },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
