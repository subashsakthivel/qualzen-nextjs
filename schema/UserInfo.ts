import { z } from "zod";
import { AddressSchema } from "./Address";

export const UserInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  picture: z.string().optional(),
  phoneNumber: z.string().optional(),
  primaryAddress: z.union([z.string().uuid(), AddressSchema]).optional(),
  otherAddresses: z.array(z.union([z.string().uuid(), AddressSchema])).optional(),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(), // Optional for validation, as it's auto-generated
  updatedAt: z.date().optional(), // Optional for validation, as it's auto-generated
});

export type TUserInfo = z.infer<typeof UserInfoSchema>;
