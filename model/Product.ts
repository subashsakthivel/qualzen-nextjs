import mongoose, { Schema, model, models } from "mongoose";
import { ICategory } from "./Category";
import { ProdcutStatus } from "@/utils/Enums";
import { IProperty } from "@/utils/VTypes";

export interface IProduct {
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId | ICategory | string;
  properties: IProperty[];
  marketPrice: number;
  sellPrice: number;
  stock: number;
  images: string[];
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

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
    properties: {
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
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product<IProduct> || model<IProduct>("Product", ProductSchema);
