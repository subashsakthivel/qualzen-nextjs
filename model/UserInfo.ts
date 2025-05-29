import mongoose from "mongoose";
import { TUserInfo } from "@/schema/UserInfo";

const userInfoDbSchema = new mongoose.Schema<TUserInfo>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
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
  primaryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: false,
  },
  otherAddresses: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Address",
    },
  ],
  isEmailVerified: {
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
});

export const UserInfoModel =
  mongoose.models?.UserInfo || mongoose.model("UserInfo", userInfoDbSchema);
