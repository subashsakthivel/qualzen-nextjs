import { TAddress } from "@/schema/Address";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AddressDBSchema = new mongoose.Schema<TAddress>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AddressDBSchema.plugin(mongoosePaginate);
export const AddressModel =
  (mongoose.models.Address as mongoose.Model<any>) || mongoose.model("Address", AddressDBSchema);
