import { TContent } from "@/schema/Content";
import mongoose, { Schema } from "mongoose";

const ContentDbSchema = new mongoose.Schema<TContent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  keyWord: {
    type: [String],
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  details: {
    type: Schema.Types.Mixed,
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

export const ContentModel =
  (mongoose.models?.Content as unknown as mongoose.Model<TContent>) ||
  mongoose.model<TContent>("Content", ContentDbSchema);
