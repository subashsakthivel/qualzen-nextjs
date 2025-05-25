import { z } from "zod";

export const CategorySchema: z.ZodType = z.object({
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  parent_category: z.union([z.string(), z.lazy(() => CategorySchema), z.null()]).optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type TCategory = z.infer<typeof CategorySchema>;
