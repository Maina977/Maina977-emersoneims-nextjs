/**
 * Rate Limiter Utility
 * Uses lru-cache for efficient in-memory rate limiting
 * For production, consider using Redis or Vercel Edge Config
 */

import { LRUCache } from 'lru-cache';

const rateLimit = (options: {
  interval: number; // seconds
  uniqueTokenPerInterval: number;
}) => {
  const tokenCache = new LRUCache<string, number>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval * 1000, // Convert to milliseconds
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) || 0) + 1;
      tokenCache.set(token, tokenCount);

      if (tokenCount > limit) {
        throw new Error('Rate limit exceeded');
      }
    },
  };
};

export const limiter = rateLimit({
  interval: 60, // 1 minute
  uniqueTokenPerInterval: 500,
});

