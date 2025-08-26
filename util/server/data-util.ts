import { localcache } from "@/lib/cache";
import { DataModelMap } from "@/model/server/data-model-mappings";
import Persistance from "./db-core";
import { tDataModels } from "../util-type";

class DataAPIclass {
  async getData({
    modelName,
    operation,
    request,
  }: {
    modelName: tDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      const { options } = request;
      const { cacheKey } = DataModelMap[modelName];
      const operationCacheKey = cacheKey + "-" + operation;
      if (localcache.has(operationCacheKey)) {
        return localcache.get(operationCacheKey);
      }
      const response = await Persistance.getData({ modelName, operation, options: { ...options } });
      localcache.set(operationCacheKey, response);
      return response;
    } catch (err) {
      console.error("Error in getData:", err);
      throw new Error("Failed to fetch data");
    }
  }

  async saveData({
    modelName,
    operation,
    request,
  }: {
    modelName: tDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      const { cacheKey } = DataModelMap[modelName];
      const response = await Persistance.saveData({ modelName, operation, data: request });
      localcache.entries().forEach(([key]) => {
        if (key.startsWith(cacheKey)) {
          localcache.delete(key);
        }
      });
      return response;
    } catch (err) {
      console.error("Error in getData:", err);
      throw new Error("Failed to fetch data");
    }
  }

  async deleteData({
    modelName,
    operation,
    request,
  }: {
    modelName: tDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      const { cacheKey } = DataModelMap[modelName];
      const { filter, id } = request;
      const response = Persistance.deleteData({ modelName, operation, filter, id });
      localcache.delete(cacheKey);
      return response;
    } catch (err) {
      console.error("Error in getData:", err);
      throw new Error("Failed to fetch data");
    }
  }
}

const DataAPI = new DataAPIclass();
export default DataAPI;
