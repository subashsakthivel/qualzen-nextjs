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
import { ContentModel } from "../Content";
import { cache } from "react";
import { tDataModels } from "@/util/util-type";
export interface DataModelInterface {
  schema: z.ZodObject<any>;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  cacheKey: string;
  subdocs?: [{ path: string; dbModel: mongoose.PaginateModel<any> | mongoose.Model<any> }];
}

export const DataModelMap: Record<tDataModels, DataModelInterface> = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    cacheKey: "category",
    subdocs: [
      {
        path: "attributes",
        dbModel: CategorySpecificAttributesModel,
      },
    ],
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
