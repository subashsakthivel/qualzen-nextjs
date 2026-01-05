import { TCategory } from "@/schema/Category";
import { TContent } from "@/schema/Content";
import mongoose from "mongoose";

const ContentDBSchema = new mongoose.Schema<TContent>({
  identifier: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  bgImg: {
    type: { img: String, imgLink: String },
  },
  clickAction: [{ text: String, action: String }],
  titleLink: String,
  additionalParams: [{ key: String, value: String }],
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  groupName: {
    type: String,
    required: false,
    index: true,
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
  mongoose.models?.Content || mongoose.model<TContent>("Content", ContentDBSchema);
