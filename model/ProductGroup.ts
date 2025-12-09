import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { TProductGroup } from "@/schema/ProductGroup";

const ProductGroupDBSchema = new mongoose.Schema<TProductGroup>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  image: {
    type: String,
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

ProductGroupDBSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const ProductGroupModel =
  (mongoose.models?.TProductGroup as unknown as mongoose.PaginateModel<TProductGroup>) ||
  mongoose.model<TProductGroup, mongoose.PaginateModel<TProductGroup>>(
    "ProductGroup",
    ProductGroupDBSchema
  );
