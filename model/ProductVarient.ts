import { TProductVariant } from "@/schema/ProductVarient";
import mongoose from "mongoose";

const ProductVariantDBSchema = new mongoose.Schema<TProductVariant>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  priceodifier: {
    type: Number,
    required: true,
    min: 0,
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
  attributes: {
    type: [
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
    required: true,
  },

  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
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
