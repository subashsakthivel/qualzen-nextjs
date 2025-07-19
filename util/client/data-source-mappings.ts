import { z } from "zod";
import { ProductSchema } from "@/schema/Product";
import { CategorySchema } from "@/schema/Category";
import { AddressSchema } from "@/schema/Address";
import { UserInfoSchema } from "@/schema/UserInfo";

interface IDataSourceMap {
  url: string;
  schema: z.ZodType;
  columns: string[];
}

export type TDataSources = "category" | "product" | "address" | "userinfo";

export const DataSourceMap: Record<TDataSources, IDataSourceMap> = {
  category: {
    url: "/api/dataAPI/category",
    schema: CategorySchema,
    columns: ["name", "parentCategory", "description", "updatedAt"],
  },
  product: {
    url: "/api/dataAPI/product",
    schema: ProductSchema,
    columns: [
      "name",
      "description",
      "sku",
      "price",
      "discounted_price",
      "stock_quantity",
      "category",
      "brand",
      "image_urls",
    ],
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
