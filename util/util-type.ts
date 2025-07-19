import { PaginateOptions, RootQuerySelector } from "mongoose";

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
type TUpdateOperator =
  | "set"
  | "inc"
  | "unset"
  | "push"
  | "pull"
  | "addToSet"
  | "mul"
  | "min"
  | "max"
  | "rename"
  | "setOnInsert"
  | "currentDate";
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
