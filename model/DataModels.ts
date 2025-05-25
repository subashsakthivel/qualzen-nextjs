import { z } from "zod";
import { CategoryModel } from "./Category";
import mongoose from "mongoose";
import { UserInfoModel, UserInfoSchema } from "./UserInfo";
import { CategorySchema } from "./schema/DataSchema";
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
