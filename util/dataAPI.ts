import dbConnect from "@/lib/mongoose";
import { DataModel, DataModelInterface } from "@/model/DataModels";
import { IDataSourceMap } from "@/model/DataSourceMap";
import { PaginateModel, PaginateOptions, PaginateResult, UpdateQuery } from "mongoose";
import { buildEncodedUrl } from "./requestUtil";
import { S3Util } from "./S3Util";

import { FilterQuery } from "mongoose";

export interface FetchDataParams extends PaginateOptions {
  filter?: FilterState;
  limit?: number;
  fields?: string;
  sort?: { [key: string]: 1 | -1 | "asc" | "desc" };
}

type LogicalOperator = "AND" | "OR";
export type GetOperation = "GET_TABLE_DATA" | "GET_CHART_DATA" | "GET_DATA" | "GET";

type TFilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "in"
  | "notIn"
  | "gt"
  | "gte"
  | "lt"
  | "lte";
type TUpdateOperator =
  | "set"
  | "inc"
  | "unset"
  | "push"
  | "pull"
  | "addToSet"
  | "mul"
  | "min"
  | "max"
  | "rename"
  | "setOnInsert"
  | "currentDate";
type TCondition<T> = {
  field: keyof T;
  operator: TFilterOperator;
  value: T[keyof T];
};

type TUpdate<T> = {
  field: keyof T;
  operator: TUpdateOperator;
  value: any;
}[];

export type TFilter<T> = TCondition<T>[];
export interface FilterRule {
  field: string;
  operator: string;
  value: any;
  logicalOperator?: LogicalOperator;
  rules?: FilterRule[];
}

export interface FilterState {
  logicalOperator: LogicalOperator;
  rules: FilterRule[];
}

export async function getData<T>(
  datamodel: DataModelInterface,
  operation: string = "GET_DATA",
  { filter, limit = 1000, sort = { ["timestamp"]: -1 }, page = 1, ...otherOptions }: FetchDataParams
): Promise<PaginateResult<T>> {
  await dbConnect();
  //transform
  if (sort) {
    for (const key in sort) {
      sort[key] = sort[key] === 1 ? "asc" : "desc";
    }
  }
  const options: PaginateOptions = {
    limit,
    sort,
    page,
    ...otherOptions,
  };
  // todo : add validation
  // todo : add filter validation
  // todo : add group-by
  // todo : operation invalid error
  try {
    const { schema, dbModel } = datamodel;
    // const validationResult = schema.safeParse(filter);
    // if (!validationResult.success) {
    //   throw new Error(`Validation failed: ${validationResult.error}`);
    // }
    const queryFilter = parseFilter(filter!);
    // if (operation === "GET_TABLE_DATA" && datamodel.getTableData) {
    //   return await datamodel.getTableData(queryFilter, options);
    // }
    if (datamodel.getData) {
      return await datamodel.getData(queryFilter, options);
    }

    if (typeof (dbModel as PaginateModel<any>).paginate !== "function") {
      console.log("Using paginate method");
      return {} as PaginateResult<T>;
    }
    const data = await (dbModel as PaginateModel<any>).paginate(queryFilter, {
      ...options,
    });
    // console.log("data", data);
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw new Error("Data fetching failed");
  }
}

export async function postData<T>(datamodel: DataModelInterface, data: any): Promise<T> {
  try {
    await dbConnect();

    const { data: safeData, error, success } = datamodel.schema.safeParse(data);
    if (!success) {
      console.error("Validation failed:", JSON.stringify(data, null, 2));
      console.error("Error details:", error);
      throw new Error("Please check the input data format and try again.");
    }
    if (datamodel.postData) {
      const responseData = await datamodel.postData(safeData);
      return responseData;
    }
    const responseData = await datamodel.dbModel.create(data);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getFilteredData(
  datamodel: DataModelInterface,
  { filter, limit = 1000, sort = { ["timestamp"]: -1 }, page = 1, ...otherOptions }: FetchDataParams
) {
  datamodel.dbModel.find(parseFilter(filter!));
}

export async function postFormData<T>(
  datamodel: DataModelInterface,
  formData: FormData
): Promise<T> {
  try {
    await dbConnect();
    if (datamodel.postData) {
      return await datamodel.postData(formData);
    }
    const data = JSON.parse(formData.get("data") as string);

    if (data.imageNames) {
    }
    const images = formData.getAll("images") as File[];

    const imageUploads = await Promise.all(
      images.map(async (image) => {
        return await S3Util.getInstance().uploadFile(image, "public-read", image.type);
      })
    );

    const { data: safeData, error, success } = datamodel.schema.safeParse(data);
    if (!success) {
      throw error;
    }
    const responseData = await datamodel.dbModel.create(safeData);
    return responseData;
  } catch (error) {
    console.error("Error posting form data:", error);
    throw error;
  }
}

export async function getDataFromServer<T>(
  dataSource: IDataSourceMap,
  operation: string = "GET_DATA",
  {
    filter,
    limit = 1000,
    sort = { ["timestamp"]: -1 },
    fields = "",
    page = 1,
    ...otherOptions
  }: FetchDataParams
): Promise<PaginateResult<T>> {
  const params = {
    page,
    limit,
    sort,
    filter,
    ...otherOptions,
  };

  try {
    const { url } = dataSource;
    // const validationResult = schema.safeParse(filter);
    // if (!validationResult.success) {
    //   throw new Error(`Validation failed: ${validationResult.error}`);
    // }
    const encodedUrl = buildEncodedUrl(url, { operation, request: params });

    const response = await fetch(encodedUrl);

    const resJson = await response.json();

    if (!response.ok) {
      throw new Error(resJson.message || "Request failed");
    }

    console.log("data", resJson);
    return resJson.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw new Error("Data fetching failed");
  }
}

export async function postDataToServer<T>(
  dataSource: IDataSourceMap,
  data: any
): Promise<{ message: string; data: T }> {
  try {
    console.log("postDataFromserver", data);
    const { data: postData } = data;
    const { data: safeData, error, success } = dataSource.schema.safeParse(postData);
    if (!success) {
      console.error("Validation failed:", error);
      throw error;
    }
    console.log(safeData);
    const responseData = await fetch(dataSource.url, {
      method: "POST",
      body: JSON.stringify({ data: safeData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJson = await responseData.json();
    console.log(resJson);
    return resJson;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function parseFilter(filterState: FilterState): Record<string, any> {
  if (!filterState || !filterState.rules || filterState.rules.length === 0) {
    return {};
  }

  const mongoLogical =
    (filterState.logicalOperator || "AND").toUpperCase() === "OR" ? "$or" : "$and";

  const conditions = filterState.rules.map((rule) => {
    if (rule.rules && rule.rules.length > 0) {
      // Nested group
      return parseFilter({
        logicalOperator: rule.logicalOperator || "AND",
        rules: rule.rules,
      });
    }

    // Leaf node
    const { field, operator, value } = rule;

    switch (operator.toLowerCase()) {
      case "contains":
      case "contians": // typo fallback
        return { [field]: { $regex: value, $options: "i" } };

      case "equals":
        return { [field]: value };

      case "not_equals":
        return { [field]: { $ne: value } };

      case "gt":
        return { [field]: { $gt: value } };

      case "gte":
        return { [field]: { $gte: value } };

      case "lt":
        return { [field]: { $lt: value } };

      case "lte":
        return { [field]: { $lte: value } };

      case "in":
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };

      case "starts_with":
        return { [field]: { $regex: `^${value}`, $options: "i" } };

      case "ends_with":
        return { [field]: { $regex: `${value}$`, $options: "i" } };

      default:
        return {};
    }
  });

  return {
    [mongoLogical]: conditions,
  };
}

// export async function updateData<T>(
//   datamodel: DataModelInterface,
//   id: string,
//   data: any
// ): Promise<T> {
//   try {
//     await dbConnect();
//     const schema = datamodel.schema.partial();
//     const { data: safeData, error, success } = schema.safeParse(data);
//     if (!success) {
//       console.error("Validation failed:", JSON.stringify(data, null, 2));
//       console.error("Error details:", error);
//       throw new Error("Please check the input data format and try again.");
//     }
//     if (datamodel.updateData) {
//       return await datamodel.updateData(id, safeData);
//     }
//     console.log("safeData", safeData);
//     const responseData = await datamodel.dbModel.findByIdAndUpdate(id, safeData, {
//       new: true,
//       runValidators: true,
//     });
//     return responseData;
//   } catch (error) {
//     console.error("Error updating data:", error);
//     throw error;
//   }
// }

export async function updateData<T>(
  datamodel: string,
  data: { updateQuery: TUpdate<T> | Partial<T>; version?: number },
  filter?: TFilter<T>,
  id?: string
): Promise<string | T> {
  try {
    await dbConnect();
    const dataModelInstance = DataModel[datamodel];
    const schema = dataModelInstance.schema.partial();
    const { data: safeData, error, success } = schema.safeParse(data);
    if (!success) {
      console.error("Validation failed:", JSON.stringify(data, null, 2));
      console.error("Error details:", error);
      throw new Error("Please check the input data format and try again.");
    }

    console.log("safeData", safeData);
    const version = data.version ?? 0;

    const updateQuery =
      version === 0 ? parseUpdateQuery(data.updateQuery as any as TUpdate<T>) : data.updateQuery;
    if (id) {
      const resData = await dataModelInstance.dbModel.findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
      });
      return resData;
    } else if (filter) {
      const filterQuery = parseFilterCondition<T>(filter);
      const responseData = await dataModelInstance.dbModel.updateMany(filterQuery, updateQuery, {
        new: true, // return the updated document
        runValidators: true,
        upsert: version >= 1.1,
      });
      return responseData.modifiedCount + " docs upadted sucessfully";
    } else {
      throw new Error("No filter and id");
    }
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}
export async function updateFormData<T>(
  datamodel: DataModelInterface,
  id: string,
  data: FormData
): Promise<T> {
  try {
    await dbConnect();
    if (datamodel.updateData) {
      return await datamodel.updateData(id, data);
    }
    const schema = datamodel.schema.partial();
    const {
      data: safeData,
      error,
      success,
    } = schema.safeParse(JSON.parse(data.get("data") as string));
    if (!success) {
      console.error("Validation failed:", JSON.stringify(data, null, 2));
      console.error("Error details:", error);
      throw new Error("Please check the input data format and try again.");
    }
    console.log("safeData", safeData);
    const responseData = await datamodel.dbModel.findByIdAndUpdate(id, safeData, {
      new: true,
      runValidators: true,
    });
    return responseData;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

export async function deleteData<T>(datamodel: DataModelInterface, id: string): Promise<T> {
  try {
    await dbConnect();
    if (datamodel.deleteData) {
      return await datamodel.deleteData(id);
    }
    const responseData = await datamodel.dbModel.findByIdAndDelete(id);
    return responseData;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}

function parseFilterCondition<T>(conditions: TFilter<T>): FilterQuery<T> {
  const filterQuery: FilterQuery<T> = {};
  for (const condition of conditions) {
    const { field, operator, value } = condition;
    const filter = {} as any;

    switch (operator) {
      case "equals":
        filter[field] = value;
        break;
      case "notEquals":
        filter[field] = { $ne: value };
        break;
      case "contains":
        filter[field] = { $regex: value, $options: "i" };
        break;
      case "in":
        filter[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case "notIn":
        filter[field] = { $nin: Array.isArray(value) ? value : [value] };
        break;
      case "gt":
        filter[field] = { $gt: value };
        break;
      case "gte":
        filter[field] = { $gte: value };
        break;
      case "lt":
        filter[field] = { $lt: value };
        break;
      case "lte":
        filter[field] = { $lte: value };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
    filterQuery[field as keyof T] = filter as FilterQuery<T>[keyof T];
  }

  return filterQuery;
}

function parseUpdateQuery<T>(updates: TUpdate<T>): UpdateQuery<T> {
  const updateQuery: UpdateQuery<T> = {};

  for (const { field, operator, value } of updates) {
    const ope = `$${operator}` as keyof UpdateQuery<T>;

    if (!updateQuery[ope]) {
      updateQuery[ope] = {} as any;
    }

    (updateQuery[ope] as any)[field as string] = value;
  }

  return updateQuery;
}
