import { z } from "zod";
import { UserInfoSchema } from "./UserInfo";
import { AddressSchema } from "./Address";

const OrderSchema = z.object({
  user: z.union([z.string().uuid(), UserInfoSchema]),
  orderDate: z.date().default(new Date()),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]).default("pending"),
  totalAmount: z.number().min(0),
  shippingAddress: z.union([z.string().uuid(), AddressSchema]),
  billingAddress: z.union([z.string().uuid(), AddressSchema]),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  shippingCost: z.number().min(0).default(0),
  trackingNumber: z.string().uuid(),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]).default("credit_card"),
  products: z.array(
    z.object({
      product: z.string().uuid(),
      quantity: z.number().min(1),
    })
  ),
  notes: z.string().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type TOrder = z.infer<typeof OrderSchema>;
