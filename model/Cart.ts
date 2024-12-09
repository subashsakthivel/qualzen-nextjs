import mongoose, { Model, Schema, model, models, mongo } from "mongoose";
import { IProduct } from "./Product";

export interface ICart {
  _id?: string;
  userId: string;
  cart: {
    product: IProduct;
    count: number;
  }[];
}

const CartSchema = new Schema({
  userId: { type: String },
  cart: [
    {
      count: { type: Number },
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
    },
  ],
});

export const Cart: Model<IProduct> =
  models.Cart || model<IProduct>("Category", CartSchema);
