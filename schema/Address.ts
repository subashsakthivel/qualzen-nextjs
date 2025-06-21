import { z } from "zod";
import { AddressSchemaV1 } from "./Addressv1";
import { UserInfoSchema } from "./UserInfo";

export const AddressSchema = AddressSchemaV1.extend({
  user: z.union([z.string(), UserInfoSchema]),
});

export type TAddress = z.infer<typeof AddressSchema>;
