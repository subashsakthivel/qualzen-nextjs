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
    result: Record<string, any> = {}
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
    referance: Record<string, any>
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
}
