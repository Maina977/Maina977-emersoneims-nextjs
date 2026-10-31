/**
 * The limit is per window: refreshing the expiry on every request meant a steady
 * client's count never reset (found 2026-10-31 when a normal AquaScan analysis
 * was refused). Real time, because lru-cache keeps its own clock.
 */
import { describe, it, expect } from 'vitest';
import { rateLimit } from '@/lib/rate-limiter';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('rate limiter window', () => {
  it('refuses above the limit inside one window', () => {
    const l = rateLimit({ interval: 60, uniqueTokenPerInterval: 10 });
    for (let i = 0; i < 5; i++) expect(l.check(5, 'a').success).toBe(true);
    expect(l.check(5, 'a').success).toBe(false);
  });
  it('resets when the window ends, even with steady requests during it', async () => {
    const l = rateLimit({ interval: 1, uniqueTokenPerInterval: 10 });
    for (let i = 0; i < 5; i++) { expect(l.check(5, 'b').success).toBe(true); await wait(150); }
    expect(l.check(5, 'b').success).toBe(false); // about 750 ms in: still the same window
    await wait(500); // past 1 s from the first request
    expect(l.check(5, 'b').success).toBe(true);
  }, 10000);
});
