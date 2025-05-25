import dbConnect from "@/lib/mongoose";
import { DataModelInterface } from "@/model/DataModels";
import { IDataSourceMap } from "@/model/DataSourceMap";
import { PaginateModel, PaginateOptions, PaginateResult } from "mongoose";
import { buildEncodedUrl } from "./requestUtil";
import { S3Util } from "./S3Util";

export interface FetchDataParams extends PaginateOptions {
  filter?: FilterState;
  limit?: number;
  fields?: string;
  sort?: { [key: string]: 1 | -1 | "asc" | "desc" };
}

type LogicalOperator = "AND" | "OR";

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
  { filter, limit = 1000, sort = { ["timestamp"]: -1 }, fields = "", page = 1 }: FetchDataParams
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
    select: fields ? fields : undefined,
    page,
  };
  // todo : add validation
  // todo : add filter validation
  // todo : add group-by
  try {
    const { schema, dbModel } = datamodel;
    // const validationResult = schema.safeParse(filter);
    // if (!validationResult.success) {
    //   throw new Error(`Validation failed: ${validationResult.error}`);
    // }
    const queryFilter = parseFilter(filter!);
    const data = await (dbModel as PaginateModel<any>).paginate(queryFilter, options);
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
      throw error;
    }
    const responseData = await datamodel.dbModel.create(data);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function postFormData<T>(
  datamodel: DataModelInterface,
  formData: FormData
): Promise<T> {
  try {
    await dbConnect();

    const images = formData.getAll("images") as File[];

    const imageUploads = await Promise.all(
      images.map(async (image) => {
        return await S3Util.getInstance().uploadFile(image, "bucket-owner-read", image.type);
      })
    );

    const data = { ...JSON.parse(JSON.stringify(formData.get("data"))), imageNames: imageUploads };
    const { data: safeData, error, success } = datamodel.schema.safeParse(data);
    if (!success) {
      throw error;
    }
    const responseData = await datamodel.dbModel.create(safeData);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getDataFromServer<T>(
  dataSource: IDataSourceMap,
  { filter, limit = 1000, sort = { ["timestamp"]: -1 }, fields = "", page = 1 }: FetchDataParams
): Promise<PaginateResult<T>> {
  const params = {
    page,
    limit,
    sort,
    select: fields ? fields : undefined,
    filter,
  };

  try {
    const { url } = dataSource;
    // const validationResult = schema.safeParse(filter);
    // if (!validationResult.success) {
    //   throw new Error(`Validation failed: ${validationResult.error}`);
    // }
    const encodedUrl = buildEncodedUrl(url, params);

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

export async function postDataToServer<T>(dataSource: IDataSourceMap, data: any): Promise<T> {
  try {
    const { data: safeData, error, success } = dataSource.schema.safeParse(data);
    if (!success) {
      throw error;
    }
    const responseData = await fetch(dataSource.url, {
      method: "POST",
      body: JSON.stringify(safeData),
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
