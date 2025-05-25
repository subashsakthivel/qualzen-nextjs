import { z } from "zod";

export const ContentSchema = z.object({
  uid: z.string().uuid(),
  title: z.string().min(1),
  key_word: z.string().min(1),
  body: z.string().min(1),
  image_url: z.string().url().optional(),
  on_click_url: z.string().url().optional(),
  background_image_url: z.string().url().optional(),
  file_url: z.string().url().optional(),
  type: z.enum(["banner", "article", "video", "image", "html"]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Content = z.infer<typeof ContentSchema>;
