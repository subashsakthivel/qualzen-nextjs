import { Timestamps } from "@/types/types";
import { IProperty } from "@/utils/VTypes";
import mongoose, { Model, Schema, model, models, mongo } from "mongoose";

// export interface ICategory {
//   _id?: string;
//   name: string;
//   imageSrc: string;
//   properties: IProperty[];
//   description: string;
//   parentCategory?: ICategory;
// }

export interface TCategory extends Document, Timestamps {
  name: string;
  description?: string;
  properties: string[];
  parentCategory?: string | TCategory;
  image?: string;
  isActive: boolean;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  properties: string[];
  parentCategory?: string | ICategory;
  image?: string;
  isActive?: boolean;
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String },
    image: { type: String, required: true },
    properties: {
      type: [String],
      default: [],
    },
    parentCategory: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", CategorySchema);
