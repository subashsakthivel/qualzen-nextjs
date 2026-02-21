import mongoose from "mongoose";
import { TProduct } from "@/schema/Product";
import mongoosePaginate from "mongoose-paginate-v2";
import { ProductVariantModel } from "./ProductVarient";

const ProductDBSchema = new mongoose.Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    audience: {
      type: String,
      enum: ["all", "unisex", "teens", "men", "women", "boys", "girls", "kids"],
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categorySlug: {
      type: String,
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
    feature_location: {
      type: String,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { id: true },
);

ProductDBSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const ProductModel =
  (mongoose.models?.Product as unknown as mongoose.PaginateModel<TProduct>) ||
  mongoose.model<TProduct, mongoose.PaginateModel<TProduct>>("Product", ProductDBSchema);
