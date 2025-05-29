import { TCategory } from "@/schema/Category";
import mongoose from "mongoose";
import mongoosepPaginate from "mongoose-paginate-v2";

const CategoryDbSchema = new mongoose.Schema<TCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: { type: String, required: false },
  parentCategory: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  attributes: {
    type: [mongoose.Types.ObjectId],
    ref: "CategorySpecificAttributes",
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

CategoryDbSchema.plugin(mongoosepPaginate); //todo: need to remove paginate later

export const CategoryModel =
  (mongoose.models?.Category as mongoose.PaginateModel<TCategory>) ||
  mongoose.model<TCategory, mongoose.PaginateModel<TCategory>>("Category", CategoryDbSchema);
