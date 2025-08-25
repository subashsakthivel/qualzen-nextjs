import { FetchDataOptions, tDataModels, TFilter, tGetDataParams } from "../util-type";
import { PaginateOptions, PaginateResult } from "mongoose";
import { DataSourceMap } from "./data-source-mappings";

class DataServiceClass {
  // async getPaginationData<T>({
  //   modelName,
  //   operation = "GET_DATA",
  //   request,
  //   id,
  // }: Omit<tGetDataParams<T>, "options"> & { request: any }): Promise<PaginateResult<T>> {

  //   try {
  //     const { url } = DataSourceMap[modelName];

  //     const encodedUrl = this.buildEncodedUrl(url, {...request ,  operation });

  //     const response = await fetch(encodedUrl);

  //     const resJson = await response.json();

  //     if (!response.ok) {
  //       debugger;
  //       throw new Error("Request failed");
  //     }

  //     return resJson.data;
  //   } catch (err) {
  //     debugger;
  //     console.error("Error fetching data:", err);
  //     throw new Error("Unknown error");
  //   }
  // }
  async getData<T>({
    modelName,
    operation = "GET_DATA",
    request,
    id,
  }: Omit<tGetDataParams<T>, "options"> & { request: any }): Promise<any> {
    try {
      const { url } = DataSourceMap[modelName];

      const encodedUrl = this.buildEncodedUrl(url, { request, operation });

      const response = await fetch(encodedUrl);

      const resJson = await response.json();

      if (!response.ok) {
        debugger;
        throw new Error("Request failed");
      }

      return resJson.data;
    } catch (err) {
      debugger;
      console.error("Error fetching data:", err);
      throw new Error("Unknown error");
    }
  }
  buildEncodedUrl(baseUrl: string, request: Record<string, any>): string {
    const queryString = this.encodeParams(request);
    return `${baseUrl}?${queryString}`;
  }
  encodeParams(params: Record<string, any>): string {
    const query = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        if (params[key] instanceof Object) {
          query.append(key, JSON.stringify(params[key]));
        } else {
          query.append(key, String(params[key]));
        }
      }
    }

    return query.toString();
  }
  async saveData({
    modelName,
    request,
  }: {
    modelName: tDataModels;
    request: any;
  }): Promise<{ success: boolean; data: any; message?: string }> {
    try {
      const { url } = DataSourceMap[modelName];

      const response = await fetch(url, { body: request, method: "POST" });

      const resJson = await response.json();

      debugger;
      if (!response.ok) {
        throw new Error(resJson.message || "Request failed");
      }

      return { success: true, data: resJson.data };
    } catch (err) {
      debugger;
      console.error("Error posting data:", err);
      return {
        success: false,
        data: null,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }
}
const DataClientAPI = new DataServiceClass();

export default DataClientAPI;
