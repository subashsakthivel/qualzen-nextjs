import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000, unique: true },
});

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
