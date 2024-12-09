import mongoose, { Document, Schema, model, models } from "mongoose";
import { ICategory } from "./Category";
import { ProdcutStatus } from "@/utils/Enums";
export interface IAttribute {
  key: string;
  value: string[];
}

export interface IProductVariation {
  name: string;
  attributes: IAttribute[];
  marketPrice: number;
  sellPrice: number;
  stock: number;
  images: string[];
  status: string;
}

export interface IProduct {
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId | ICategory | string;
  variations: IProductVariation[];
  isActive: boolean;
  tags: string[];
  imageSrc: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDetails extends Document {
  product: IProduct;
  sku: string;
  price: number;
}

const ProductVariationSchema = new Schema<IProductVariation>({
  attributes: {
    type: [
      {
        key: {
          type: String,
          require: true,
          trim: true,
        },
        value: {
          type: [String],
          require: true,
        },
      },
    ],
    required: true,
  },
  marketPrice: {
    type: Number,
    required: true,
    min: 0,
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
  images: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: ProdcutStatus.ACTIVE,
  },
});

const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variations: {
      type: [ProductVariationSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ProductDetailsSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Number },
  marginPrice: { type: Number },
});

export const Product = models.Product<IProduct> || model<IProduct>("Product", ProductSchema);

export const ProductDetails =
  models.ProductDetails<IProductDetails> ||
  model<IProductDetails>("ProductDetails", ProductDetailsSchema);
