import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose from "mongoose";
import { UserInfoModel } from "./UserInfo";
import { CategorySchema } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
export interface DataModelInterface {
  schema: z.ZodType;
  dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
  url: string;
  authorized: () => boolean;
}

export const DataModel: {
  [key: string]: DataModelInterface;
} = {
  category: {
    schema: CategorySchema,
    dbModel: CategoryModel,
    url: "/api/dataAPI/Category",
    authorized: () => true,
  },
  userInfo: {
    schema: UserInfoSchema,
    dbModel: UserInfoModel,
    url: "/api/dataAPI/UserInfo",
    authorized: () => true,
  },
};
