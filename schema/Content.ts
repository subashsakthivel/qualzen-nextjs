import { group } from "console";
import { z } from "zod";

export const ContentSchema = z.object({
  _id: z.string().optional(),
  identifier: z.string(),
  title: z.string(),
  description: z.string(),
  titleLink: z.string().optional(),
  bgImg: z
    .object({
      img: z.string().optional(),
      imgLink: z.string().optional(),
    })
    .optional(),
  additionalParams: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  clickAction: z
    .object({
      text: z.string(),
      action: z.string(),
    })
    .optional(),
  groupName: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TContent = z.infer<typeof ContentSchema>;
