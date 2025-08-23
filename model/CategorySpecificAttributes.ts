import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import mongoose from "mongoose";
import DatabaseUtil from "@/util/dbUtil";

const CategorySpecificAttributesDbSchema = new mongoose.Schema<TCategorySpecificAttributes>({
  _id: {
    type: String,
    required: true,
  },
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

CategorySpecificAttributesDbSchema.pre("validate", async function (next) {
  try {
    const category = this;
    if (this.isNew) {
      category._id = await DatabaseUtil.getSeq({ _id: "categoryspecificattributes" });
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const CategorySpecificAttributesModel =
  (mongoose.models?.CategorySpecificAttributes as mongoose.Model<TCategorySpecificAttributes>) ||
  mongoose.model<TCategorySpecificAttributes, mongoose.Model<TCategorySpecificAttributes>>(
    "CategorySpecificAttributes",
    CategorySpecificAttributesDbSchema
  );
