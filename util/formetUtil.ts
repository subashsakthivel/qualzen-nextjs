const matchers = {
  url: {
    type: "url",
    isValid: (value: string): boolean => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch (err) {
        return false;
      }
    },
  },
  url_path: {
    type: "url_path",
    isValid: (value: string): boolean => {
      return value.startsWith("/") && !value.includes("<");
    },
  },
}

class FormatUtilClass {
  getFormat(value: any): string {
    if (!value) {
      return "undefined";
    }
    if (typeof value === "string") {
      for (const { isValid, type } of Object.values(matchers)) {
        if (isValid(value)) {
          return type;
        }
      }
    }
    return "string";
  }

  isValid(value: string, type: keyof typeof matchers) {
    return matchers[type].isValid(value);
  }
}
const FormatUtil = new FormatUtilClass();

export default FormatUtil;
