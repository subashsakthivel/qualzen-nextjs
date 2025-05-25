import { z } from "zod";

const AddressSchema = z.object({
  uid: z.string().uuid(),
  user: z.string().uuid(),
  contact_name: z.string().min(1),
  contact_number: z.string().min(10),
  company_name: z.string().optional(),
  address_line_1: z.string().min(1),
  address_line_2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().min(1),
  country: z.string().min(1),
  is_default: z.boolean().default(false),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type Address = z.infer<typeof AddressSchema>;
