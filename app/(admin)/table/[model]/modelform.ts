import { TCategory } from "@/schema/Category";
import DataClientAPI from "@/api/client/data-api";
import { tDataModels } from "@/util/util-type";

import z from "zod";

type FieldType =
  | "text"
  | "number"
  | "image"
  | "textarea"
  | "select"
  | "json"
  | "date"
  | "bool"
  | "link"
  | "unique"
  | "images"
  | "subFormArray"
  | "tags";

interface BaseField {
  name: string;
  path?: string;
  displayName?: string;
  type?: FieldType;
  options?: () => Promise<{ name: string; value: string }[]> | { name: string; value: string }[];
  validator?: z.ZodType;
  required?: boolean;
  subFormConfig?: ModelConfig;
}

interface ModelConfig {
  fields: BaseField[];
}

const attributes: ModelConfig = {
  fields: [
    {
      name: "name",
    },
    {
      name: "value",
    },
    {
      name: "sortOrder",
      type: "number",
    },
  ],
};

const variants: ModelConfig = {
  fields: [
    {
      name: "sku",
    },
    {
      name: "price",
      type: "number",
    },
    {
      name: "sellingPrice",
      type: "number",
    },
    {
      name: "stockQuantity",
      type: "number",
    },
    {
      name: "attributes",
      type: "subFormArray",
      subFormConfig: attributes,
    },
  ],
};

const product: ModelConfig = {
  fields: [
    {
      name: "name",
    },
    {
      name: "category",
      type: "select",
      required: false,
      options: async (): Promise<{ value: string; name: string }[]> => {
        return await DataClientAPI.getData({
          modelName: "category",
          operation: "GET_DATA_MANY",
          request: {},
        }).then((res) => {
          console.log("result options : ", res);
          return res.map((r: TCategory) => ({ value: r._id, name: r.name }));
        });
      },
      validator: z.string().max(100).min(1),
    },
    {
      name: "categorySlug",
      type: "text",
      validator: z.string().max(100).min(1),
    },
    {
      name: "slug",
    },
    {
      name: "audience",
      type: "select",
      options: () =>
        [
          { name: "All", value: "all" },
          { name: "Men", value: "men" },
          { name: "Women", value: "women" },
          { name: "Kids", value: "kids" },
          { name: "Unisex", value: "unisex" },
          { name: "Boys", value: "boys" },
          { name: "Girls", value: "girls" },
          { name: "Teens", value: "teens" },
        ] as { name: string; value: string }[],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "images",
      type: "images",
      validator: z.union([z.array(z.string()), z.array(z.instanceof(File)).max(10).min(1)]),
    },
    {
      name: "brand",
    },
    {
      name: "attributes",
      type: "subFormArray",
      subFormConfig: attributes,
    },
    {
      name: "variants",
      type: "subFormArray",
      subFormConfig: variants,
    },
    {
      name: "tags",
      type: "tags",
    },
    {
      name: "otherdetails",
      type: "json",
      required: false,
    },
    {
      name: "relatedLinks",
      type: "subFormArray",
      subFormConfig: {
        fields: [
          {
            name: "name",
          },
          {
            name: "url",
            type: "link",
          },
        ],
      },
    },
    {
      name: "feature_location",
      type: "text",
    },
  ],
};
const category: ModelConfig = {
  fields: [
    {
      name: "name",
    },
    {
      name: "slug",
      type: "unique",
    },
    {
      name: "image",
      type: "image",
      validator: z.union([z
        .instanceof(File, { message: "File is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "File size must be under 5MB",
        })
        .refine((file) => ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/Webp"].includes(file.type), {
          message: "Invalid file type",
        }), z.string()]),
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "level",
      type: "number",
      validator: z.number().max(3).min(0),
    },
    {
      name: "parentCategory",
      type: "select",
      required: false,
      options: async (): Promise<{ value: string; name: string }[]> => {
        return await DataClientAPI.getData({
          modelName: "category",
          operation: "GET_DATA_MANY",
          request: {},
        }).then((res) => {
          console.log("result options : ", res);
          return res.map((r: TCategory) => ({ value: r._id, name: r.name }));
        });
      },
      validator: z.string().max(100).min(1).optional(),
    },
  ],
};

const content: ModelConfig = {
  fields: [
    {
      name: "identifier",
      type: "unique",
    },
    {
      name: "title",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      displayName: "Title Redirect url",
      name: "titleLink",
      type: "link",
    },
    {
      displayName: "Desktop Backgroud image",
      type: "image",
      name: "bgImg.desktop.img",
      validator: z.union([z
        .instanceof(File, { message: "File is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "File size must be under 5MB",
        })
        .refine((file) => ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/Webp"].includes(file.type), {
          message: "Invalid file type",
        }), z.string()]),
      path: "bgImg.desktop.img",
    },
    {
      displayName: "Mobile Backgroud image",
      type: "image",
      name: "bgImg.mobile.img",
      validator: z.union([z
        .instanceof(File, { message: "File is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "File size must be under 5MB",
        })
        .refine((file) => ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/Webp"].includes(file.type), {
          message: "Invalid file type",
        }), z.string()]),
      path: "bgImg.mobile.img",
      required: false,
    },
    {
      displayName: "Background image redirect link",
      type: "link",
      name: "bgImg.onImageClick",
      path: "bgImg.onImageClick",
      required: false,
    },
    {
      displayName: "Click Text",
      name: "clickAction.text",
      path: "clickAction.text",
    },
    {
      displayName: "Click Action",
      name: "clickAction.action",
      path: "clickAction.action",
    },
    {
      name: "groupName",
    },
    {
      displayName: "Is Active",
      name: "isActive",
      type: "bool",
    },
  ],
};

const offer: ModelConfig = {
  fields: [
    {
      name: "name",
    },
    {
      name: "image",
      type: "image",
    },
    {
      name: "constraint",
    },
    {
      name: "criteria",
      type: "json",
    },
    {
      name: "discount",
      type: "number",
    },
    {
      name: "maxPrice",
      type: "number",
    },
    {
      name: "startDate",
      type: "date",
    },
    {
      name: "endDate",
      type: "date",
    },
  ],
};

const modelForm = {
  product,
  category,
  content,
  offer,
};

const preDefinedZods = {
  text: z.string().max(100).min(2),
  textarea: z.string().max(5000).min(10),
  number: z.number().max(1000000000).min(0),
  unique: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/)
    .max(50)
    .min(5),
  link: z.union([z.string().max(10000), z.url().max(1000)]),
};

export type FormFieldMeta = {
  name: string;
  displayName: string;
  type: FieldType;
  options?: () => Promise<{ name: string; value: string }[]> | { name: string; value: string }[];
  validator: z.ZodType;
  path: string;
  required?: boolean;
  subFormConfig?: {
    fields: FormFieldMeta[];
  };
};

export type tFormConfigMeta = {
  fields: FormFieldMeta[];
  schema: z.ZodObject;
};

const resolveFormFields = (fields: BaseField[]): FormFieldMeta[] => {
  const resolveField = (field: BaseField): FormFieldMeta => {
    const type = field.type ?? "text";
    if (type === "subFormArray" && field.subFormConfig && field.subFormConfig.fields) {
      return {
        name: field.name,
        displayName: field.displayName ?? toDisplayLabel(field.name),
        type: "subFormArray",
        subFormConfig: {
          fields: resolveFormFields(field.subFormConfig.fields),
        },
        path: field.path ?? field.name,
        validator: z.array(z.any()),
      };
    }
    const base = {
      name: field.name,
      displayName: field.displayName ?? toDisplayLabel(field.name),
    };

    if (type === "select") {
      return {
        ...base,
        type: "select",
        options: field.options,
        validator: field.validator ?? preDefinedZods.text,
        path: field.path ?? field.name,
      };
    }

    const resolvedType = field.type === undefined || field.type === "unique" ? "text" : field.type;
    return {
      ...base,
      type: resolvedType,
      validator:
        field.validator ??
        preDefinedZods[resolvedType as keyof typeof preDefinedZods] ??
        preDefinedZods.text,
      path: field.path ?? field.name,
    };
  };
  return fields.map((field) => resolveField(field));
};
const setNestedShape = (
  shape: Record<string, any>,
  path: string,
  validator: z.ZodTypeAny,
  required?: boolean
) => {
  const keys = path.split(".");
  let current = shape;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = required ? validator : validator.optional();
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  });
};

const buildZodObject = (obj: any): z.ZodObject => {
  const newShape: any = {};

  for (const key in obj) {
    if (obj[key] instanceof z.ZodType) {
      newShape[key] = obj[key];
    } else {
      newShape[key] = buildZodObject(obj[key]);
    }
  }

  return z.object(newShape);
};

export const getFormMetaData = (modelName: tDataModels): tFormConfigMeta => {
  //"category" | "content" | "offer"

  const fields = modelForm[modelName as "category" | "content" | "offer" | "product"].fields;
  const shape: Record<string, z.ZodType<any>> = {};
  const resolvedFields: FormFieldMeta[] = resolveFormFields(fields);
  resolvedFields.map((field) => {
    setNestedShape(shape, field.path, field.validator, field.required ? true : false)
  });

  return { fields: resolvedFields, schema: buildZodObject(shape) };
};

function toReadableLabel(value: string): string {
  return (
    value
      // split camelCase & PascalCase
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      // split acronyms like URLValue → URL Value
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
  );
}

function toDisplayLabel(value: string): string {
  return toReadableLabel(value).replace(/\b\w/g, (c) => c.toUpperCase());
}
