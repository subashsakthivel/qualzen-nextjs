import { ProdcutStatus } from "@/utils/Enums";
import { IProperty } from "@/utils/VTypes";
import { Document } from "mongodb";
import mongoose, { Model, Schema, model, models, mongo } from "mongoose";

export interface ICategory {
  _id?: string;
  name: string;
  imageSrc: string;
  properties: IProperty[];
  description: string;
  parentCategory?: ICategory;
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  imageSrc: { type: String },
  properties: [{ type: Object }],
  description: { type: String },
  parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
});

export const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", CategorySchema);
