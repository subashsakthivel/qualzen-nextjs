import z from "zod";
import { ObjectIdSchema } from "./Common";

export const BannerSchema = z.object({
  _id: z.union([z.string(), ObjectIdSchema]).optional(),
  title: z.string(),
  title_link: z.string(),
  style: z.string(),
  unique_grp_key: z.string(),
  type: z.string(),
  custom_component: z.object({
    style: z.string(),
    component: z.string(),
  }),
  background_img: z.string(),
  backgroud_link: z.string(),
  content_componenets: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
      redirect_link: z.string(),
      style: z.string(),
      component: z.string(),
    })
  ),
});

export type tBanner = z.infer<typeof BannerSchema>;
