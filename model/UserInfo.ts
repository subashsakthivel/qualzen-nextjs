import mongoose from "mongoose";
import { TUserInfo, UserInfoSchema } from "@/schema/UserInfo";
import mongoosePaginate from "mongoose-paginate-v2";

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
  picture: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  primaryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: false,
  },
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

userInfoDbSchema.plugin(mongoosePaginate);

export const UserInfoModel =
  mongoose.models?.UserInfo || mongoose.model("UserInfo", userInfoDbSchema);
