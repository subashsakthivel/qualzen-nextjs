import { TProductVariant } from "@/schema/ProductVarient";
import mongoose from "mongoose";

const ProductVariantDBSchema = new mongoose.Schema<TProductVariant>({
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  variantSpecificPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  imageNames: {
    type: [String],
    default: [],
    minlength: 1,
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ProductVariantModel =
  mongoose.models.ProductVariant<TProductVariant> ||
  mongoose.model<TProductVariant>("ProductVariant", ProductVariantDBSchema);
