import { z } from "zod";
import { ObjectIdSchema } from "./Common";

export const FileStoreSchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  key: z.string(),
  refCount: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TFileStore = z.infer<typeof FileStoreSchema>;
