// export function getCurrencyFormet(price: number) {
//   const formatted = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "INR",
//   }).format(price);

import { isValid } from "date-fns";

//   return formatted;
// }

// export function getDateFormet(date: number) {
//   const d = new Date(date);
//   return d.toLocaleDateString();
// }

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
