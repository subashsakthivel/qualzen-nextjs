import mongoose from "mongoose";
import { TUserInfo, UserInfoSchema } from "@/schema/UserInfo";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from "uuid";

const userInfoDbSchema = new mongoose.Schema<TUserInfo>(
  {
    userId: {
      type: String,
      immutable: true,
      unique: true,
      default: uuidv4,
    },
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
      type: String,
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
  },
  { timestamps: true }
);

userInfoDbSchema.plugin(mongoosePaginate);

export const UserInfoModel =
  (mongoose.models?.UserInfo as unknown as mongoose.PaginateModel<TUserInfo>) ||
  mongoose.model<TUserInfo>("UserInfo", userInfoDbSchema);
