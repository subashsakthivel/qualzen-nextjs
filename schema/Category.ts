import { z } from "zod";
import { categorySpecificAttributesSchema } from "./CategorySpecificAttributes";

export const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  parentCategory: z
    .union([z.string(), z.lazy((): z.ZodTypeAny => CategorySchema), z.null()])
    .optional(),
  attributes: z.array(z.union([z.string(), categorySpecificAttributesSchema])),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
