import { z } from "zod";
import { CategorySchema } from "./Category";
import { ProductVariantSchema } from "./ProductVarient";

export const ProductAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
  sortOrder: z.number().default(100),
});

export const ProductSchema = z.object({
  name: z.string(),
  _id: z.string().optional(),

  description: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  discountPrice: z.number().min(0),
  stockQuantity: z.number().min(0).default(0),
  category: z.union([z.string(), CategorySchema]),
  brand: z.string().optional(),
  imageNames: z.array(z.string()).min(1).max(10),
  attributes: z.array(ProductAttributeSchema).max(6),
  variants: z.array(z.union([z.string(), ProductVariantSchema])).max(10),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TProduct = z.infer<typeof ProductSchema>;

export type TProductRes = TProduct & { imageSrc: string[]; _id: string }; // todo: need zod for this
