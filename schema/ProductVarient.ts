import { z } from "zod";
import { ObjectIdSchema } from "./Common";

const ProductAttributeSchema = z.object({
  name: z.string(),
  value: z.string().default(""),
  sortOrder: z.number().default(100),
});

export const ProductVariantSchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  sku: z.string(),
  price: z.number().min(0).default(0),
  sellingPrice: z.number().min(0).default(0),
  stockQuantity: z.number().min(0).default(0),
  attributes: z.array(ProductAttributeSchema).max(6),
  isActive: z.boolean().default(false),
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;
