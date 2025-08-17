import mongoose from "mongoose";
import { TProduct } from "@/schema/Product";
import mongoosePaginate from "mongoose-paginate-v2";

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
  sellingPrice: {
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
  images: {
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
        type: String,
        required: true,
      },
      sortOrder: {
        type: Number,
        default: 100,
      },
    },
  ],
  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
  ],
  tags: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  instructions: {
    type: String,
  },
  otherdetails: {
    type: String,
  },
  relatedLinks: {
    type: [String],
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

ProductDBSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const ProductModel =
  (mongoose.models?.Product as unknown as mongoose.PaginateModel<TProduct>) ||
  mongoose.model<TProduct, mongoose.PaginateModel<TProduct>>("Product", ProductDBSchema);
