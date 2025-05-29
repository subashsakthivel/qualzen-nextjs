import { z } from "zod";

export const AddressSchema: z.ZodType = z.object({
  uid: z.string().uuid(),
  user: z.string().uuid(),
  contactName: z.string().min(1),
  contactNumber: z.string().min(10),
  companyName: z.string().optional(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type TAddress = z.infer<typeof AddressSchema>;
