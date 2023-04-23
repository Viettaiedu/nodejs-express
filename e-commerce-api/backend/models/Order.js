const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 15,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingFee: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    items: {
      type: [itemSchema],
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "paid", "delivered", "canceled"],
      default: "pending",
    },
    createdByUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      default: null,
    },
    paymentIntendId: {
      type: String,
      default: null,
    },
  },
  {
    timestamp: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
