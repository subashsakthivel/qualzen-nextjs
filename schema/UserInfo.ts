import { z } from "zod";
import { AddressSchemaV1 } from "./Addressv1";

export const UserInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  picture: z.string().optional(),
  phoneNumber: z.number().optional(),
  primaryAddress: z.union([z.string(), AddressSchemaV1]).optional(),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(), // Optional for validation, as it's auto-generated
  updatedAt: z.date().optional(), // Optional for validation, as it's auto-generated
});

export type TUserInfo = z.infer<typeof UserInfoSchema>;
