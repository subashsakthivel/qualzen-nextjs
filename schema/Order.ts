import { z } from "zod";
import { UserInfoSchema } from "./UserInfo";
import { AddressSchema } from "./Address";
import { ProductSchema } from "./Product";
import { ProductVariantSchema } from "./ProductVarient";

export const OrderSchema = z.object({
  id: z.string().optional(),
  user: z.union([z.string(), UserInfoSchema]),
  orderDate: z.date().default(new Date()),
  receipt: z.string().optional(),
  transactionId: z.string(),
  status: z.enum(["created", "pending", "delivered", "processing", "failed"]).default("created"),
  amount: z.number().min(0),
  currency: z.string().default("INR"),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  shippingMethod: z.enum(["standard", "express"]).default("standard").optional(),
  shippingCost: z.number().min(0).default(0),
  trackingNumber: z.number(),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "UPI"]).optional(),
  items: z.array(
    z.object({
      product: ProductSchema.pick({ name: true, images: true, _id: true }),
      variant: ProductVariantSchema.pick({ sku: true, attributes: true, _id: true }),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  notes: z.record(z.union([z.string(), z.number()])).optional(),
  createdAt: z.date().default(new Date()).optional(),
  updatedAt: z.date().default(new Date()).optional(),
});

export type TOrder = z.infer<typeof OrderSchema>;

//export type TOrderedProducts = z.infer<typeof OrderSchema>["products"];
