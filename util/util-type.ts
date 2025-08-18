import { TDataModels } from "@/model/server/data-model-mappings";
import { PaginateOptions } from "mongoose";
import z from "zod";

export type GetOperation = "GET_TABLE_DATA" | "GET_CHART_DATA" | "GET_DATA" | "GET";

type TFilterOperator =
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

export interface GetDataParams<T> {
  modelName: TDataModels;
  operation?: string;
  options: FetchDataOptions<T>;
}

export type tFileUploadsTask = {
  path: string;
  multi: boolean;
}[];
