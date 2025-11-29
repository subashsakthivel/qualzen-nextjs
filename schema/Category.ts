import { z } from "zod";
import { ObjectIdSchema } from "./Common";
import { categorySpecificAttributesSchema } from "./CategorySpecificAttributes";

export const CategorySchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  name: z.string(),
  image: z.string(),
  description: z.string().optional(),
  parentCategory: z
    .union([z.string(), z.lazy((): z.ZodTypeAny => CategorySchema), z.null()])
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
