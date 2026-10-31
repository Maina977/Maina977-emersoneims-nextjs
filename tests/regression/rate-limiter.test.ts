/**
 * The limit is per window: refreshing the expiry on every request meant a steady
 * client's count never reset (found 2026-10-31 when a normal AquaScan analysis
 * was refused).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { limiter } from '@/lib/rate-limiter';

afterEach(() => vi.useRealTimers());

describe('rate limiter window', () => {
  it('refuses above the limit inside one window', () => {
    const t = `w1-${Math.random()}`;
    for (let i = 0; i < 5; i++) expect(limiter.check(5, t).success).toBe(true);
    expect(limiter.check(5, t).success).toBe(false);
  });
  it('resets when the window ends, even with steady requests during it', () => {
    vi.useFakeTimers();
    const t = `w2-${Math.random()}`;
    for (let i = 0; i < 5; i++) { expect(limiter.check(5, t).success).toBe(true); vi.advanceTimersByTime(10_000); }
    vi.advanceTimersByTime(15_000); // 65 s after the first request
    expect(limiter.check(5, t).success).toBe(true);
  });
});
