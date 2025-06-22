import { TOrder } from "@/schema/Order";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema<TOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  shippingMethod: {
    type: String,
    enum: ["standard", "express"],
    default: "standard",
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  trackingNumber: {
    type: String,
    required: false,
    unique: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer", "UPI"],
    default: "credit_card",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: false,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.plugin(mongoosePaginate);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<any>) || mongoose.model("Order", OrderSchema);
