/**
 * Rate Limiter Utility
 * Uses lru-cache for efficient in-memory rate limiting
 * For production, consider using Redis or Vercel Edge Config
 */

import { LRUCache } from 'lru-cache';

export const rateLimit = (options: {
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
      const resetTime = Date.now() + (options.interval * 1000);
      
      if (tokenCount > limit) {
        return {
          success: false,
          remaining: Math.max(0, limit - tokenCount + 1),
          reset: resetTime,
        };
      }
      
      // Keep the window's original expiry: refreshing it on every request meant a
      // steady client's count never reset, so a limit "per minute" became a limit
      // per session (found 2026-10-31 by the gate: a normal analysis was refused).
      tokenCache.set(token, tokenCount, { noUpdateTTL: true });
      return {
        success: true,
        remaining: limit - tokenCount,
        reset: resetTime,
      };
    },
  };
};

export const limiter = rateLimit({
  interval: 60, // 1 minute
  uniqueTokenPerInterval: 500,
});

