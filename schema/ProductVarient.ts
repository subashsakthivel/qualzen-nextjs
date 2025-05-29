import { z } from "zod";

export const ProductVariantSchema: z.ZodType = z.object({
  productId: z.string(),
  sku: z.string(),
  priceModifier: z.number().min(0).default(0),
  variantSpecificPrice: z.number().min(0).default(0),
  stockQuantity: z.number().min(0).default(0),
  imageNames: z.array(z.string()).min(1).max(10),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()).min(1),
      })
    )
    .max(6),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;
