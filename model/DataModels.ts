"use server";
import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose, { PaginateOptions } from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { CategorySchema, TCategory } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { categorySpecificAttributesSchema } from "@/schema/CategorySpecificAttributes";
import { CategorySpecificAttributesModel } from "./CategorySpecificAttributes";
import { ProductAttributeSchema, ProductSchema } from "@/schema/Product";
import { ProductModel } from "./Product";
import { ProductVariantModel } from "./ProductVarient";
import { ProductVariantSchema } from "@/schema/ProductVarient";
import { AddressModel } from "./Address";
import { AddressSchema } from "@/schema/Address";
import { OrderSchema } from "@/schema/Order";
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
  categoryspecificattributes: {
    dbModel: CategorySpecificAttributesModel,
  },
};
