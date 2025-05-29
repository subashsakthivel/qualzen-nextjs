import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import mongoose from "mongoose";

const CategorySpecificAttributesDbSchema = new mongoose.Schema<TCategorySpecificAttributes>({
  attributeName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  isMandatoryForVariant: {
    type: Boolean,
    default: false,
  },
  isMandatoryForProduct: {
    type: Boolean,
    default: false,
  },
  allowedValues: {
    type: [String],
    required: true,
    minlength: 1,
    maxlength: 10,
  },
  attributeType: {
    type: String,
    enum: ["text", "number", "select", "checkbox", "radio"],
    required: true,
  },
  defaultValue: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
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
