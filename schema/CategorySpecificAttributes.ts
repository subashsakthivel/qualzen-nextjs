import { z } from "zod";

export const categorySpecificAttributesSchema = z.object({
  _id: z.string().optional(),
  label: z.string().min(2).max(100),
  options: z.array(z.string()).max(10),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCategorySpecificAttributes = z.infer<typeof categorySpecificAttributesSchema>;
