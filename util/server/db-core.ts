import { FilterQuery, PaginateModel, RootQuerySelector, UpdateQuery } from "mongoose";
import {
  TCompositeFilter,
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
import R2API from "./file/S3Util";

type UpdateResult = {
  acknowledged?: boolean;
  matchedCount?: number;
  modifiedCount?: number;
  upsertedId?: number; // Only present if 'upsert: true' was used and an insertion occurred
};

type tExecution<T, V> = {
  callback: (session?: mongoose.ClientSession) => Promise<T>;
  onSuccess?: (response: T) => T | V | Promise<T>;
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
      const queryFilter = filter?.CompositeFilters ? this.parseFilterQuery(filter) : filter;

      const execution: tExecution<tGetResponse<T>, tGetResponse<T>> = {
        callback: async () => await (dbModel as PaginateModel<T>).paginate(queryFilter, options),
      };
      if (operation === "GET_DATA_MANY") {
        execution.callback = async () =>
          await dbModel.find(queryFilter ?? {}, options.select, options);
      } else if (operation === "GET_DATA_ONE") {
        execution.callback = async () =>
          await dbModel.findOne(queryFilter, options.select, options);
      } else if (operation === "GET_DATA_BY_ID" || operation === "GET_DATA_BY_ID_RAW") {
        execution.callback = async () => await dbModel.findById(id, options.select, options);
      } else if (operation !== "GET_DATA" && operation !== "GET_DATA_RAW") {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return await this.execute({
        modelName,
        operation: operation.endsWith("RAW") ? "GET_RAW" : "GET",
        execution,
      });
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
    updateQuery: TUpdate<T>;
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
      const queryFilter = updateQueryAndFilter.queryFilter?.CompositeFilters
        ? this.parseFilterQuery(updateQueryAndFilter.queryFilter)
        : updateQueryAndFilter.queryFilter;
      const execution: tUpdateExecution<T, T> = {
        callback: async () => (await dbModel.updateOne(queryFilter, query)) as UpdateResult | T,
      };
      switch (operation) {
        case "UPDATE_DATA_BY_ID":
          execution.callback = async () =>
            (await dbModel.findByIdAndUpdate(id, query, {
              runValidators: true,
            })) as Promise<UpdateResult | T>;
          break;
        case "UPDATE_DATA":
          execution.callback = async (session) =>
            (await dbModel.findOneAndUpdate({ _id: id }, query, {
              runValidators: true,
              session,
            })) as Promise<UpdateResult | T>;
          break;
        case "UPDATE_DATA_MANY":
          execution.callback = async (session) =>
            (await dbModel.updateMany(queryFilter, query, {
              multi: true,
              upsert: true,
              runValidators: true,
              session,
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

  async updateOneData<T>({
    modelName,
    operation = "UPDATE_ONE_BY_ID",
    data,
    id,
  }: {
    modelName: tDataModels;
    operation?: string;
    data: T | FormData;
    id: string;
  }): Promise<T | undefined> {
    const { dbModel, schema } = DataModelMap[modelName];
    const inputData = data instanceof FormData ? JSON.parse(data.get("data") as string) : data;
    const { data: safeData, error, success } = schema.partial().safeParse(inputData);
    if (!success) {
      console.error("Invalid data:", error, inputData);
      throw error;
    }

    const oldData = await this.getData({
      modelName,
      operation: "GET_DATA_BY_ID_RAW",
      options: {},
      id,
    }).then((res) => JSON.parse(JSON.stringify(res)));
    const oldFiles = await ModelHandler.getOldFilesFromObject({
      modelName,
      update: safeData,
      id,
      oldData,
    });
    const update = ObjectUtil.diff(oldData, safeData);
    const updateQuery = this.parseUpdateObject(update);
    console.log(updateQuery);
    const execution: tExecution<T, T> = {
      callback: async (session) => {
        const savedData = await dbModel.findByIdAndUpdate(id, updateQuery, { session, new: true });
        return savedData;
      },
      onSuccess: async (response) => {
        //delete old files
        if (oldFiles.length > 0) {
          for (const fileKey of oldFiles) {
            await R2API.deleteFile(fileKey);
          }
        }
        return response;
      },
    };

    try {
      if (operation !== "UPDATE_ONE_BY_ID") {
        throw new Error(`Operation ${operation} is not supported for model ${modelName}`);
      }
      return this.execute({
        modelName,
        formData: data instanceof FormData ? data : undefined,
        operation: "UPDATE",
        execution,
      });
    } catch (err) {
      console.error("Error saving data:", err);
      if (execution.onFailure) await execution.onFailure();
      throw new Error("Data saving failed");
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
    const queryFilter = filter?.CompositeFilters ? this.parseFilterQuery(filter) : filter;
    const execution: tExecution<tDeleteResponse<T>, T> = {
      callback: async () => {
        if (id) {
          return await dbModel.findByIdAndDelete(id).lean();
        }

        return dbModel.deleteOne(queryFilter).lean();
      },
    };
    try {
      switch (operation) {
        case "DELETE_DATA_MANY":
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

  protected parseUpdateQuery<T>(updates: TUpdate<T>): UpdateQuery<T> {
    const updateQuery: UpdateQuery<T> = {};

    for (const update in Object.keys(updates)) {
      const ope = `$${update}` as keyof UpdateQuery<T>;
      updateQuery[ope] = updates[update as keyof TUpdate<T>];
    }

    //$pull
    const pullObj = updateQuery["$pull"];

    if (pullObj) {
      const pullQuery = {} as any;
      for (const key in Object.keys(pullObj)) {
        const val = pullObj[key];
        if (Array.isArray(val)) {
          pullQuery[key] = { $in: val };
        } else {
          pullQuery[key] = val;
        }
      }
      updateQuery["$pull"] = pullQuery;
    }

    //$addToSet and $push with $each
    ["$addToSet", "$push"].forEach((op) => {
      const opObj = updateQuery[op as keyof UpdateQuery<T>];
      if (opObj) {
        const newOpObj = {} as any;
        for (const key in Object.keys(opObj)) {
          const val = opObj[key];
          if (Array.isArray(val)) {
            newOpObj[key] = { $each: val };
          } else {
            newOpObj[key] = val;
          }
        }
        updateQuery[op as keyof UpdateQuery<T>] = newOpObj;
      }
    });

    return updateQuery;
  }

  protected parseUpdateObject<T>(update: T): UpdateQuery<T> {
    const updateQuery: UpdateQuery<T> = {
      $set: {},
    };

    for (const key of Object.keys(update as object)) {
      const value = (update as any)[key];
      (updateQuery["$set"] as any)[key] = value;
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
    operation: "GET" | "GET_RAW" | "DELETE" | "CREATE" | "UPDATE";
    execution: tExecution<T, V> | tUpdateExecution<T, V>;
  }): Promise<T | undefined> {
    await dbConnect();
    const session = await mongoose.startSession();
    try {
      const result = await session.withTransaction(async () => {
        const response = (await callback(session)) as any;
        const processedRes = await ModelHandler.handle(modelName, response, operation, formData);
        if (onSuccess) return await onSuccess(processedRes as any);
        return processedRes;
      });
      await session.commitTransaction();
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

  protected parseFilterQuery(filterQuery: TCompositeFilter): Record<string, any> {
    if (!filterQuery.CompositeFilters || filterQuery.CompositeFilters.length === 0) {
      return {};
    }

    const operator = filterQuery.CompositeOperator === "OR" ? "$or" : "$and";
    const conditions = filterQuery.CompositeFilters.map((filter) => {
      const filterConditions: Record<string, any> = {};

      if (filter.StringFilters) {
        filter.StringFilters.forEach((sf) => {
          const comparisonMap: Record<string, any> = {
            EQUALS: { $eq: sf.Filter.Value },
            NOT_EQUALS: { $ne: sf.Filter.Value },
            CONTAINS: { $regex: sf.Filter.Value, $options: "i" },
            NOT_CONTAINS: { $not: { $regex: sf.Filter.Value, $options: "i" } },
            PREFIX: { $regex: `^${sf.Filter.Value}`, $options: "i" },
            PREFIX_NOT_EQUALS: { $not: { $regex: `^${sf.Filter.Value}`, $options: "i" } },
            CONTAINS_WORD: { $regex: `\\b${sf.Filter.Value}\\b`, $options: "i" },
          };
          filterConditions[sf.FieldName] = comparisonMap[sf.Filter.Comparison];
        });
      }

      if (filter.NumberFilters) {
        filter.NumberFilters.forEach((nf) => {
          const numFilter = nf.Filter;
          if ("Eq" in numFilter) filterConditions[nf.FieldName] = { $eq: numFilter.Eq };
          else if ("Gt" in numFilter) filterConditions[nf.FieldName] = { $gt: numFilter.Gt };
          else if ("Gte" in numFilter) filterConditions[nf.FieldName] = { $gte: numFilter.Gte };
          else if ("Lt" in numFilter) filterConditions[nf.FieldName] = { $lt: numFilter.Lt };
          else if ("Lte" in numFilter) filterConditions[nf.FieldName] = { $lte: numFilter.Lte };
        });
      }

      if (filter.BooleanFilters) {
        filter.BooleanFilters.forEach((bf) => {
          filterConditions[bf.FieldName] = { $eq: bf.Filter.Value };
        });
      }

      if (filter.ArrayFilters) {
        filter.ArrayFilters.forEach((af) => {
          const arrayMap: Record<string, any> = {
            IN: { $in: af.Filter.Value },
            NOT_IN: { $nin: af.Filter.Value },
            ALL: { $all: af.Filter.Value },
          };
          filterConditions[af.FieldName] = arrayMap[af.Filter.Comparison];
        });
      }

      if (filter.NestedCompositeFilters) {
        const nested = filter.NestedCompositeFilters.map(this.parseFilterQuery);
        return { [filter.Operator === "OR" ? "$or" : "$and"]: nested };
      }

      return filterConditions;
    });

    return { [operator]: conditions };
  }
}

const Persistance = new DBUtil();
export default Persistance;
