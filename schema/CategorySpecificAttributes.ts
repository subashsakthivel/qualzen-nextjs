import { z } from "zod";

export const categorySpecificAttributesSchema = z.object({
  _id: z.string().optional(),
  attributeName: z.string().min(2).max(100),
  displayName: z.string().min(2).max(100),
  isMandatoryForVariant: z.boolean().default(false),
  isMandatoryForProduct: z.boolean().default(false),
  allowedValues: z.array(z.string()).max(10),
  attributeType: z.enum(["text", "number", "select", "checkbox", "radio"]),
  defaultValue: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategorySpecificAttributes = z.infer<typeof categorySpecificAttributesSchema>;
