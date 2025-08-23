import {
  CallbackError,
  DeleteResult,
  FilterQuery,
  FlattenMaps,
  Model,
  PaginateDocument,
  PaginateModel,
  RootQuerySelector,
  Types,
  UpdateQuery,
} from "mongoose";
import {
  FetchDataOptions,
  TCriteria,
  tDataModels,
  tDeleteResponse,
  tFileUploadsTask,
  TFilter,
  tGetDataParams,
  tGetResponse,
  TUpdate,
  zUpdateQuerySchema,
} from "../util-type";
import { DataModelMap } from "@/model/server/data-model-mappings";
import dbConnect from "@/lib/mongoose";
import ObjectUtil from "../ObjectUtil";
import R2Util from "../S3Util";
import { TProduct } from "@/schema/Product";
import mongoose from "mongoose";

type tExecution<T, V> = {
  userId: string;
  callback: (session?: mongoose.ClientSession) => Promise<T>;
  onSuccess?: (response: T) => T | V | Promise<void>;
  onFailure?: () => void | Promise<void>;
};

class DBUtil {
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
    id,
  }: tGetDataParams<T>): Promise<tGetResponse<T>> {
    await dbConnect();
    if (sort) {
      for (const key in sort) {
        sort[key] = sort[key] === "asc" ? "asc" : "desc";
      }
    }
    const options = {
      limit: Math.min(limit, 100), // Limit to a maximum of 100
      sort,
      page,
      lean: otherOptions.lean || true,
      ...otherOptions,
    };
    // todo : add validation
    // todo : add filter validation
    // todo : add group-by
    // todo : operation invalid error
    try {
      const { dbModel } = DataModelMap[modelName];
      const execution: tExecution<tGetResponse<T>, tGetResponse<T>> = {
        callback: async () => await (dbModel as PaginateModel<T>).paginate(queryFilter, options),
        userId: "",
      };
      const queryFilter = this.parseFilterQuery(filter);
      if (operation === "GET_DATA_MANY") {
        execution.callback = async () => await dbModel.find(queryFilter, undefined, options);
      } else if (operation === "GET_DATA_ONE") {
        execution.callback = async () => await dbModel.findOne(queryFilter, undefined, options);
      } else if (operation === "GET_DATA_BY_ID") {
        execution.callback = async () => await dbModel.findById(id, undefined, options);
      } else if (operation !== "GET_DATA") {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return await this.execute(execution);
    } catch (err) {
      console.error("Error fetching data:", err);
      throw new Error("Data fetching failed");
    }
  }

  async saveData<T>({
    modelName,
    operation = "POST_DATA",
    data,
  }: {
    modelName: tDataModels;
    operation?: string;
    data: T | FormData;
  }): Promise<T | undefined> {
    await dbConnect();
    const { dbModel, schema } = DataModelMap[modelName];
    const inputData = data instanceof FormData ? JSON.parse(data.get("data") as string) : data;
    const { data: safeData, error, success } = schema.safeParse(inputData);
    if (!success) {
      console.error("Invalid data:", error);
      throw new Error("Invalid data");
    }

    const execution: tExecution<T, T> = {
      userId: "",
      callback: async (session) => {
        const savedData = await this.persistData<T>({ modelName, data: safeData, session });
        return savedData;
      },
    };

    try {
      let fileOperation: tFileUploadsTask | undefined;
      if (data instanceof FormData && data.has("fileOperation")) {
        fileOperation = JSON.parse(data.get("fileOperation") as string) as tFileUploadsTask;
        await this.fileuploads(safeData, data, fileOperation);
        const inputDataCopy = JSON.parse(JSON.stringify(safeData)) as T;
        execution.onFailure = async () =>
          fileOperation && Persistance.fileDeletes(inputDataCopy, fileOperation);
      }
      if (operation === "SAVE_EXISTING_DATA") {
        const existingData = await dbModel.findById(safeData._id);
        if (!existingData) {
          throw new Error("Data not found");
        }
        if (fileOperation) {
          execution.onSuccess = async () =>
            await Persistance.fileDeletes(existingData.lean(), fileOperation);
        }
        Object.assign(safeData, existingData);
        execution.callback = async () => await existingData.save({ upsert: false }).lean();
      } else if (operation !== "SAVE_DATA") {
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
    modelName: tDataModels;
    operation?: string;
    id?: string;
    filter?: TFilter<T>;
    data: TUpdate<T> | Partial<T> | Partial<T>[];
  }): Promise<any> {
    const { dbModel, schema } = DataModelMap[modelName];

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
    modelName: tDataModels;
    operation?: string;
    id?: string;
    filter?: TFilter<T>;
  }): Promise<tDeleteResponse<T> | undefined> {
    const { dbModel } = DataModelMap[modelName];
    if (!id && !filter) {
      throw new Error("Either id or filter must be provided for deletion");
    }
    const execution: tExecution<tDeleteResponse<T>, T> = {
      userId: "",
      callback: async () => {
        if (id) {
          return await dbModel.findByIdAndDelete(id).lean();
        }
        const queryFilter = this.parseFilterQuery(filter!);
        return dbModel.deleteOne(queryFilter).lean();
      },
    };
    try {
      switch (operation) {
        case "DELETE_DATA_MANY":
          const queryFilter = this.parseFilterQuery(filter!);
          execution.callback = async () => await dbModel.deleteMany(queryFilter).lean();
          break;
        case "DELETE_DATA":
        default:
          throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return await this.execute(execution);
    } catch (err) {
      throw new Error("Data deletion failed");
    }
  }

  protected parseFilterQuery<T>(filter: TFilter<T> | undefined): FilterQuery<T> {
    if (!filter) {
      return {};
    }
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

  protected parseInputdata<T>(modelName: tDataModels, data: any): T {
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
      if (!task.multi) {
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
      if (!task.multi) {
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
    const session = await mongoose.startSession();
    try {
      const result = await session.withTransaction(async () => {
        const response = await callback(session);
        if (onSuccess) await onSuccess(response);
        return response;
      });
      return result;
    } catch (err) {
      console.error(userId, "Execution error:", err);
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      if (onFailure) await onFailure();
    } finally {
      session.endSession();
    }
  }

  private async persistData<T>({
    modelName,
    data,
    session,
  }: {
    modelName: tDataModels;
    data: any;
    session?: mongoose.ClientSession;
  }): Promise<T> {
    const { dbModel, subdocs } = DataModelMap[modelName];
    try {
      if (subdocs) {
        for (const subdoc of subdocs) {
          const { path, dbModel } = subdoc;
          const value = ObjectUtil.getValue({ obj: data, path });
          if (value) {
            if (Array.isArray(value)) {
              const docsToInsert = value.filter((v) => typeof v !== "string");
              let savedSubdocs = [];
              if (docsToInsert.length > 0) {
                savedSubdocs = await dbModel.insertMany(docsToInsert, { session });
              }
              // Keep original string values (if any) and merge with inserted docs
              const stringValues = value.filter((v) => typeof v === "string");
              ObjectUtil.updateValue({
                obj: data,
                path,
                value: [...stringValues, ...savedSubdocs],
              });
            } else if (typeof value !== "string") {
              const subdocInstance = new dbModel(value);
              const savedSubdoc = await subdocInstance.save({ session });
              ObjectUtil.updateValue({ obj: data, path, value: savedSubdoc });
            }
          }
        }
      }
    } catch (err) {
      console.error("Error persisting subdocuments:", err);
      throw new Error("Failed to persist subdocuments");
    }
    return await new dbModel(data).save({ session });
  }
}

const Persistance = new DBUtil();
export default Persistance;
