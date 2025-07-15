import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000, unique: true },
});

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
