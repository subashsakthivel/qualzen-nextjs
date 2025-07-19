import { FetchDataOptions, TFilter } from "../util-type";
import { PaginateOptions, PaginateResult } from "mongoose";
import { DataSourceMap, TDataSources } from "./data-source-mappings";
import { debug } from "console";

export class DataService {
  private constructor() {}

  static async getPaginationData<T>(
    modelName: TDataSources,
    operation: string = "GET_DATA",
    {
      filter,
      limit = 100,
      sort = { ["timestamp"]: -1 },
      fields = "",
      page = 1,
      ...otherOptions
    }: FetchDataOptions<T>
  ): Promise<PaginateResult<T>> {
    const params = {
      page,
      limit,
      sort,
      filter,
      ...otherOptions,
    };

    try {
      const { url } = DataSourceMap[modelName];

      const encodedUrl = this.buildEncodedUrl(url, { operation, request: params });

      const response = await fetch(encodedUrl);

      const resJson = await response.json();

      if (!response.ok) {
        debugger;
        throw new Error("Request failed");
      }

      return resJson.data;
    } catch (err) {
      debugger;
      console.error("Error fetching data:", this.name, this.arguments, err);
      throw new Error("Unknown error");
    }
  }

  static async getData<T>(
    modelName: TDataSources,
    operation: string = "GET_DATA",
    {
      filter,
      limit = 100,
      sort = { ["timestamp"]: -1 },
      fields = "",
      page = 1,
      ...otherOptions
    }: FetchDataOptions<T>
  ): Promise<PaginateResult<T>> {
    const params = {
      page,
      limit,
      sort,
      filter,
      ...otherOptions,
    };

    try {
      const { url } = DataSourceMap[modelName];

      const encodedUrl = this.buildEncodedUrl(url, { operation, request: params });

      const response = await fetch(encodedUrl);

      const resJson = await response.json();

      if (!response.ok) {
        debugger;
        throw new Error("Request failed");
      }

      return resJson.data;
    } catch (err) {
      debugger;
      console.error("Error fetching data:", this.name, this.arguments, err);
      throw new Error("Unknown error");
    }
  }
  static buildEncodedUrl(baseUrl: string, params: Record<string, any>): string {
    const queryString = this.encodeParams(params);
    return `${baseUrl}?${queryString}`;
  }
  static encodeParams(params: Record<string, any>): string {
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
}
