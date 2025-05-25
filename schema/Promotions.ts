import { z } from "zod";
import { ProductSchema } from "./Product";

export const PromotionsSchema = z.object({
  uid: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  products: z
    .union([z.array(z.string()), z.array(z.lazy(() => ProductSchema)), z.null()])
    .optional(),
  discount_type: z.enum(["percentage", "fixed_amount"]),
  discount_value: z.number().min(0),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  minimum_order_amount: z.number().min(0).default(0),
  usage_limit_per_user: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type TPromotions = z.infer<typeof PromotionsSchema>;
