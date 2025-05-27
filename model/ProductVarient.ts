import { TProductVariant } from "@/schema/ProductVarient";
import { min } from "date-fns";
import { create } from "domain";
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
  price_modifier: {
    type: Number,
    required: true,
    min: 0,
  },
  variant_specific_price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  image_names: {
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

  is_active: {
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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const ProductVariantModel =
  mongoose.models.ProductVariant<TProductVariant> ||
  mongoose.model<TProductVariant>("ProductVariant", ProductVariantDBSchema);
