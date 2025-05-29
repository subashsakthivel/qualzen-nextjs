import { z } from "zod";
import { ProductSchema } from "./Product";

export const PromotionsSchema = z.object({
  uid: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  products: z
    .union([z.array(z.string()), z.array(z.lazy(() => ProductSchema)), z.null()])
    .optional(),
  discountType: z.enum(["percentage", "fixed_amount"]),
  discountValue: z.number().min(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minimumOrderAmount: z.number().min(0).default(0),
  usageLimitPerUser: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type TPromotions = z.infer<typeof PromotionsSchema>;
