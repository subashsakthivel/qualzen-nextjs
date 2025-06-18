import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose, { PaginateOptions } from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { CategorySchema, TCategory } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { categorySpecificAttributesSchema } from "@/schema/CategorySpecificAttributes";
import { CategorySpecificAttributesModel } from "./CategorySpecificAttributes";
import { ProductSchema, TProduct } from "@/schema/Product";
import { ProductModel } from "./Product";
import { S3Util } from "@/util/S3Util";
export interface DataModelInterface {
  schema: z.ZodType;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  getTableData?: (queryFilter: Record<string, any>, options: PaginateOptions) => Promise<any>;
  getData?: (queryFilter: Record<string, any>, options: PaginateOptions) => Promise<any>;
  postData?: (data: any) => Promise<any>;
  authorized?: () => boolean;
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    getData: async (queryFilter: Record<string, any>, options: PaginateOptions) => {
      const data = await CategoryModel.paginate(queryFilter, {
        ...options,
        populate: [{ path: "parentCategory" }, { path: "attributes" }],
      }).then((result) => {
        console.log("result", JSON.stringify(result));
        const resultData = JSON.parse(JSON.stringify(result));
        return {
          ...resultData,
          docs: resultData.docs.map((doc: any, index: number) => {
            return {
              ...doc,
              _id: undefined,
              parentCategory: doc.parentCategory ? doc.parentCategory.name : "None",
            };
          }),
        };
      });
      console.log("data", JSON.stringify(data));
      return data;
    },
    postData: async (data: TCategory) => {
      const categorySpecificAttributes = await CategorySpecificAttributesModel.insertMany(
        data.attributes
      );
      const category = await CategoryModel.insertOne({
        ...data,
        attributes: categorySpecificAttributes,
      });
      return category;
    },
    authorized: () => true,
  },
  userInfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
    authorized: () => true,
  },
  product: {
    schema: ProductSchema,
    dbModel: ProductModel,
    url: "/api/dataAPI/product",
    getData: async (queryFilter: Record<string, any>, options: PaginateOptions) => {
      const data = await ProductModel.paginate(queryFilter, {
        ...options,
      }).then((result) => {
        console.log("result", JSON.stringify(result));
        const resultData = JSON.parse(JSON.stringify(result));
        const docs = result.docs.map(async (doc) => {
          const imageSrc = await Promise.all(
            doc.imageNames.map((imageName) => {
              return S3Util.getInstance().getObjectUrl(imageName);
            })
          );
          const variants = doc.variants.map(async (variant) => {
            const imageSrc = await Promise.all(
              variant.imageNames.map((imageName) => {
                return S3Util.getInstance().getObjectUrl(imageName);
              })
            );
            return {
              ...variant,
              imageSrc,
            };
          });
          return {
            ...doc,
            variants,
            imageSrc,
          };
        });
        return {
          ...resultData,
          docs,
        };
      });
      console.log("data", JSON.stringify(data));
      return data;
    },
    postData: async (data: FormData) => {
      const {
        data: productData,
        success,
        error,
      } = ProductSchema.safeParse(JSON.parse(data.get("data") as string));
      if (error || !success) {
        console.log(error);
        return;
      }
      if (productData) {
        console.log("GOing to upload all images");
        productData.imageNames = await Promise.all(
          productData.imageNames.map((imageName) => {
            const imageFile = data.get(imageName) as File;
            const type = imageFile.name.substring(imageFile.name.lastIndexOf(".") + 1);
            //todo: type should be some format and size need to check
            return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
          })
        );
        productData.variants.map(async (variant) => {
          variant.imageNames = await Promise.all(
            variant.imageNames.map((imageName) => {
              const imageFile = data.get(imageName) as File;
              const type = imageFile.name.substring(imageFile.name.lastIndexOf(".") + 1);
              //todo: type should be some format and size need to check
              return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
            })
          );
        });
        console.log("GOing to store it in DB");
        return ProductModel.create(productData);
      }
    },
  },
};
