import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose, { PaginateOptions } from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { CategorySchema, TCategory } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { categorySpecificAttributesSchema } from "@/schema/CategorySpecificAttributes";
import { CategorySpecificAttributesModel } from "./CategorySpecificAttributes";
export interface DataModelInterface {
  schema: z.ZodType;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  viewColumns: string[];
  getTableData?: (queryFilter: Record<string, any>, options: PaginateOptions) => Promise<any>;
  postData?: (data: any) => Promise<any>;
  authorized: () => boolean;
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    viewColumns: ["name", "parentCategory", "description", "updatedAt"],
    getTableData: async (queryFilter: Record<string, any>, options: PaginateOptions) => {
      const data = await CategoryModel.paginate(queryFilter, {
        ...options,
        populate: { path: "parentCategory" },
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
    viewColumns: ["name", "email", "role", "createdAt", "updatedAt"],
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
    authorized: () => true,
  },
};
