import z from "zod";

export const SequanceSchame = z.object({
  _id: z.string(),
  seq: z.number(),
});

export type TSequance = z.infer<typeof SequanceSchame>;
