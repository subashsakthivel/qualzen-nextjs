import { z } from "zod";
import { ProductSchema } from "@/schema/Product";
import { CategorySchema } from "@/schema/Category";
// import { CategorySchema } from "./Category";

export interface IDataSourceMap {
  url: string;
  schema: z.ZodType;
  columns: string[];
}

export const DataSourceMap: {
  [key: string]: IDataSourceMap;
} = {
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
};
