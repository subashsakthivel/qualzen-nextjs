// lib/cache.ts
import { LRUCache } from "lru-cache";

const options = {
  max: 100, // Max 100 items
  ttl: 1000 * 60 * 5, // 5 minutes TTL
};

export const localcache = new LRUCache<string, any>(options);
