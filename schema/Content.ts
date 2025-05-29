import { z } from "zod";

export const ContentSchema = z.object({
  title: z.string().min(1),
  keyWord: z.string().min(1),
  body: z.string().min(1),
  imageName: z.string().optional(),
  onClickUrl: z.string().url().optional(),
  backgroundImageName: z.string().optional(),
  fileName: z.string().optional(),
  type: z.enum(["banner", "article", "video", "image", "html"]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type TContent = z.infer<typeof ContentSchema>;
