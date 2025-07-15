import { z } from "zod";
import { UserInfoSchema } from "./UserInfo";
import { AddressSchema } from "./Address";

export const OrderSchema = z.object({
  user: z.union([z.string(), UserInfoSchema]),
  orderDate: z.date().default(new Date()),
  receipt: z.string().optional(),
  transactionId: z.string(),
  status: z.enum(["created", "attempted", "paid"]).default("created"),
  amount: z.number().min(0),
  currency: z.string().default("INR"),
  shippingAddress: z.union([z.string(), AddressSchema]),
  billingAddress: z.union([z.string(), AddressSchema]).default("private").optional(),
  shippingMethod: z.enum(["standard", "express"]).default("standard").optional(),
  shippingCost: z.number().min(0).default(0),
  trackingNumber: z.number(),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "UPI"]).optional(),
  products: z.array(
    z.object({
      product: z.string(),
      variant: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  notes: z.record(z.union([z.string(), z.number()])).optional(),
  createdAt: z.date().default(new Date()).optional(),
  updatedAt: z.date().default(new Date()).optional(),
});

export type TOrder = z.infer<typeof OrderSchema>;

export type TOrderedProducts = z.infer<typeof OrderSchema>["products"];
