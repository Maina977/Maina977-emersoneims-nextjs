import { describe, it, expect, vi } from 'vitest';
import { importWithRetry } from '@/components/solar-modules/SolarGeniusProV2';

// Management directive 2026-11-21 "Solar loading": a failed workspace download
// is retried with back-off, then reported; never an endless spinner.
const noWait = () => Promise.resolve();

describe('Solar workspace download retry', () => {
  it('a download that fails twice then succeeds is retried and returns the module', async () => {
    const load = vi.fn()
      .mockRejectedValueOnce(new Error('ChunkLoadError: Loading chunk failed'))
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce('APP');
    await expect(importWithRetry(load, 3, noWait)).resolves.toBe('APP');
    expect(load).toHaveBeenCalledTimes(3);
  });
  it('after three failures the error is passed on (the page then shows "Try again")', async () => {
    const load = vi.fn().mockRejectedValue(new Error('ChunkLoadError'));
    await expect(importWithRetry(load, 3, noWait)).rejects.toThrow(/ChunkLoadError/);
    expect(load).toHaveBeenCalledTimes(3);
  });
  it('waits 1 s then 2 s between attempts', async () => {
    const waits: number[] = [];
    const load = vi.fn().mockRejectedValue(new Error('x'));
    await importWithRetry(load, 3, async (ms) => { waits.push(ms); }).catch(() => {});
    expect(waits).toEqual([1000, 2000]);
  });
});
