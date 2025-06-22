import { z } from "zod";
import { UserInfoSchema } from "./UserInfo";
import { AddressSchema } from "./Address";

export const OrderSchema = z.object({
  user: z.union([z.string(), UserInfoSchema]),
  orderDate: z.date().default(new Date()),
  transactionId: z.string(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]).default("pending"),
  totalAmount: z.number().min(0),
  shippingAddress: z.union([z.string(), AddressSchema]),
  billingAddress: z.union([z.string(), AddressSchema]),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  shippingCost: z.number().min(0).default(0),
  trackingNumber: z.string(),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "UPI"]).default("credit_card"),
  products: z.array(
    z.object({
      product: z.string(),
      variant: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  notes: z.string().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type TOrder = z.infer<typeof OrderSchema>;
