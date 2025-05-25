type DataType = "string" | "number" | "date" | "boolean" | "array" | "object" | "unknown";

export interface ColumnConfig {
  key: string;
  label: string;
  type?: DataType;
  format?: (value: any) => string;
  sortable?: boolean;
}

const tableStructure = {
  category: {
    name: "category",
    columns: {
      _id: {
        type: "string",
        required: true,
        unique: true,
      },
      name: {
        type: "string",
        required: true,
        unique: true,
      },
      displayName: {
        type: "string",
        required: true,
      },
      parentCategory: {
        type: "string",
        required: false,
      },
    },
  },
};
