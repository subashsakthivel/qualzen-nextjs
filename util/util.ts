import { INPUT_ERRORS } from "@/constants/erros";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodError, ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function filterObjectByType<T>(obj: Record<string, any>, keys: (keyof T)[]): Partial<T> {
  const result = {} as Partial<T>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key as string];
    }
  }
  return result;
}

function getValidatedObj<T>(obj: unknown, zObj: ZodSchema<T>): T {
  try {
    return zObj.parse(obj);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      console.error("Zod validation error:", zodError.errors);
      throw new Error(
        JSON.stringify({ ...INPUT_ERRORS.INVALID_INPUT, message: zodError.errors[0].message })
      );
    } else {
      console.error("Validation error:", error);
      throw new Error(JSON.stringify({ ...INPUT_ERRORS.INVALID_INPUT }));
    }
  }
}

export const CommonUtil = {
  filterObjectByType,
  getValidatedObj,
};
