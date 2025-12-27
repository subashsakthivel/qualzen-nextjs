import { z } from "zod";
import { ObjectIdSchema } from "./Common";

export const AddressSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  contactName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TAddress = z.infer<typeof AddressSchema>;
