import { z } from "zod";
import { CategorySchema } from "./Category";
import { ProductVariantSchema } from "./ProductVarient";

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  discounted_price: z.number().min(0).optional(),
  stock_quantity: z.number().min(0).default(0),
  category: z.union([z.string(), CategorySchema]),
  brand: z.string().optional(),
  image_names: z.array(z.string()).min(1).max(10),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()).min(1),
      })
    )
    .max(6),
  variants: z.array(ProductVariantSchema).max(10),
  is_active: z.boolean().default(true),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type TProduct = z.infer<typeof ProductSchema>;
