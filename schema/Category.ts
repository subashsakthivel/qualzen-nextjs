import { z } from "zod";
import { categorySpecificAttributesSchema } from "./CategorySpecificAttributes";

export const CategorySchema: z.ZodType = z.object({
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentCategory: z.union([z.string(), z.lazy(() => CategorySchema), z.null()]).optional(),
  attributes: z.array(categorySpecificAttributesSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
