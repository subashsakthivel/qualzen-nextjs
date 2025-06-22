import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose, { PaginateOptions } from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { CategorySchema, TCategory } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { categorySpecificAttributesSchema } from "@/schema/CategorySpecificAttributes";
import { CategorySpecificAttributesModel } from "./CategorySpecificAttributes";
import { ProductAttributeSchema, ProductSchema } from "@/schema/Product";
import { ProductModel } from "./Product";
import { S3Util } from "@/util/S3Util";
import { ProductVariantModel } from "./ProductVarient";
import { ProductVariantSchema } from "@/schema/ProductVarient";
import { AddressModel } from "./Address";
import { AddressSchema } from "@/schema/Address";
import { OrderSchema } from "@/schema/Order";
import { OrderModel } from "./Order";
export interface DataModelInterface {
  schema: z.ZodObject<any>;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  collections?: {
    [key: string]: {
      model: mongoose.PaginateModel<any> | mongoose.Model<any>;
      schema: z.ZodObject<any>;
    };
  };
  getTableData?: (queryFilter: Record<string, any>, options: PaginateOptions) => Promise<any>;
  getData?: (queryFilter: Record<string, any>, options: PaginateOptions) => Promise<any>;
  postData?: (data: any) => Promise<any>;
  updateData?: (id: string, data: any) => Promise<any>;
  authorized?: () => boolean;
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    collections: {
      attributes: {
        model: CategorySpecificAttributesModel,
        schema: categorySpecificAttributesSchema,
      },
      parentCategory: {
        model: CategoryModel,
        schema: CategorySchema,
      },
      category: {
        model: CategoryModel,
        schema: CategorySchema,
      },
    },
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
    updateData: async (id: string, data: TCategory) => {
      const attributes = await Promise.all(
        data.attributes.map(async (attribute) => {
          if (typeof attribute === "string") {
            // if it is an id no need to update
            return attribute;
          }
          return CategorySpecificAttributesModel.findOneAndUpdate(
            { attributeName: attribute.attributeName },
            { attribute },
            { upsert: true, new: true, runValidators: true }
          );
        })
      );

      const category = await CategoryModel.findByIdAndUpdate(
        id,
        {
          ...data,
          attributes,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return category;
    },
    authorized: () => true,
  },
  userInfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
    authorized: () => true,
    updateData: async (id: string, data: any) => {
      const { data: safeData, success, error } = UserInfoSchema.partial().safeParse(data);
      if (error || !success) {
        console.error("User data validation failed:", error);
        throw new Error("Please check the input data format and try again.");
      }
      return await UserInfoModel.findByIdAndUpdate(id, safeData, {
        new: true,
        runValidators: true,
      });
    },
  },
  product: {
    schema: ProductSchema,
    dbModel: ProductModel,
    url: "/api/dataAPI/product",
    getData: async (queryFilter: Record<string, any>, options: PaginateOptions) => {
      return await ProductModel.paginate(queryFilter, {
        ...options,
      }).then(async (result) => {
        console.log("result", JSON.stringify(result));
        const resultData = JSON.parse(JSON.stringify(result));
        const docs = await Promise.all(
          resultData.docs.map(async (doc: any) => {
            const imageSrc = await Promise.all(
              doc.imageNames.map((imageName: string) => {
                return S3Util.getInstance().getObjectUrl(imageName);
              })
            );
            const variants = await Promise.all(
              doc.variants.map(async (variant: any) => {
                const imageSrc = await Promise.all(
                  variant.imageNames.map((imageName: string) => {
                    return S3Util.getInstance().getObjectUrl(imageName);
                  })
                );
                return {
                  ...variant,
                  imageSrc,
                };
              })
            );
            return {
              ...doc,
              variants,
              imageSrc,
            };
          })
        );
        console.log(
          "docs",
          JSON.stringify({
            ...resultData,
            docs,
          })
        );
        return {
          ...resultData,
          docs,
        };
      });
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
        // Upload main product images
        const uploadResults = await Promise.allSettled(
          productData.imageNames.map(async (imageName) => {
            const imageFile = data.get(imageName) as File;
            if (!imageFile) throw new Error(`Image file not found for ${imageName}`);
            const type = imageFile.name.split(".").pop() || "";
            // TODO: Validate type and size
            return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
          })
        );
        productData.imageNames = uploadResults
          .filter(
            (result): result is PromiseFulfilledResult<string> => result.status === "fulfilled"
          )
          .map((result) => result.value);
        const failedUploads = uploadResults
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason.message);
        console.log("Failed uploads:", failedUploads);
        // Upload variant images and create variants
        const variants = await ProductVariantModel.insertMany(
          await Promise.all(
            productData.variants
              .filter((variant) => typeof variant !== "string")
              .map(async (variant) => {
                const uploadResults = await Promise.allSettled(
                  variant.imageNames.map(async (imageName) => {
                    const imageFile = data.get(imageName) as File;
                    if (!imageFile)
                      throw new Error(`Variant image file not found for ${imageName}`);
                    const type = imageFile.name.split(".").pop() || "";
                    // TODO: Validate type and size

                    return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
                  })
                );
                variant.imageNames = uploadResults
                  .filter(
                    (result): result is PromiseFulfilledResult<string> =>
                      result.status === "fulfilled"
                  )
                  .map((result) => result.value);
                const failedUploads = uploadResults
                  .filter((result): result is PromiseRejectedResult => result.status === "rejected")
                  .map((result) => result.reason.message);
                console.log("Failed uploads:", failedUploads);
                return variant;
              })
          )
        );
        console.log("Variants created");
        productData.variants = variants;
        return await ProductModel.create(productData);
      }
    },
    updateData: async (id: string, data: FormData) => {
      const { attributes, variants, ...directProductData } = JSON.parse(data.get("data") as string);
      const { data: productData } = ProductSchema.partial().safeParse(directProductData);
      if (!productData) {
        console.error("Product data validation failed");
        throw new Error("Please check the input data format and try again.");
      }
      if (attributes) {
        const safeAttributes = attributes.map((attribute: any) => {
          const { data: safeAttribute } = ProductAttributeSchema.partial().safeParse(attribute);
          if (!safeAttribute) {
            console.error("Attribute validation failed:", attribute);
            throw new Error("Please check the attribute data format and try again.");
          }
          return safeAttribute;
        });
        productData.attributes = safeAttributes;
      }
      if (variants) {
        const safeVariants = variants.map((variant: any) => {
          const { data: safeVariant } = ProductVariantSchema.partial().safeParse(variant);
          if (!safeVariant) {
            console.error("Variant validation failed:", variant);
            throw new Error("Please check the variant data format and try again.");
          }
          return safeVariant;
        });
        productData.variants = safeVariants;
      }

      const deletedImages = data.getAll("deletedImages") as string[];
      const deletedVariants = data.getAll("deletedVariants") as string[];
      if (deletedImages && deletedImages.length > 0) {
        await Promise.all(
          deletedImages.map((imageName) => {
            try {
              S3Util.getInstance().deleteFile(imageName);
            } catch (error) {
              console.error(`Failed to delete image ${imageName}:`, error);
            }
          })
        );
      }
      if (deletedVariants && deletedVariants.length > 0) {
        await Promise.all(
          deletedVariants.map((variantId) => {
            return ProductVariantModel.findByIdAndDelete(variantId);
          })
        );
      }
      if (!productData) return;

      if (productData.imageNames) {
        productData.imageNames = await uploadImages(productData.imageNames, data);
      }
      if (productData.variants) {
        productData.variants = await Promise.all(
          productData.variants.map(async (variant: any) => {
            if (variant.imageNames) {
              variant.imageNames = await uploadImages(variant.imageNames, data);
            }
            if (variant._id) {
              return ProductVariantModel.findByIdAndUpdate(variant._id, variant, {
                new: true,
                runValidators: true,
              });
            } else {
              return ProductVariantModel.create(variant);
            }
          })
        );
      }
      return await ProductModel.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true,
      });
    },
  },
  address: {
    schema: AddressSchema,
    dbModel: AddressModel,
    url: "/api/dataAPI/address",
  },
  order: {
    schema: OrderSchema,
    dbModel: OrderModel,
    url: "/api/dataAPI/order",
  },
};

async function uploadImages(imageNames: string[], data: FormData): Promise<string[]> {
  const uploadResults = await Promise.allSettled(
    imageNames.map(async (imageName) => {
      const imageFile = data.get(imageName) as File;
      if (!imageFile) {
        console.error(`Image file not found for ${imageName}`);
        return imageName;
      }
      const type = imageFile.name.split(".").pop() || "";

      return S3Util.getInstance().uploadFile(imageFile, "public-read", type);
    })
  );
  const uploadedImages = uploadResults
    .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
    .map((result) => result.value);
  const failedUploads = uploadResults
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => result.reason.message);
  console.log("Failed uploads:", failedUploads);
  return uploadedImages;
}
