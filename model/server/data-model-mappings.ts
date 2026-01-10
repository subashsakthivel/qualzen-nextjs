import { z } from "zod";
import { CategoryModel } from "../Category";
import mongoose from "mongoose";
import { UserInfoModel } from "../UserInfo";
import { CategorySchema } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { ProductSchema } from "@/schema/Product";
import { ProductModel } from "../Product";
import { ProductVariantModel } from "../ProductVarient";
import { AddressModel } from "../Address";
import { AddressSchema } from "@/schema/Address";
import { tDataModels } from "@/util/util-type";
import { ContentSchema } from "@/schema/Content";
import { ContentModel } from "../Content";
import { OrderSchema } from "@/schema/Order";
import { OrderModel } from "../Order";
import { ProductGroupSchema } from "@/schema/ProductGroup";
import { ProductGroupModel } from "../ProductGroup";
import { FileStoreSchema } from "@/schema/FileStore";
import { FileStoreModel } from "../FileStore";
import { OfferSchema } from "@/schema/Offer";
import { OfferModel } from "../Offer";
export interface DataModelInterface {
  schema: z.ZodObject<any>;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  subdocs?: [{ path: string; dbModel: mongoose.PaginateModel<any> | mongoose.Model<any> }];
  fileObjects?: { path: string; multi: boolean }[];
}

export const DataModelMap: Record<tDataModels, DataModelInterface> = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
  },
  userinfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
  },
  product: {
    schema: ProductSchema,
    dbModel: ProductModel,
  },
  address: {
    schema: AddressSchema,
    dbModel: AddressModel,
    subdocs: [
      {
        path: "variants",
        dbModel: ProductVariantModel,
      },
    ],
  },
  content: {
    schema: ContentSchema,
    dbModel: ContentModel,
  },
  order: {
    schema: OrderSchema,
    dbModel: OrderModel,
  },
  productgroup: {
    schema: ProductGroupSchema,
    dbModel: ProductGroupModel,
  },
  filestore: {
    schema: FileStoreSchema,
    dbModel: FileStoreModel,
  },
  offer: {
    schema: OfferSchema,
    dbModel: OfferModel,
  },
};
