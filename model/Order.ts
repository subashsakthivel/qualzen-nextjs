import { TOrder } from "@/schema/Order";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { SequanceModel } from "./Sequance";

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
  receipt: {
    type: String,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["created", "attempted", "paid"],
    default: "created",
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "INR",
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
    type: Number,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer", "UPI"],
    default: "credit_card",
  },
  items: [
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
    type: Map,
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

OrderSchema.pre("save", async function (next: any) {
  if (this.isNew) {
    const counter = await SequanceModel.findByIdAndUpdate(
      { _id: "trackingNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.trackingNumber = counter.seq;
  }
  next();
});

OrderSchema.plugin(mongoosePaginate);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<any>) || mongoose.model("Order", OrderSchema);
