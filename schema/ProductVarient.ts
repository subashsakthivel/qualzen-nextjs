import { z } from "zod";

export const ProductVariantSchema = z.object({
  _id: z.string().optional(),
  sku: z.string(),
  variantSpecificPrice: z.number().min(0).default(0),
  variantSpecificDiscountPrice: z.number().min(0).default(0).optional(),
  stockQuantity: z.number().min(0).default(0),
  imageNames: z.array(z.string()).min(1).max(10),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        sortOrder: z.number().default(100),
      })
    )
    .max(6),
  isActive: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;
