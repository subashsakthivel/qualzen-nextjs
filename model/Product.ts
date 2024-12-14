import mongoose, { Schema, model, models } from "mongoose";
import { categorySchema, ICategory } from "./Category";
import { ProdcutStatus } from "@/utils/Enums";
import { z } from "zod";

export interface IProperty {
  name: string;
  value: string[];
}
export interface IProduct {
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId | ICategory | string;
  properties: IProperty[];
  marginPrice: number;
  marketPrice: number;
  sellPrice: number;
  stock: number;
  images: string[];
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.union([z.string(), categorySchema]),
  properties: z.array(z.object({ name: z.string(), value: z.array(z.string()) })),
  marginPrice: z.number(),
  marketPrice: z.number(),
  sellPrice: z.number(),
  stock: z.number(),
  images: z.array(z.string()),
  status: z.string(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ProductDBSchema: Schema<IProduct> = new Schema<IProduct>(
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
    properties: {
      type: [
        {
          key: {
            type: String,
            require: true,
          },
          value: {
            type: [String],
            require: true,
          },
        },
      ],
      required: true,
    },
    marginPrice: {
      type: Number,
      required: true,
      min: 0,
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
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product<IProduct> || model<IProduct>("Product", ProductDBSchema);
