import { z } from "zod";
import { ProductSchema } from "@/schema/Product";
import { CategorySchema } from "@/schema/Category";
import { AddressSchema } from "@/schema/Address";
import { UserInfoSchema } from "@/schema/UserInfo";
// import { CategorySchema } from "./Category";

export interface IDataSourceMap {
  url: string;
  schema: z.ZodType;
  columns: string[];
  columnConfig?: { [key: string]: { parse?: (value: any) => any } };
}

export const DataSourceMap: {
  [key: string]: IDataSourceMap;
} = {
  category: {
    url: "/api/dataAPI/category",
    schema: CategorySchema,
    columns: ["name", "parentCategory", "description"],
  },
  product: {
    url: "/api/dataAPI/product",
    schema: ProductSchema,
    columns: ["name", "description", "category", "brand"],
    columnConfig: {
      name: {
        parse: (value: any) => ({ value, text_link: `/product/${value}`, type: "url" }),
      },
    },
  },
  address: {
    url: "/api/dataAPI/address",
    schema: AddressSchema,
    columns: [],
  },
  userinfo: {
    url: "/api/dataAPI/userinfo",
    schema: UserInfoSchema,
    columns: [],
  },
};
