import { z } from "zod";
import { CategorySchema } from "./Category";
import { ProductVariantSchema } from "./ProductVarient";

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  discountedPrice: z.number().min(0).optional(),
  stockQuantity: z.number().min(0).default(0),
  category: z.union([z.string(), CategorySchema]),
  brand: z.string().optional(),
  imageNames: z.array(z.string()).min(1).max(10),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()).min(1),
      })
    )
    .max(6),
  variants: z.array(ProductVariantSchema).max(10),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TProduct = z.infer<typeof ProductSchema>;
