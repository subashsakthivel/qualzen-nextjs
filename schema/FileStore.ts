import { z } from "zod";

export const FileStoreSchema = z.object({
  _id: z.string().optional(),
  key: z.string(),
  refCount: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TFileStore = z.infer<typeof FileStoreSchema>;
