import { z } from "zod";
import { categorySpecificAttributesSchema } from "./CategorySpecificAttributes";
import { ObjectIdSchema } from "./Common";

export const CategorySchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  name: z.string(),
  image: z.string(),
  description: z.string().optional(),
  parentCategory: z
    .union([z.string(), z.lazy((): z.ZodTypeAny => CategorySchema), z.null()])
    .optional(),
  attributes: z.array(z.union([z.string(), categorySpecificAttributesSchema])),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
