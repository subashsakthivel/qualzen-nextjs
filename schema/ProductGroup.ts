import { z } from "zod";

export const ProductGroupSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  createdAt: z.union([z.number(), z.date()]).optional(),
  updatedAt: z.date().optional(),
});

export type TProductGroup = z.infer<typeof ProductGroupSchema>;
