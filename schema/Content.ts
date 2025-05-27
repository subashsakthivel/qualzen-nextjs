import { z } from "zod";

export const ContentSchema = z.object({
  title: z.string().min(1),
  key_word: z.string().min(1),
  body: z.string().min(1),
  image_name: z.string().optional(),
  on_click_url: z.string().url().optional(),
  background_image_name: z.string().optional(),
  file_name: z.string().optional(),
  type: z.enum(["banner", "article", "video", "image", "html"]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type TContent = z.infer<typeof ContentSchema>;
