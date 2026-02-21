export default class ObjectUtil {
  public static getValue({ obj, path }: { obj: any; path: string }) {
    return path
      .replace(/\[(\w+)\]/g, ".$1") // convert [0] to .0
      .replace(/^\./, "") // remove leading dot
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }
  public static setValue({ obj, path, value }: { obj: any; path: string; value: any }) {
    const keys = path
      .replace(/\[(\w+)\]/g, ".$1")
      .replace(/^\./, "")
      .split(".");

    return keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value; // set value
      } else {
        if (!(key in acc)) {
          // Create object or array if not exist
          acc[key] = isNaN(Number(keys[idx + 1])) ? {} : [];
        }
      }
      return acc[key];
    }, obj);
  }

  public static flatten(
    obj: Record<string, any>,
    parentKey = "",
    result: Record<string, any> = {},
  ): Record<string, any> {
    for (const key in obj) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        this.flatten(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }

    return result;
  }

  public static diff(
    original: Record<string, any>,
    referance: Record<string, any>,
  ): Record<string, any> {
    const flattenedObj1 = this.flatten(original);
    const flattenedObj2 = this.flatten(referance);
    const differences: Record<string, any> = {};
    for (const key in flattenedObj2) {
      if (flattenedObj1[key] !== flattenedObj2[key]) {
        differences[key] = flattenedObj2[key];
      }
    }
    return differences;
  }

  public static isEqualObject(a: any, b: any): boolean {
    // Strict equality handles primitives + same reference
    if (a === b) return true;

    // Handle NaN
    if (Number.isNaN(a) && Number.isNaN(b)) return true;

    // If types differ
    if (typeof a !== typeof b) return false;

    // Null check
    if (a == null || b == null) return false;

    // Handle Date
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    // Handle Array
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.isEqualObject(a[i], b[i])) return false;
      }
      return true;
    }

    // Handle Object
    if (typeof a === "object") {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.isEqualObject(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  }
}
