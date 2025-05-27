import { TContent } from "@/schema/Content";
import mongoose from "mongoose";

const ContentDbSchema = new mongoose.Schema<TContent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  key_word: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image_name: {
    type: String,
    required: false,
  },
  on_click_url: {
    type: String,
    required: false,
    validate: {
      validator: function (v: string) {
        return !v || /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w.-]*)*\/?$/.test(v);
      },
      message: "Invalid URL format",
    },
  },
  background_image_name: {
    type: String,
    required: false,
  },
  file_name: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["banner", "article", "video", "image", "html"],
    required: true,
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

export const ContentModel = mongoose.model<TContent>("Content", ContentDbSchema);
