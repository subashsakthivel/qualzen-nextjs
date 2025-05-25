import mongoose from "mongoose";

const AddressDBSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
  },
  contact_name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
    trim: true,
  },
  company_name: {
    type: String,
    required: false,
  },
  address_line_1: {
    type: String,
    required: true,
  },
  address_line_2: {
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
  is_default: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const AddressModel =
  (mongoose.models.Address as mongoose.Model<any>) || mongoose.model("Address", AddressDBSchema);
