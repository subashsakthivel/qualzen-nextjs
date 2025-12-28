import { zCompositeFilter } from "@/util/util-type";
import z from "zod";

// store offers in both side like server cache , localstorage
export const OfferSchema = z.object({
  name: z.string(),
  image: z.string(), // mobile and desktop image
  constraint: z.string(), // user based contraints
  criteria: zCompositeFilter.optional(), //complex contrains
  startDateTime: z.date(),
  endDateTime: z.date(),
  discount: z.number(),
  maxPrice: z.number(),
});

export type TOffer = z.infer<typeof OfferSchema>;
