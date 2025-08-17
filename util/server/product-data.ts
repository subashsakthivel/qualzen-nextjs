import { PaginateResult } from "mongoose";
import { DBUtil, GetDataParams } from "./db-core";
import dbConnect from "@/lib/mongoose";
import { TFilter } from "../util-type";
import { TDataModels } from "@/model/server/data-model-mappings";
import { DataModel } from "@/model/DataModels";
import { ProductSchema } from "@/schema/Product";

export class ProductUtil extends DBUtil {
  async postData<T>({
    modelName,
    operation = "POST_DATA",
    data,
  }: {
    modelName: TDataModels;
    operation?: string;
    data: T | FormData;
  }): Promise<T> {
    return {} as any;
  }
}

class ProductVariant extends DBUtil {}
