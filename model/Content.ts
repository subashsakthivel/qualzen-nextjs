import { TContent } from "@/schema/Content";
import mongoose from "mongoose";

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
    trim: true,
  },
  imageName: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  backgroundImageName: {
    type: String,
    required: false,
  },
  backgroundImageUrl: {
    type: String,
    required: false,
  },
  ctaText: {
    type: String,
    required: false,
  },
  ctaTextLink: {
    type: String,
    required: false,
  },
  ctaLink: {
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
