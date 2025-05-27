import mongoose from "mongoose";
import { TProduct } from "@/schema/Product";

const ProductDBSchema = new mongoose.Schema<TProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  sku: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discounted_price: {
    type: Number,
    required: false,
    min: 0,
  },
  stock_quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  image_names: {
    type: [String],
    default: [],
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: [String],
        required: true,
        minlength: 1,
      },
    },
  ],
  variants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ProductVariant",
    default: [],
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

export const Product =
  mongoose.models.Product<TProduct> || mongoose.model<TProduct>("Product", ProductDBSchema);
