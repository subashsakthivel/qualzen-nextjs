import { z } from "zod";
import { categorySpecificAttributesSchema } from "./CategorySpecificAttributes";

export const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  parentCategory: z
    .union([z.string(), z.lazy((): z.ZodTypeAny => CategorySchema), z.null()])
    .optional(),
  attributes: z.union([z.array(z.string().uuid()), z.array(categorySpecificAttributesSchema)]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
