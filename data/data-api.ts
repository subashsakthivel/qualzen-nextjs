import { tGet } from "@/types/api-type";
import Persistance from "../util/server/db-core";
import { tDataModels } from "../util/util-type";

class DataAPIclass {
  async getData({ modelName, operation, request }: tGet): Promise<any> {
    try {
      const response = await Persistance.getData({
        modelName,
        operation,
        request,
      } as tGet);
      return response;
    } catch (err) {
      console.error("Error in getData:", err);
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
      const response = await Persistance.saveData({ modelName, operation, data: request });
      return response;
    } catch (err) {
      console.error("Error in saveData:", err);
      throw new Error("Failed to add data");
    }
  }

  async updateData({
    modelName,
    operation,
    request,
  }: {
    modelName: tDataModels;
    operation: string;
    request: any;
  }): Promise<any> {
    try {
      if (
        (request instanceof FormData ? request.get("id") : request.id) &&
        operation !== "UPDATE_BY_ID"
      ) {
        const response = await Persistance.updateOneData({
          modelName,
          operation,
          id: request instanceof FormData ? request.get("id") : request.id,
          data: request,
        });
        return response;
      } else {
        const response = await Persistance.updateData({
          modelName,
          operation,
          id: request.id,
          data: request,
          updateQuery: request.updateQuery,
          queryFilter: request.queryFilter,
        });
        return response;
      }
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
      const response = await Persistance.deleteData({
        modelName,
        operation,
        filter: request.filter,
        id: request.id,
      });
      return response;
    } catch (err) {
      console.error("Error in getData:", err);
      throw new Error("Failed to fetch data");
    }
  }
}

const DataAPI = new DataAPIclass();
export default DataAPI;
