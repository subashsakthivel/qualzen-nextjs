import { TSequance } from "@/schema/Sequance";
import mongoose from "mongoose";

const SequanceDBSchema = new mongoose.Schema<TSequance>({
  _id: String,
  seq: {
    type: Number,
  },
});

export const SequanceModel =
  mongoose.models?.Sequance || mongoose.model<TSequance>("Sequance", SequanceDBSchema);
