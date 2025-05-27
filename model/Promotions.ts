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
  discount_type: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discount_value: {
    type: Number,
    required: true,
    min: 0,
  },
  start_date: {
    type: Date,

    required: false,
  },
  end_date: {
    type: Date,
    required: false,
  },
  minimum_order_amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  usage_limit_per_user: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
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

export const Promotions = mongoose.model("Promotions", PromotionsDBSchema);
