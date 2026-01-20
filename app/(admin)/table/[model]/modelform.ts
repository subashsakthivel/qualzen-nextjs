import { TCategory } from "@/schema/Category";
import DataClientAPI from "@/util/client/data-client-api";
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
  | "images";

interface BaseField {
  name: string;
  path?: string;
  displayName?: string;
  type?: FieldType;
  options?: () => Promise<{ name: string; value: string }[]> | { name: string; value: string }[];
  validator?: z.ZodType;
  required?: boolean;
}

interface ModelConfig {
  fields: BaseField[];
}
const product: ModelConfig = {
  fields: [
    {
      name: "name",
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
      validator: z
        .instanceof(File, { message: "File is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "File size must be under 5MB",
        })
        .refine((file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type), {
          message: "Invalid file type",
        }),
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
      validator: z.string().max(100).min(1),
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
      displayName: "Backgroud image",
      type: "image",
      name: "backgroudImage",
      path: "bgImg.img",
    },
    {
      displayName: "Background image redirect link",
      type: "link",
      name: "backgorudImageonClickPage",
      path: "bgImg.imgLink",
    },
    {
      displayName: "Click Text",
      name: "RedirectText",
      path: "clickAction.text",
    },
    {
      displayName: "Click Action",
      name: "RedirectPage",
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
  link: z.url().max(1000),
};

export type FormFieldMeta = {
  name: string;
  displayName: string;
  type: FieldType;
  options?: () => Promise<{ name: string; value: string }[]> | { name: string; value: string }[];
  validator: z.ZodType;
  path: string;
  required?: boolean;
};

export type tFormConfigMeta = {
  fields: FormFieldMeta[];
  schema: z.ZodObject;
};

export const getFormMetaData = (modelName: tDataModels): tFormConfigMeta => {
  //"category" | "content" | "offer"

  const fields = modelForm[modelName as "category" | "content" | "offer"].fields;
  const shape: Record<string, z.ZodType<any>> = {};
  const resolvedFields: FormFieldMeta[] = fields.map((field): FormFieldMeta => {
    const type = field.type ?? "text";

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
    shape[field.name] = field.validator ?? z.any();
    return {
      ...base,
      type: resolvedType,
      validator:
        field.validator ??
        preDefinedZods[resolvedType as keyof typeof preDefinedZods] ??
        preDefinedZods.text,
      path: field.path ?? field.name,
    };
  });

  return { fields: resolvedFields, schema: z.object(shape) };
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
