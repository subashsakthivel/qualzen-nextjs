import { TOffer } from "@/schema/Offer";
import mongoose from "mongoose";

const OfferDBSchema = new mongoose.Schema<TOffer>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  discount: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  constraint: {
    type: String,
  },
  criteria: {
    type: Object,
  },
  startDateTime: {
    type: Date,
    default: Date.now,
  },
  endDateTime: {
    type: Date,
    default: Date.now,
  },
});

export const OfferModel = mongoose.models?.Offer || mongoose.model<TOffer>("Offer", OfferDBSchema);
