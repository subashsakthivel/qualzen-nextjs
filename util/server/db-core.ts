import { FilterQuery, PaginateModel, RootQuerySelector, UpdateQuery } from "mongoose";
import {
  TCriteria,
  tDataModels,
  tDeleteResponse,
  TFilter,
  tGetDataParams,
  tGetResponse,
  TUpdate,
  zUpdateueryAndFilter,
} from "../util-type";
import { DataModelMap } from "@/model/server/data-model-mappings";
import dbConnect from "@/lib/mongoose";
import ObjectUtil from "../ObjectUtil";
import mongoose from "mongoose";
import ModelHandler from "./model/model-util";
import { ModelType } from "@/data/model-config";
import { exitCode } from "process";

type UpdateResult = {
  acknowledged?: boolean;
  matchedCount?: number;
  modifiedCount?: number;
  upsertedId?: number; // Only present if 'upsert: true' was used and an insertion occurred
};

type tExecution<T, V> = {
  callback: (session?: mongoose.ClientSession) => Promise<T>;
  onSuccess?: (response: T) => T | V | Promise<void>;
  onFailure?: () => void | Promise<void>;
};
type tUpdateExecution<T, V> = Omit<tExecution<T, V>, "callback"> & {
  callback: (session?: mongoose.ClientSession) => Promise<UpdateResult | T>;
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
    await dbConnect(); // todo : need check
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
      const queryFilter = this.parseFilterQuery(filter);

      const execution: tExecution<tGetResponse<T>, tGetResponse<T>> = {
        callback: async () => await (dbModel as PaginateModel<T>).paginate(queryFilter, options),
      };
      if (operation === "GET_DATA_MANY") {
        execution.callback = async () => await dbModel.find(queryFilter, options.select, options);
      } else if (operation === "GET_DATA_ONE") {
        execution.callback = async () =>
          await dbModel.findOne(queryFilter, options.select, options);
      } else if (operation === "GET_DATA_BY_ID") {
        execution.callback = async () => await dbModel.findById(id, options.select, options);
      } else if (operation !== "GET_DATA") {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return await this.execute({ modelName, operation: "GET", execution });
    } catch (err) {
      console.error("Error fetching data:", err);
      throw new Error("Data fetching failed");
    }
  }

  async saveData<T>({
    modelName,
    operation = "SAVE_DATA",
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
      console.error("Invalid data:", error, inputData);
      throw error;
    }

    const execution: tExecution<T, T> = {
      callback: async (session) => {
        const savedData = await this.persistData<T>({ modelName, data: safeData, session });
        return savedData;
      },
    };

    try {
      if (operation !== "SAVE_DATA") {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return this.execute({
        modelName,
        formData: data instanceof FormData ? data : undefined,
        operation: "CREATE",
        execution,
      });
    } catch (err) {
      console.error("Error saving data:", err);
      if (execution.onFailure) await execution.onFailure();
      throw new Error("Data saving failed");
    }
  }

  async updateData<T>({
    modelName,
    operation = "UPDATE_DATA",
    id,
    updateQuery,
    queryFilter,
    data,
  }: {
    modelName: tDataModels;
    operation?: string;
    id?: string;
    updateQuery?: TFilter<T>;
    queryFilter?: TFilter<T>;
    data: FormData | T;
  }): Promise<T | undefined> {
    const { dbModel } = DataModelMap[modelName];
    const {
      data: updateQueryAndFilter,
      error,
      success,
    } = zUpdateueryAndFilter.safeParse({ updateQuery, queryFilter });
    if (!success) {
      console.error("Invalid data:", error);
      throw new Error("Invalid data");
    }

    try {
      const query = this.parseUpdateQuery(updateQueryAndFilter.updateQuery as TUpdate<T>);
      const queryFilter = this.parseFilterQuery(updateQueryAndFilter.queryFilter as TFilter<T>);
      const execution: tUpdateExecution<T, T> = {
        callback: async () => {
          return (await dbModel.updateOne(queryFilter, query)) as UpdateResult | T;
        },
      };
      switch (operation) {
        case "UPDATE_DATA":
          execution.callback = async () =>
            (await dbModel.findOneAndUpdate({ _id: id }, query, {
              runValidators: true,
            })) as Promise<UpdateResult | T>;
          break;
        case "UPDATE_DATA_MANY":
          execution.callback = async () =>
            (await dbModel.updateMany(queryFilter, query, {
              multi: true,
              upsert: true,
              runValidators: true,
            })) as UpdateResult | T;
          break;
        default:
          throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return this.execute({
        modelName,
        operation: "UPDATE",
        formData: data instanceof FormData ? data : undefined,
        execution,
      });
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
          break;
        default:
          throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return await this.execute({ modelName, operation: "DELETE", execution });
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

    for (const update in Object.keys(updates)) {
      const ope = `$${update}` as keyof UpdateQuery<T>;
      updateQuery[ope] = updates[update as keyof TUpdate<T>];
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

  async execute<T, V>({
    modelName,
    formData,
    operation,
    execution: { callback, onSuccess, onFailure },
  }: {
    modelName: keyof ModelType;
    formData?: FormData;
    operation: "GET" | "DELETE" | "CREATE" | "UPDATE";
    execution: tExecution<T, V> | tUpdateExecution<T, V>;
  }): Promise<T | undefined> {
    const session = await mongoose.startSession();
    try {
      const result = await session.withTransaction(async () => {
        const response = (await callback(session)) as any;
        const processedRes = await ModelHandler.handle(modelName, response, operation, formData);
        if (onSuccess) return await onSuccess(processedRes as any);
        return processedRes;
      });
      return result as any;
    } catch (err) {
      console.error("Execution error:", err);
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
              ObjectUtil.setValue({
                obj: data,
                path,
                value: [...stringValues, ...savedSubdocs],
              });
            } else if (typeof value !== "string") {
              const subdocInstance = new dbModel(value);
              const savedSubdoc = await subdocInstance.save({ session });
              ObjectUtil.setValue({ obj: data, path, value: savedSubdoc });
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
