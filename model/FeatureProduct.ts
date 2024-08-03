import mongoose, { model, models, Schema } from "mongoose";
import { IProduct } from "./Product";

export interface IFeatureProduct {
  product: IProduct;
  banner_imgSrc: string;
  cover_imgSrc: string;
}

const FeatureProductSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", require: true },
  banner_imgSrc: { type: String, required: true },
  cover_imgSrc: { type: String, required: true },
});

export const FeatureProduct =
  models.Product<IProduct> ||
  model<IFeatureProduct>("FeatureProduct", FeatureProductSchema);
