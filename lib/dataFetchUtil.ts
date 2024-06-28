import dbConnect from "@/lib/mongoose";
import { Category } from "@/model/Category";
import { CategoryGroup } from "@/model/CategoryGroup";
import { Document } from "mongodb";
import { Model } from "mongoose";

interface MongooseModel {
  [key: string]: any;
}

interface getDbDataProps<T extends MongooseModel> {
  model: Model<T>;
  pageIndex?: number;
  pageLimit?: number;
}

export interface GetStoreResType<T extends MongooseModel> {
  data: T[];
  totalCount: number;
  errorMessage?: string;
}

export const fetchStoreData = async <T extends MongooseModel>({
  model,
  pageIndex,
  pageLimit,
}: getDbDataProps<T>): Promise<GetStoreResType<T>> => {
  "server";
  try {
    await dbConnect();
    if (model === null || model === undefined) {
      throw "Invalid Request , data model not found";
    }
    if (pageIndex && pageLimit) {
      const res: Document = model.aggregate([
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [
              { $skip: (pageIndex - 1) * pageLimit },
              { $limit: pageLimit },
            ],
          },
        },
      ]);
      return { data: res.data, totalCount: res.totalCount };
    }
    const res = await model.find();
    console.log("groups", res);
    if (res == null || res.length == 0) {
      throw "No value Found in Groups";
    }

    return { data: res, totalCount: res.length };
  } catch (e: any) {
    console.log("Error while fetching data from DB : ", e);
    return { data: [], totalCount: 0, errorMessage: e.Message };
  }
};

export function fetchCollectionData(
  collectionName: string,
  pageIndex?: number,
  pageLimit?: number
) {
  switch (collectionName.toLocaleLowerCase()) {
    case "categorygroup":
      return fetchStoreData({ model: CategoryGroup, pageIndex, pageLimit });
    case "category":
      return fetchStoreData({ model: Category, pageIndex, pageLimit });
    default:
      throw "invalid collection name";
  }
}
