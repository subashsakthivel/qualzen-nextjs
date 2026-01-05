import { z } from "zod";

export const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  slug: z.string(),
  parentCategory: z
    .union([z.string(), z.lazy((): z.ZodTypeAny => CategorySchema), z.null()])
    .optional(),
  level: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
