import { DeleteResult, FlattenMaps, PaginateOptions, PaginateResult } from "mongoose";
import z from "zod";

export type GetOperation = "GET_TABLE_DATA" | "GET_CHART_DATA" | "GET_DATA" | "GET";

export type TFilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "in"
  | "notIn"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

const zUpdateOperator = z.enum([
  "set",
  "inc",
  "unset",
  "push",
  "pull",
  "addToSet",
  "mul",
  "min",
  "max",
  "rename",
  "setOnInsert",
  "currentDate",
]);
type TUpdateOperator = z.infer<typeof zUpdateOperator>;

export type TCriteria<T> = {
  field: keyof T;
  operator: TFilterOperator;
  value: T[keyof T];
};

export type TUpdate<T> = {
  field: keyof T;
  operator: TUpdateOperator;
  value: any;
}[];

export const zUpdateQuerySchema = z.array(
  z.object({
    field: z.string(),
    operator: zUpdateOperator,
    value: z.any(),
  })
);

export type tFilterCriteria = {
  field: string;
  value: string | number | boolean | Array<string | number | boolean>;
  operator: TFilterOperator;
};

export type tFilter<T> = {
  logic: "and" | "or";
  criteria: TFilter<T>[];
};

export type tFilterNode = tFilterCriteria | tFilterGroup;

export type tFilterGroup = {
  left: tFilterNode;
  operator: "and" | "or";
  right: tFilterNode;
};

export type TFilter<T> =
  | TCriteria<T>
  | {
      logic?: "and" | "or";
      criteria: TFilter<T>[];
    };

export interface FetchDataOptions<T> extends PaginateOptions {
  filter?: TFilter<T>;
  limit?: number;
  fields?: string;
  sort?: { [key: string]: 1 | -1 | "asc" | "desc" };
}

export type tDataModels =
  | "category"
  | "product"
  | "address"
  | "userinfo"
  | "order"
  | "content"
  | "productVariant"
  | "categoryspecificattributes";

export interface tGetDataParams<T> {
  modelName: tDataModels;
  operation?: string;
  options: FetchDataOptions<T>;
  id?: string;
}

export type tDeleteResponse<T> =
  | T
  | (FlattenMaps<any> & Required<{ _id: unknown }> & { __v: number })[]
  | (FlattenMaps<any> & Required<{ _id: unknown }> & { __v: number })
  | DeleteResult
  | null;
export type tGetResponse<T> =
  | T
  | (FlattenMaps<any> & Required<{ _id: unknown }> & { __v: number })[]
  | PaginateResult<T>
  | null
  | undefined;

export type tFileUploadsTask = {
  path: string;
  multi: boolean;
}[];
