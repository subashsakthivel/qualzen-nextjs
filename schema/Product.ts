import { z } from "zod";
import { CategorySchema } from "./Category";
import { ProductVariantSchema } from "./ProductVarient";
import { ObjectIdSchema } from "./Common";

export const ProductAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
  sortOrder: z.number().default(100),
});

export const ProductSchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  category: z.union([z.string(), CategorySchema]),
  name: z.string(),
  description: z.string(),
  images: z.array(z.string()).min(1).max(10),
  brand: z.string().optional(),
  slug: z.string(),
  attributes: z.array(ProductAttributeSchema).max(6),
  variants: z.array(ProductVariantSchema).min(1).max(10),
  tags: z.array(z.string()).max(3).default([]),
  otherdetails: z.string().optional(),
  relatedLinks: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  feature_location: z.string().optional(),
  createdAt: z.union([z.number(), z.date()]).optional(),
  updatedAt: z.date().optional(),
});

export type TProduct = z.infer<typeof ProductSchema>;
