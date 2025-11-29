import { INPUT_ERRORS } from "@/constants/erros";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodError, ZodSchema } from "zod";
import { TUpdate } from "./util-type";

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

function getDiff<T extends Record<string, any>>(
  original: T,
  updated: T
): Partial<T> {
  const diff: Partial<T> = {};

  for (const key in updated) {
    if (Object.prototype.hasOwnProperty.call(updated, key)) {

      const originalValue = original[key];
      const updatedValue = updated[key];
      if (originalValue !== updatedValue) {
        diff[key] = updatedValue;
      }
    }
  }

  return diff;
}


function getUpdateQuery<T extends Record<string, any>>(
  original: T,
  updated: T
): TUpdate<T> | null {
  if (!original || !updated) return null;
  const updatedFlatten = flattenObject(updated);
  const originalFlatten = flattenObject(original);
  const updateQuery= {} as any;
  for (const key in originalFlatten) {
    if(originalFlatten[key]===undefined || originalFlatten[key]===updatedFlatten[key]) {
      continue;
    }
    const val = updatedFlatten[key];
    if ("object" !== typeof val && !Array.isArray(val)) {
      updateQuery.set[key] = val;
    } else if (Array.isArray(val)) {
      if(val.length===0 || originalFlatten[key].length===0){
        updateQuery.set[key] = val;
      } else {
        const addedValues = []
        const removedValues = []
        for (const item of originalFlatten[key]) {
          let isUpdated = true;
          for (const updatedItem of val) {
            if (deepEqual(item, updatedItem)) {
              isUpdated = false;
              break;
            }
          }
          if(isUpdated) {
            removedValues.push(item);
          }
        }
        for (const updatedItem of val) {
          let isUpdated = true;
          for (const item of originalFlatten[key]) {
            if (deepEqual(item, updatedItem)) {
              isUpdated = false;
              break;
            }
          }
          if(isUpdated) {
            addedValues.push(updatedItem);
          }
        }
        updateQuery[`push.${key}`] = {'each' : [addedValues]}
        updateQuery[`pull.${key}`] = {'each' : [removedValues]}
      }
    }
  }

  return  updateQuery as TUpdate<T>;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function flattenObject(
  obj: Record<string, any>,
  prefix = "",
  result: Record<string, any> = {}
): Record<string, any> {
  // if (Array.isArray(obj)) {
  //   obj.forEach((item, index) => {
  //     const path = prefix ? `${prefix}.${index}` : `${index}`;

  //     if (item !== null && typeof item === "object") {
  //       flattenObject(item, path, result);
  //     } else {
  //       result[path] = item;
  //     }
  //   });
  // }
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    //     if(Array.isArray(value)) {
    //     flattenObject(value , path, result)
    // }else 
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
        flattenObject(value, path, result);
      } else {
        result[path] = value;
      }
  }

  return result;
}

export const CommonUtil = {
  filterObjectByType,
  getValidatedObj,
  getDiff,
};
