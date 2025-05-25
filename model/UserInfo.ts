import { z } from "zod";
import mongoose from "mongoose";

// Zod schema for UserInfo
export const UserInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  picture: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  isEMailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(), // Optional for validation, as it's auto-generated
  updatedAt: z.date().optional(), // Optional for validation, as it's auto-generated
});

// Mongoose schema for UserInfo
const userInfoDbSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    isEMailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export type UserInfo = z.infer<typeof UserInfoSchema>;
export const UserInfoModel =
  mongoose.models?.UserInfo || mongoose.model("UserInfo", userInfoDbSchema);
