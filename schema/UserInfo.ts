import { z } from "zod";
import { AddressSchema } from "./Address";
import { v4 as uuidv4 } from "uuid";

export const UserInfoSchema = z.object({
  userId: z.string().default(uuidv4),
  name: z.string().min(1, "Name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  picture: z.string().optional(),
  phoneNumber: z.string().optional(),
  primaryAddress: z.union([z.string(), AddressSchema]).optional(),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(), // Optional for validation, as it's auto-generated
  updatedAt: z.date().optional(), // Optional for validation, as it's auto-generated
});

export type TUserInfo = z.infer<typeof UserInfoSchema>;
