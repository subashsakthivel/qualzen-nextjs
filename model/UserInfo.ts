import mongoose from "mongoose";
import { TUserInfo } from "@/schema/UserInfo";

const userInfoDbSchema = new mongoose.Schema<TUserInfo>({
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
  primary_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: false,
  },
  other_addresses: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Address",
    },
  ],
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
});

export const UserInfoModel =
  mongoose.models?.UserInfo || mongoose.model("UserInfo", userInfoDbSchema);
