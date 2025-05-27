import { z } from "zod";

export const ProductVariantSchema: z.ZodType = z.object({
  product_id: z.string(),
  sku: z.string(),
  price_modifier: z.number().min(0).default(0),
  variant_specific_price: z.number().min(0).default(0),
  stock_quantity: z.number().min(0).default(0),
  image_names: z.array(z.string()).min(1).max(10),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.array(z.string()).min(1),
      })
    )
    .max(6),
  is_active: z.boolean().default(true),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type TProductVariant = z.infer<typeof ProductVariantSchema>;
