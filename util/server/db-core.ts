import {
  FilterQuery,
  modelNames,
  PaginateModel,
  PaginateResult,
  RootQuerySelector,
  UpdateQuery,
} from "mongoose";
import {
  FetchDataOptions,
  GetDataParams,
  TCriteria,
  tFileUploadsTask,
  TFilter,
  TUpdate,
  zUpdateQuerySchema,
} from "../util-type";
import { DataModelMap, TDataModels } from "@/model/server/data-model-mappings";
import dbConnect from "@/lib/mongoose";
import ObjectUtil from "../ObjectUtil";
import R2Util from "../S3Util";
import { TProduct } from "@/schema/Product";

type tExecution<T, V> = {
  userId: string;
  callback: () => Promise<T>;
  onSuccess?: (response: T) => T | V | Promise<void>;
  onFailure?: () => void | Promise<void>;
};
export class DBUtil {
  modelName: TDataModels;

  constructor(modelName: TDataModels) {
    this.modelName = modelName;
  }

  async getData<T>({
    modelName,
    operation = "GET_DATA",
    options: {
      filter,
      limit = 100,
      sort = { ["timestamp"]: -1 },
      fields = "",
      page = 1,
      ...otherOptions
    },
  }: GetDataParams<T>): Promise<PaginateResult<T> | T[]> {
    await dbConnect();
    if (sort) {
      for (const key in sort) {
        sort[key] = sort[key] === "asc" ? "asc" : "desc";
      }
    }
    const options = {
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
      const { dbModel, getData, getPaginationData } = DataModelMap[modelName];
      const queryFilter = this.parseFilterQuery(filter!);
      if (operation === "GET_DATA_V2.1" && getPaginationData) {
        return await getPaginationData(queryFilter, options);
      } else if (operation === "GET_DATA_V2.0" && getData) {
        return await getData(queryFilter, options);
      } else if (operation === "GET_DATA_V1.1") {
        const data = await dbModel.find(queryFilter, undefined, { lean: true, ...options });
        return data as T[];
      } else if (operation === "GET_DATA") {
        const data = await (dbModel as PaginateModel<T>).paginate(queryFilter, {
          ...options,
          leanWithId: true,
        });
        return data;
      } else {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      throw new Error("Data fetching failed");
    }
  }

  async postData<T>({
    modelName,
    operation = "POST_DATA",
    data,
  }: {
    modelName: TDataModels;
    operation?: string;
    data: T | FormData;
  }): Promise<T | undefined> {
    const { dbModel, schema, authorized, postData } = DataModelMap[modelName];
    const inputData = data instanceof FormData ? data.get("data") : data;
    const { data: safeData, error, success } = schema.safeParse(inputData);
    if (!success) {
      console.error("Invalid data:", error);
      throw new Error("Invalid data");
    }
    if (authorized && !authorized()) {
      throw new Error("Unauthorized operation");
    }
    const execution: tExecution<T, T> = {
      userId: "",
      callback: async () => {
        const newData = new dbModel(safeData);
        const savedData = await newData.save();
        return savedData.toObject();
      },
      onSuccess: (response) => response,
    };
    try {
      if (operation === "POST_DATA_V2" && postData) {
        execution.callback = async () => await postData(safeData);
      } else if (operation === "POST_DATA_V1.1" && data instanceof FormData) {
        const fileOperation = JSON.parse(data.get("fileOperation") as string) as tFileUploadsTask;
        this.fileuploads(inputData, data, fileOperation);
        execution.onFailure = () => this.fileDeletes(inputData, fileOperation);
      } else if (operation === "POST_DATA") {
      } else {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return this.execute(execution);
    } catch (err) {
      throw new Error("Data saving failed");
    }
  }

  async updateData<T>({
    modelName,
    operation = "UPDATE_DATA",
    id,
    filter,
    data,
  }: {
    modelName: TDataModels;
    operation?: string;
    id?: string;
    filter?: TFilter<T>;
    data: TUpdate<T> | Partial<T> | Partial<T>[];
  }): Promise<any> {
    const { dbModel, schema, authorized, updateData } = DataModelMap[modelName];

    if (authorized && !authorized()) {
      throw new Error("Unauthorized operation");
    }

    const validateData = (data: TUpdate<T> | Partial<T>) => {
      const {
        data: safeData,
        error,
        success,
      } = Array.isArray(data) ? zUpdateQuerySchema.safeParse(data) : schema.safeParse(data);
      if (!success) {
        console.error("Invalid data:", error);
        throw new Error("Invalid data");
      }
      return safeData;
    };

    try {
      switch (operation) {
        case "UPDATE_DATA_V2":
          if (id && updateData) {
            const safeData = validateData(data as TUpdate<T>);
            return (await updateData(id, safeData)) as T;
          }
          break;
        case "UPDATE_DATA_V1.2":
          if (id) {
            const safeData = validateData(data as TUpdate<T>);
            return await dbModel.findByIdAndUpdate(id, safeData);
          }
          break;
        case "UPDATE_DATA_V1.1":
          if (filter) {
            const updateQuery = this.parseUpdateQuery(data as TUpdate<T>);
            const queryFilter = this.parseFilterQuery(filter);
            return await dbModel.updateMany(queryFilter, updateQuery, {
              multi: true,
              upsert: true,
            });
          }
          break;
        case "UPDATE_DATA":
          if (filter) {
            const updateQuery = this.parseUpdateQuery(data as TUpdate<T>);
            const queryFilter = this.parseFilterQuery(filter);
            return await dbModel.updateMany(queryFilter, updateQuery, {
              multi: true,
              upsert: false,
            });
          }
          break;
        case "REPLACE_DATA":
          const modifiedData = Array.isArray(data)
            ? data.map((d) => validateData(d as Partial<T>))
            : validateData(data);
          return Array.isArray(data)
            ? data.map(async (d) => await dbModel.replaceOne({ _id: (d as any)._id }, d))
            : await dbModel.replaceOne({ _id: (modifiedData as any)._id }, modifiedData);
          break;
        default:
          throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      throw new Error(`Invalid parameters for operation ${operation}`);
    } catch (err) {
      throw new Error("Data updating failed");
    }
  }

  async deleteData<T>({
    modelName,
    operation = "DELETE_DATA",
    id,
    filter,
  }: {
    modelName: TDataModels;
    operation?: string;
    id?: string;
    filter?: TFilter<T>;
  }): Promise<any> {
    const { dbModel, schema, authorized, deleteData } = DataModelMap[modelName];
    if (authorized && !authorized()) {
      throw new Error("Unauthorized operation");
    }
    try {
      switch (operation) {
        case "DELETE_DATA_V2":
          if (id && deleteData) {
            return await deleteData(id);
          }
          break;
        case "DELETE_DATA_V1.1":
          if (id) {
            return await dbModel.findByIdAndDelete(id).lean();
          }
          break;
        case "DELETE_DATA":
          if (filter) {
            const queryFilter = this.parseFilterQuery(filter);
            return await dbModel.deleteMany(queryFilter).lean();
          }
          break;
        default:
          throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      throw new Error(`Invalid parameters for operation ${operation}`);
    } catch (err) {
      throw new Error("Data deletion failed");
    }
  }

  protected parseFilterQuery<T>(filter: TFilter<T>): FilterQuery<T> {
    if ("logic" in filter) {
      const logicalOperator = filter.logic === "and" ? "$and" : "$or";
      const subFilters = filter.criteria.map(this.parseFilterQuery);
      return { [logicalOperator]: subFilters } as RootQuerySelector<T>;
    }

    const { field, operator, value } = filter as TCriteria<T>;
    const filterQuery = {} as any;
    switch (operator) {
      case "equals":
        filterQuery[field] = value;
        break;
      case "notEquals":
        filterQuery[field] = { $ne: value };
        break;
      case "contains":
        filterQuery[field] = { $regex: value, $options: "i" };
        break;
      case "in":
        filterQuery[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case "notIn":
        filterQuery[field] = { $nin: Array.isArray(value) ? value : [value] };
        break;
      case "gt":
        filterQuery[field] = { $gt: value };
        break;
      case "gte":
        filterQuery[field] = { $gte: value };
        break;
      case "lt":
        filterQuery[field] = { $lt: value };
        break;
      case "lte":
        filterQuery[field] = { $lte: value };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
    return filterQuery as FilterQuery<T>[keyof T];
  }

  protected parseUpdateQuery<T>(updates: TUpdate<T>): UpdateQuery<T> {
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

  protected parseInputdata<T>(modelName: TDataModels, data: any): T {
    const { schema } = DataModelMap[modelName];
    const { data: safeData, error, success } = schema.parse(data);
    if (!success) {
      console.error("Invalid data:", error);
      throw new Error("Invalid data");
    }
    return safeData;
  }

  async fileuploads(data: any, form: FormData, fileuploadsTask: tFileUploadsTask) {
    for (const task of fileuploadsTask) {
      if (task.multi) {
        const fileName = ObjectUtil.getValue({ obj: data, path: task.path }) as string;
        const file = form.get(fileName) as File;
        if (file) {
          const uploadedFileName = await R2Util.uploadFile(file);
          ObjectUtil.updateValue({ obj: data, path: task.path, value: uploadedFileName });
        }
      } else {
        const fileNames = ObjectUtil.getValue({ obj: data, path: task.path }) as string[];
        if (Array.isArray(fileNames) && fileNames.length > 0) {
          const files = fileNames
            .map((fileName) => form.get(fileName) as File)
            .filter(Boolean) as File[];
          if (files.length > 0) {
            const uploadedFileNames = await R2Util.uploadFiles(files);
            ObjectUtil.updateValue({ obj: data, path: task.path, value: uploadedFileNames });
          }
        }
      }
    }
  }

  async fileDeletes(data: any, fileuploadsTask: tFileUploadsTask) {
    for (const task of fileuploadsTask) {
      if (task.multi) {
        const fileName = ObjectUtil.getValue({ obj: data, path: task.path }) as string;
        await R2Util.deleteFile(fileName);
      } else {
        const fileNames = ObjectUtil.getValue({ obj: data, path: task.path }) as string[];
        if (Array.isArray(fileNames) && fileNames.length > 0) {
          await R2Util.deleteFiles(fileNames);
        }
      }
    }
  }

  async execute<T, V>({
    userId,
    callback,
    onSuccess,
    onFailure,
  }: tExecution<T, V>): Promise<T | undefined> {
    try {
      const response = await callback();
      if (onSuccess) await onSuccess(response);
      return response;
    } catch (err) {
      console.error(userId, "Execution error:", err);
      if (onFailure) await onFailure();
    }
  }
}
