import { TProductVariant } from "@/schema/ProductVarient";
import mongoose from "mongoose";

const ProductVariantDBSchema = new mongoose.Schema<TProductVariant>({
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
        index: true,
      },
      value: {
        type: String,
        required: true,
        index: true,
      },
      sortOrder: {
        type: Number,
        default: 100,
      },
    },
  ],

  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export const ProductVariantModel =
  (mongoose.models?.ProductVariant as mongoose.Model<TProductVariant>) ||
  mongoose.model<TProductVariant>("ProductVariant", ProductVariantDBSchema);
