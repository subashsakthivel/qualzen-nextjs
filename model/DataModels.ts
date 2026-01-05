"use server";
import { CategoryModel } from "./Category";
import mongoose from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { ProductModel } from "./Product";
import { AddressModel } from "./Address";
import { OrderModel } from "./Order";
export interface DataModelInterface {
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    dbModel: CategoryModel,
  },
  userinfo: {
    dbModel: UserInfoModel,
  },
  product: {
    dbModel: ProductModel,
  },
  address: {
    dbModel: AddressModel,
  },
  order: {
    dbModel: OrderModel,
  },
};
