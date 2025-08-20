import { localcache } from "@/lib/cache";
import { DataModelMap, TDataModels } from "@/model/server/data-model-mappings";
import Persistance from "./db-core";

class DataAPIclass {
  async getData({
    modelName,
    operation,
    request,
  }: {
    modelName: TDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      const { options } = request;
      const response = await Persistance.getData({ modelName, operation, options });
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
    modelName: TDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      const { cacheKey } = DataModelMap[modelName];
      const response = await Persistance.saveData({ modelName, operation, data: request });
      localcache.delete(cacheKey);
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
    modelName: TDataModels;
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
