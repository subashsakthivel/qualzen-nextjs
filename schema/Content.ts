import { z } from "zod";

export const ContentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  keyWord: z.array(z.string().min(1)).min(1),
  identifier: z.string().min(1).trim(),
  imageName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  backgroundImageName: z.string().optional(),
  backgroundImageUrl: z.string().url().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url().optional(),
  ctaTextLink: z.string().url().optional(),
  type: z.enum(["banner", "article", "video", "image", "html"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TContent = z.infer<typeof ContentSchema>;
