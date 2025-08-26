import { z } from "zod";
import { CategorySchema } from "./Category";
import { ProductVariantSchema, TProductVariant } from "./ProductVarient";
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
  sku: z.string(),
  price: z.number().min(0),
  sellingPrice: z.number().min(0),
  stockQuantity: z.number().min(0).default(0),
  images: z.array(z.string()).min(1).max(10),
  brand: z.string().optional(),
  attributes: z.array(ProductAttributeSchema).max(6),
  variants: z.array(ProductVariantSchema).max(10),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).max(3).default([]),
  instructions: z.string().optional(),
  otherdetails: z.string().optional(),
  relatedLinks: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TProduct = z.infer<typeof ProductSchema>;
