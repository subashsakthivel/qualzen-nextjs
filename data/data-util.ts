class DataUtil {
  public static parseUpdateQuery<T>({ Obj }: { Obj: T }) {
    const updateQuery: any = {};
    for (const key in Obj) {
      if (Object.prototype.hasOwnProperty.call(Obj, key)) {
        if (!Array.isArray(Obj[key])) {
          updateQuery["set"].key = Obj[key];
        }
      }
    }

    return updateQuery;
  }
}

export default DataUtil;
