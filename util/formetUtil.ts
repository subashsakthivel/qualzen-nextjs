const matchers = [
  {
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
  {
    type: "url_path",
    isValid: (value: string): boolean => {
      return value.startsWith("/") && !value.includes("<");
    },
  },
];

class FormatUtilClass {
  getFormat(value: any): string {
    if (!value) {
      return "undefined";
    }
    if (typeof value === "string") {
      for (const { isValid, type } of matchers) {
        if (isValid(value)) {
          return type;
        }
      }
    }
    return "string";
  }
}
const FormatUtil = new FormatUtilClass();

export default FormatUtil;
