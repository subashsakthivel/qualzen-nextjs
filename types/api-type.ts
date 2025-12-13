import { tDataModels, zFilter } from "@/util/util-type";
import z from "zod";

const options = z.object({
  filter: z.union([zFilter, z.record(z.string().max(100), z.any())]),
  limit: z.number().min(5).max(50),
  page: z.number().min(1).max(1000),
  select: z.union([z.array(z.string().max(100)).max(10), z.string()]),
});
const get_data_by_id = z.object({
  operation: z.enum(["GET_DATA_BY_ID", "GET_DATA_BY_ID_RAW"]),
  request: z.object({
    id: z.string().max(100),
    options: options.partial().optional(),
  }),
});
const get_data = z.object({
  operation: z.enum(["GET_DATA", "GET_DATA_MANY", "GET_DATA_RAW", "GET_DATA_ONE"], {
    message: "Invalid Operation",
  }),
  request: z
    .object(
      {
        id: z.string().max(100),
        options: options.partial(),
      },
      { message: "Not a valid request" }
    )
    .partial(),
});

//types and zod
export const zGet = z.discriminatedUnion("operation", [get_data_by_id, get_data]);
export type tGet = { modelName: tDataModels } & z.infer<typeof zGet>;
