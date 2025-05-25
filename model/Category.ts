import { TCategory } from "@/schema/Category";
import mongoose from "mongoose";
import mongoosepPaginate from "mongoose-paginate-v2";

const CategoryDbSchema = new mongoose.Schema({
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
  parent_category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

CategoryDbSchema.plugin(mongoosepPaginate);

export const CategoryModel =
  (mongoose.models?.Category as mongoose.PaginateModel<TCategory>) ||
  mongoose.model<TCategory, mongoose.PaginateModel<TCategory>>("Category", CategoryDbSchema);
