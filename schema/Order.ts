import { z } from "zod";
import { UserInfoSchema } from "./UserInfo";
import { AddressSchema } from "./Address";

const OrderSchema = z.object({
  user: z.union([z.string().uuid(), UserInfoSchema]),
  order_date: z.date().default(new Date()),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]).default("pending"),
  total_amount: z.number().min(0),
  shipping_address: z.union([z.string().uuid(), AddressSchema]),
  billing_address: z.union([z.string().uuid(), AddressSchema]),
  shipping_method: z.enum(["standard", "express"]).default("standard"),
  shipping_cost: z.number().min(0).default(0),
  tracking_number: z.string().uuid(),
  payment_method: z.enum(["credit_card", "paypal", "bank_transfer"]).default("credit_card"),
  products: z.array(
    z.object({
      product: z.string().uuid(),
      quantity: z.number().min(1),
    })
  ),
  notes: z.string().optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type TOrder = z.infer<typeof OrderSchema>;
