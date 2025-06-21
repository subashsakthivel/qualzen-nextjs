import { z } from "zod";

export const AddressSchemaV1 = z.object({
  user: z.string(),
  contactName: z.string().min(1),
  contactNumber: z.string().min(10),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
