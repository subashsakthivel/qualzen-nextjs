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
}
