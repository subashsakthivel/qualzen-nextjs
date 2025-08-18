import { TCategory } from "@/schema/Category";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { DBUtil } from "@/util/server/db-core";
import { TFilter } from "@/util/util-type";
import { TDataModels } from "./data-model-mappings";

/** 🔹 Maps cache keys per model */
const CacheKeys: Record<TDataModels, string> = {
  category: "category-list",
  product: "product-list",
  productVariant: "product-variant-list",
  address: "address-list",
  content: "content-lis",
  order: "orde",
  base: "",
  userinfo: "",
};

/** 🔹 Core Operations */
