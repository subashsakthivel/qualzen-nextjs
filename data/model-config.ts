import { z } from "zod";
import { ProductSchema, TProduct } from "@/schema/Product";
import { CategorySchema, TCategory } from "@/schema/Category";
import { AddressSchema, TAddress } from "@/schema/Address";
import { TUserInfo, UserInfoSchema } from "@/schema/UserInfo";
// all of this shoul be in server side
export interface IModelConfig {
  schema: z.ZodType;
  columns: string[];
  columnConfig?: { [key: string]: { parse?: (value: any) => any } };
}

export type ModelType = {
  category: TCategory;
  product: TProduct;
  address: TAddress;
  userinfo: TUserInfo;
};

export const ModelConfig: Record<keyof ModelType, IModelConfig> = {
  category: {
    schema: CategorySchema,
    columns: ["name", "description", "image"],
  },
  product: {
    schema: ProductSchema,
    columns: ["name", "description", "category", "brand"],
    columnConfig: {
      name: {
        parse: (doc: any) => ({ text: doc.name, text_link: `/product/${doc._id}`, type: "url" }),
      },
    },
  },
  address: {
    schema: AddressSchema,
    columns: [],
  },
  userinfo: {
    schema: UserInfoSchema,
    columns: [],
  },
};
