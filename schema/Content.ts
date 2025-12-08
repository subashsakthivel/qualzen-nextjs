import { z } from "zod";

export const ContentSchema = z.object({
  identifier: z.string(),
  title: z.string(),
  description: z.string(),
  title_link: z.string().optional(),
  bg_img: z
    .object({
      img: z.string().optional(),
      img_link: z.string().optional(),
    })
    .optional(),
  additional_params: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  click_action: z
    .object({
      text: z.string(),
      action: z.string(),
    })
    .optional(),
  is_active: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TContent = z.infer<typeof ContentSchema>;
