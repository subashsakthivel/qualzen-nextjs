import { z } from "zod";
import { ProductSchema, TProduct } from "@/schema/Product";
import { CategorySchema, TCategory } from "@/schema/Category";
import { AddressSchema, TAddress } from "@/schema/Address";
import { TUserInfo, UserInfoSchema } from "@/schema/UserInfo";
import { ContentSchema, TContent } from "@/schema/Content";
import { OrderSchema, TOrder } from "@/schema/Order";
import { FileStoreSchema, TFileStore } from "@/schema/FileStore";
import { ProductGroupSchema, TProductGroup } from "@/schema/ProductGroup";
// all of this shoul be in server side
export interface IModelConfig<T, K extends keyof T = keyof T> {
  schema: z.ZodType;
  columns: K[];
  columnConfig?: Partial<{ [K in keyof T]: { parse?: (value: any) => any } }>;
}

export const zModels = z.enum([
  "product",
  "category",
  "address",
  "order",
  "content",
  "filestore",
  "userinfo",
  "productgroup",
]);

export type tModels = z.infer<typeof zModels>;

export type ModelType = {
  category: TCategory;
  product: TProduct;
  address: TAddress;
  userinfo: TUserInfo;
  content: TContent;
  order: TOrder;
  productgroup: TProductGroup;
  filestore: TFileStore;
};

export const zModelschemas: Record<keyof ModelType, z.ZodType<any>> = {
  product: ProductSchema,
  category: CategorySchema,
  address: AddressSchema,
  order: OrderSchema,
  content: ContentSchema,
  filestore: FileStoreSchema,
  userinfo: UserInfoSchema,
  productgroup: ProductGroupSchema,
};

export const ModelConfig: {
  [K in keyof ModelType]: IModelConfig<ModelType[K]>;
} = {
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
  content: {
    schema: ContentSchema,
    columns: [],
  },
  order: {
    schema: ContentSchema,
    columns: [],
  },
  filestore: {
    schema: FileStoreSchema,
    columns: [],
  },
  productgroup: {
    schema: ProductGroupSchema,
    columns: [],
  },
};
