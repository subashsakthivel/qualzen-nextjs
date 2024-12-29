import mongoose, { Schema, model, models } from "mongoose";
import { categorySchema, ICategory } from "./Category";
import { ProdcutStatus } from "@/utils/Enums";
import { z } from "zod";

export interface IProperty {
  name: string;
  value: string[];
}

export interface IProduct {
  uid: string;
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId | ICategory | string;
  properties: IProperty[];
  marginPrice: number;
  marketPrice: number;
  sellPrice: number;
  stock: number;
  images: string[];
  status: ProdcutStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const productSchema: z.ZodType<IProduct> = z.object({
  uid: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.union([z.string(), categorySchema]),
  properties: z.array(z.object({ name: z.string(), value: z.array(z.string()) })).max(6),
  marginPrice: z.number(),
  marketPrice: z.number(),
  sellPrice: z.number(),
  stock: z.number(),
  images: z.array(z.string()).min(3).max(8),
  status: z.nativeEnum(ProdcutStatus),
  tags: z.array(z.string()).max(4),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ProductDBSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    uid: {
      type: String,
      required: true,
      trim: true,
    },
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
          name: {
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
