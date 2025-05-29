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
  discountedPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  stockQuantity: {
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
  imageNames: {
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
  tags: {
    type: [String],
    default: [],
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

export const Product =
  mongoose.models.Product<TProduct> || mongoose.model<TProduct>("Product", ProductDBSchema);
