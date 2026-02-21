import { ModelType } from "@/data/model-config";
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

export type TUpdate<T> =
  | {
      [K in TUpdateOperator]: {
        [U in keyof T]: T[U] extends (infer V)[] ? V | V[] : T[U];
      };
    }
  | {
      [K in Extract<TUpdateOperator, "push" | "pull" | "addToSet">]: {
        each: {
          [U in keyof T]: T[U];
        };
      };
    };
const zUpdateQuery = z.union([
  z.record(zUpdateOperator, z.any()),
  z.record(z.enum(["push", "pull", "addToSet"]), z.object({ each: z.any() })),
]);
const zFilterQuery = z.object({
  logic: z.enum(["and", "or"]),
  criteria: z.array(
    z.object({
      field: z.string(),
      operator: z.enum([
        "equals",
        "notEquals",
        "contains",
        "in",
        "notIn",
        "gt",
        "gte",
        "lt",
        "lte",
      ]),
      value: z.any(),
    }),
  ),
});

export const zUpdateQuerySchema = z.union([
  z.record(zUpdateOperator, z.any()),
  z.record(z.enum(["push", "pull", "addToSet"]), z.object({ each: z.any() })),
]);

export type tFilterCriteria = {
  field: string;
  value: string | number | boolean | Array<string | number | boolean>;
  operator: TFilterOperator;
};

export type tFilterNode = tFilterCriteria | tFilterGroup;

export type tFilterGroup = {
  left: tFilterNode;
  operator: "and" | "or";
  right: tFilterNode;
};

export type tDataModels = keyof ModelType;

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
  type?: "delete" | "replace";
}[];

type NumberFilter =
  | { Eq: number }
  | { Gt: number }
  | { Gte: number }
  | { Lt: number }
  | { Lte: number };

export type TCompositeFilter = {
  CompositeFilters?: {
    StringFilters?: {
      FieldName: string;
      Filter: {
        Value: string;
        Comparison:
          | "EQUALS"
          | "PREFIX"
          | "NOT_EQUALS"
          | "PREFIX_NOT_EQUALS"
          | "CONTAINS"
          | "NOT_CONTAINS"
          | "CONTAINS_WORD";
      };
    }[];
    BooleanFilters?: {
      FieldName: string;
      Filter: { Value: boolean };
    }[];
    NumberFilters?: {
      FieldName: string;
      Filter: NumberFilter;
    }[];
    ArrayFilters?: {
      FieldName: string;
      Filter: {
        Comparison: "ALL" | "IN" | "NOT_IN";
        Value: (string | number)[];
      };
    }[];
    NestedCompositeFilters?: TCompositeFilter[];
    Operator?: "AND" | "OR";
  }[];
  CompositeOperator?: "AND" | "OR";
};

export const zCompositeFilter: z.ZodType<TCompositeFilter> = z.lazy(() =>
  z.object({
    CompositeFilters: z
      .array(
        z.object({
          StringFilters: z
            .array(
              z.object({
                FieldName: z.string(),
                Filter: z.object({
                  Value: z.string(),
                  Comparison: z.enum([
                    "EQUALS",
                    "PREFIX",
                    "NOT_EQUALS",
                    "PREFIX_NOT_EQUALS",
                    "CONTAINS",
                    "NOT_CONTAINS",
                    "CONTAINS_WORD",
                  ]),
                }),
              }),
            )
            .optional(),

          BooleanFilters: z
            .array(
              z.object({
                FieldName: z.string(),
                Filter: z.object({
                  Value: z.boolean(),
                }),
              }),
            )
            .optional(),

          NumberFilters: z
            .array(
              z.object({
                FieldName: z.string(),
                Filter: z.union([
                  z.object({ Eq: z.number() }),
                  z.object({ Gt: z.number() }),
                  z.object({ Gte: z.number() }),
                  z.object({ Lt: z.number() }),
                  z.object({ Lte: z.number() }),
                ]),
              }),
            )
            .optional(),

          ArrayFilters: z
            .array(
              z.object({
                FieldName: z.string(),
                Filter: z.object({
                  Comparison: z.enum(["ALL", "IN", "NOT_IN"]),
                  Value: z.array(z.union([z.string(), z.number()])).min(1),
                }),
              }),
            )
            .optional(),

          Operator: z.enum(["AND", "OR"]).optional(),

          NestedCompositeFilters: z.array(zCompositeFilter).max(3).optional(),
        }),
      )
      .optional(),

    CompositeOperator: z.enum(["OR", "AND"]).optional(),
  }),
);

export const zFilter = z.union([
  zCompositeFilter,
  z.record(z.string(), z.union([z.number(), z.string(), z.null(), z.undefined()])),
]);

export type TFilter = z.infer<typeof zFilter>;
export interface FetchDataOptions<T> extends PaginateOptions {
  filter?: TFilter;
  limit?: number;
  fields?: string;
  sort?: { [key: string]: 1 | -1 | "asc" | "desc" };
}
export interface tGetDataParams<T> {
  modelName: tDataModels;
  operation?: string;
  options: FetchDataOptions<T>;
  id?: string;
}

export const zUpdateueryAndFilter = z.object({
  updateQuery: zUpdateQuery,
  queryFilter: zCompositeFilter,
});
