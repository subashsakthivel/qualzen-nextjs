import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import mongoose from "mongoose";

const CategorySpecificAttributesDbSchema = new mongoose.Schema<TCategorySpecificAttributes>({
  label: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  options: {
    type: [String],
    required: true,
    minlength: 1,
    maxlength: 10,
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

// CategorySpecificAttributesDbSchema.pre("validate", async function (next) {
//   try {
//     const category = this;
//     if (this.isNew) {
//       category._id = await DatabaseUtil.getSeq({ _id: "categoryspecificattributes" });
//     }
//     next();
//   } catch (err) {
//     next(err as Error);
//   }
// });

export const CategorySpecificAttributesModel =
  (mongoose.models?.CategorySpecificAttributes as mongoose.Model<TCategorySpecificAttributes>) ||
  mongoose.model<TCategorySpecificAttributes, mongoose.Model<TCategorySpecificAttributes>>(
    "CategorySpecificAttributes",
    CategorySpecificAttributesDbSchema
  );
