import { z } from "zod";
import { CategorySchema } from "./Category";
import { ObjectIdSchema } from "./Common";
import { ProductSchema } from "./Product";

export const ProductGroupSchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  name: z.string(),
  image: z.string().optional(),
  createdAt: z.union([z.number(), z.date()]).optional(),
  updatedAt: z.date().optional(),
});

export type TProductGroup = z.infer<typeof ProductGroupSchema>;
