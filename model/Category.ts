import mongoose, { Model, Schema, model, models, mongo } from "mongoose";
import { z } from "zod";

export interface ICategory {
  uid: string;
  name: string;
  description: string;
  parentCategory?: string | ICategory;
  image?: string;
}

export const categorySchema: z.ZodType<ICategory> = z.object({
  uid: z.string(),
  name: z.string(),
  description: z.string(),
  parentCategory: z.union([z.string(), z.lazy(() => categorySchema)]).optional(),
  image: z.string().optional(),
});

const CategoryDBSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String },
    image: { type: String, required: true },
    parentCategory: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", CategoryDBSchema);
