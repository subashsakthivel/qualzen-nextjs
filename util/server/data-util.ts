import { DBUtil, GetDataParams } from "./db-core";
import { localcache } from "@/lib/cache";
import QueryMap from "@/cache/cache-query";
import { PaginateResult } from "mongoose";
import { TDataModels } from "@/model/server/data-model-mappings";

type TDataUtilCallback<T,V,K> = {
  callback : () => T,
  onFailue? : () => V,
  onSucess : () => K
}

export class DataUtil {
  private constructor() {}

  public static async persistData<
    K extends {
      [P in keyof DBUtil]: DBUtil[P] extends (...args: any[]) => any ? P : never;
    }[keyof DBUtil]
  >(
    userId: string,
    modelName: TDataModels,
    operation: K,
    cacheKey?: string,
    ...args: Parameters<DBUtil[K]>
  ): Promise<ReturnType<DBUtil[K]>> {
    try {
      const instance = new DBUtil(modelName);
      const method = instance[operation];

      if (typeof method !== "function") {
        throw new Error(`Operation ${String(operation)} is not a valid DBUtil method`);
      }
      if (cacheKey) {
        localcache.delete(cacheKey);
        this.fetchData(userId, cacheKey, undefined);
      }
      return await (method as (...args: any[]) => any)(...args);
    } catch (err) {
      console.error("Error performing DB operation:", userId, operation, err);
      throw new Error("Database operation failed");
    }
  }

  public static async fetchData<T>(
    userId: string | undefined,
    cacheKey: string,
    args?: GetDataParams<T>
  ): Promise<{ data: PaginateResult<T> | T[] }> {
    try {
      // TODO: Check user permissions for data access
      const cachedData = localcache.get(cacheKey);
      if (cachedData) return { data: cachedData };

      const isCustom = cacheKey === "custom";
      const query = isCustom ? args : QueryMap.get(cacheKey);

      if ((!isCustom && !query) || (isCustom && !args)) {
        console.error("Invalid cache key or parameters", userId, cacheKey, args);
        throw new Error("Invalid request parameters");
      }

      const data = await DBUtil.getInstance().getData<T>(query!);
      if (!isCustom) {
        localcache.set(cacheKey, data, {
          ttl: 1000 * 60 * 60, // 1 hour
        });
      }
      return { data };
    } catch (err) {
      console.error("Error connecting to the database:", err);
      throw new Error("Database operation failed");
    }
  }

  public static async createNew({
    userId , key , callback , onSuccess , onFailure  
  }: {
    userId : string,
    key : string,
    callback : () => {} | [{callback : ()=>{}, onSuc]
  }) {

  }
}
