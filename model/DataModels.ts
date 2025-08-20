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
  schema: z.ZodObject<any>;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  collections?: {
    [key: string]: {
      model: mongoose.PaginateModel<any> | mongoose.Model<any>;
      schema: z.ZodObject<any>;
    };
  };
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    collections: {
      attributes: {
        model: CategorySpecificAttributesModel,
        schema: categorySpecificAttributesSchema,
      },
      parentCategory: {
        model: CategoryModel,
        schema: CategorySchema,
      },
      category: {
        model: CategoryModel,
        schema: CategorySchema,
      },
    },
  },
  userinfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
  },
  product: {
    schema: ProductSchema,
    dbModel: ProductModel,
    url: "/api/dataAPI/product",
  },
  address: {
    schema: AddressSchema,
    dbModel: AddressModel,
    url: "/api/dataAPI/address",
  },
  order: {
    schema: OrderSchema,
    dbModel: OrderModel,
    url: "/api/dataAPI/order",
  },
};
