import z from "zod";
import { CategorySchema } from "./Category";
import { ProductSchema } from "./Product";
import { ProductVariantSchema } from "./ProductVarient";

const zCriteria = z.object({
  criteria: z.string(),
  conditions: z.array(z.string()),
});
// store offers in both side like server cache , localstorage
const OfferSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z.string(), // mobile and desktop image
  constraint: z.string(),
  criteria: zCriteria.optional(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categories: z.array(CategorySchema),
  products: z.array(ProductSchema),
  variants: z.array(ProductVariantSchema),
});
