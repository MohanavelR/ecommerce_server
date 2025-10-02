// models/cartModel.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        variationKey: {
          type: String, // links to Product.variations.key
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // snapshot fields from variation at the time of adding to cart
        type: { type: String },       // e.g., "color", "size"
        value: { type: String },      // e.g., "Red", "XL"
        price: {
          current: { type: Number, required: true },
          original: { type: Number },
          currency: { type: String, default: "₹" },
        },
        offer: { type: Number, default: 0 }, // store offer percentage or value
        image: { type: String },
        stock: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
