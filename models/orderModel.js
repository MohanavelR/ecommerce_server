const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      image: String,
      price: Number,
      sale_price: Number,
      quantity: Number,
      variationKey: String,
      type: String,
      value: String,
      offer: Number,
    }
  ],
  addressInfo: {
    addressId: mongoose.Schema.Types.ObjectId,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentMethods: {
    type: String,
    enum: ["COD", "Card", "UPI", "NetBanking"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  totalAmount: { type: Number, required: true },
  paymentId: String,
  payerId: String,
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;
