import { z } from "zod";
import { ProductSchema } from "@/schema/Product";
import { CategorySchema } from "@/schema/Category";
import { AddressSchema } from "@/schema/Address";
import { UserInfoSchema } from "@/schema/UserInfo";
import { tDataModels } from "../util-type";

interface IDataSourceMap {
  url: string;
  schema: z.ZodType;
}

export const DataSourceMap: Record<tDataModels, IDataSourceMap> = {
  category: {
    url: "/api/dataAPI/category",
    schema: CategorySchema,
  },
  product: {
    url: "/api/dataAPI/product",
    schema: ProductSchema,
  },
  address: {
    url: "/api/dataAPI/address",
    schema: AddressSchema,
  },
  userinfo: {
    url: "/api/dataAPI/userinfo",
    schema: UserInfoSchema,
  },
};
