import { GetDataParams } from "@/util/server/db-core";

const QueryMap = new Map<string, GetDataParams<any>>();

QueryMap.set("hero-banner", {
  modelName: "content",
  options: {
    filter: {
      field: "identifier",
      operator: "equals",
      value: "hero-banner",
    },
    limit: 5,
    sort: { timestamp: -1 },
  },
});

export default QueryMap;
