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
  bg_img: {
    type: [{ img: String, img_link: String }],
  },
  click_action: [{ text: String, action: String }],
  title_link: String,
  additional_params: [{ key: String, value: String }],
  is_active: {
    type: Boolean,
    required: true,
    default: true,
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
