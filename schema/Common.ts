import mongoose from "mongoose";
import { z } from "zod";

export const ObjectIdSchema = z
  .instanceof(mongoose.Types.ObjectId)
  .transform((id) => id.toString());
