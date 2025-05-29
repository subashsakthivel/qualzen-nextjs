import { TAddress } from "@/schema/Address";
import mongoose from "mongoose";

const AddressDBSchema = new mongoose.Schema<TAddress>({
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  companyName: {
    type: String,
    required: false,
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
  postal_code: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
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

export const AddressModel =
  (mongoose.models.Address as mongoose.Model<any>) || mongoose.model("Address", AddressDBSchema);
