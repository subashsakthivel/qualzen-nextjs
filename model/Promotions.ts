import { TPromotions } from "@/schema/Promotions";
import mongoose from "mongoose";

const PromotionsDBSchema = new mongoose.Schema<TPromotions>({
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: false,
    default: [],
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  startDate: {
    type: Date,

    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  minimumOrderAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  usageLimitPerUser: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
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

export const Promotions = mongoose.model("Promotions", PromotionsDBSchema);
