import { TContent } from "@/schema/Content";
import mongoose from "mongoose";

const ContentDbSchema = new mongoose.Schema<TContent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  keyWord: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: false,
  },
  onClickUrl: {
    type: String,
    required: false,
    validate: {
      validator: function (v: string) {
        return !v || /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w.-]*)*\/?$/.test(v);
      },
      message: "Invalid URL format",
    },
  },
  backgroundImageName: {
    type: String,
    required: false,
  },
  fileName: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["banner", "article", "video", "image", "html"],
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

export const ContentModel = mongoose.model<TContent>("Content", ContentDbSchema);
