import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  billing_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  shipping_method: {
    type: String,
    enum: ["standard", "express"],
    default: "standard",
  },
  shipping_cost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  tracking_number: {
    type: String,
    required: false,
    unique: true,
  },
  payment_method: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    default: "credit_card",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  notes: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
