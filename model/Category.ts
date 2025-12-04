import { TCategory } from "@/schema/Category";
import R2Util from "@/util/server/file/S3Util";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { FileStoreModel } from "./FileStore";

const CategoryDbSchema = new mongoose.Schema<TCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: { type: String, required: false },
  description: { type: String, required: false },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
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

CategoryDbSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const CategoryModel =
  (mongoose.models?.Category as unknown as mongoose.PaginateModel<TCategory>) ||
  mongoose.model<TCategory, mongoose.PaginateModel<TCategory>>("Category", CategoryDbSchema);
