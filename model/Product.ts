import mongoose from "mongoose";
import { TProduct } from "@/schema/Product";
import mongoosePaginate from "mongoose-paginate-v2";
import { ProductVariantModel } from "./ProductVarient";

const ProductDBSchema = new mongoose.Schema<TProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
  variants: [ProductVariantModel.schema],
  tags: {
    type: [String],
    default: [],
  },
  otherdetails: {
    type: String,
  },
  relatedLinks: {
    type: [{ name: String, url: String }],
    default: [],
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
