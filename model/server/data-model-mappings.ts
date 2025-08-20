import { z } from "zod";
import { CategoryModel } from "../Category";
import mongoose, { PaginateOptions } from "mongoose";
import { UserInfoModel } from "../UserInfo";
import { CategorySchema, TCategory } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { categorySpecificAttributesSchema } from "@/schema/CategorySpecificAttributes";
import { CategorySpecificAttributesModel } from "../CategorySpecificAttributes";
import { ProductAttributeSchema, ProductSchema } from "@/schema/Product";
import { ProductModel } from "../Product";
import { ProductVariantModel } from "../ProductVarient";
import { ProductVariantSchema } from "@/schema/ProductVarient";
import { AddressModel } from "../Address";
import { AddressSchema } from "@/schema/Address";
import { OrderSchema } from "@/schema/Order";
import { OrderModel } from "../Order";
import { ContentSchema } from "@/schema/Content";
import { ContentModel } from "../Content";
export interface DataModelInterface {
  schema: z.ZodObject<any>;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  cacheKey: string;
}
export type TDataModels =
  | "category"
  | "product"
  | "address"
  | "userinfo"
  | "order"
  | "content"
  | "productVariant";

export const DataModelMap: Record<TDataModels, DataModelInterface> = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    cacheKey: "category",
  },
  userinfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
    cacheKey: "userinfo",
  },
  product: {
    schema: ProductSchema,
    dbModel: ProductModel,
    url: "/api/dataAPI/product",
    cacheKey: "product",
  },
  address: {
    schema: AddressSchema,
    dbModel: AddressModel,
    url: "/api/dataAPI/address",
    cacheKey: "address",
  },
  order: {
    schema: OrderSchema,
    dbModel: OrderModel,
    url: "/api/dataAPI/order",
    cacheKey: "order",
  },
  content: {
    schema: ContentSchema,
    dbModel: ContentModel,
    url: "/api/dataAPI/content",
    cacheKey: "content",
  },
  productVariant: {
    schema: ContentSchema,
    dbModel: ContentModel,
    url: "/api/dataAPI/content",
    cacheKey: "productVariant",
  },
};

// async function uploadImages(images: string[], data: FormData): Promise<string[]> {
//   const uploadResults = await Promise.allSettled(
//     images.map(async (imageName) => {
//       const imageFile = data.get(imageName) as File;
//       if (!imageFile) {
//         console.error(`Image file not found for ${imageName}`);
//         return imageName;
//       }
//       const type = imageFile.name.split(".").pop() || "";

//       return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
//     })
//   );
//   const uploadedImages = uploadResults
//     .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
//     .map((result) => result.value);
//   const failedUploads = uploadResults
//     .filter((result): result is PromiseRejectedResult => result.status === "rejected")
//     .map((result) => result.reason.message);
//   console.error("Failed uploads:", failedUploads);
//   return uploadedImages;
// }
