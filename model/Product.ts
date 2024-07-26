import mongoose, { Document, Schema, model, models } from "mongoose";
import { ICategory } from "./Category";
import { IProperty } from "@/utils/VTypes";
import { ProdcutStatus } from "@/utils/Enums";

export interface ICommonProductPerperties {
  size?: string[];
  details?: string;
  careInstructions?: string;
  color?: string[];
}

export interface IProduct extends ICommonProductPerperties {
  _id?: string;
  name: string;
  description: string;
  imageSrc: string[];
  category: ICategory;
  marketPrice: number;
  sellingPrice: number;
  status: ProdcutStatus;
  properties: IProperty[];
}

export interface IProductDetails {
  _id?: string;
  product: IProduct;
  createdAt: number;
  expiryDate?: number;
  marginPrice?: number;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageSrc: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  marketPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  properties: [{ type: Object }],
  size: [{ type: String }],
  details: { type: String },
  careInstructions: { type: String },
  color: [{ type: String }],
});

const ProductDetailsSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Number },
  marginPrice: { type: Number },
});

export const Product =
  models.Product<IProduct> || model<IProduct>("Product", ProductSchema);

export const ProductDetails =
  models.ProductDetails<IProductDetails> ||
  model<IProductDetails>("ProductDetails", ProductDetailsSchema);
