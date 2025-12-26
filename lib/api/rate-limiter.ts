// src/lib/api/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize once (outside handler)
const redis = Redis.fromEnv(); // requires UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
  analytics: true,
  prefix: 'ratelimit:',
});

export async function applyRateLimit(
  identifier: string // e.g., IP or API key ID
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  return { success, remaining, reset: reset * 1000, limit }; // reset in ms
}