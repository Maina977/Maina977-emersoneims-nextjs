// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// A workspace download that never finishes (a stalled request): after 12 s the
// page must say so and offer a reload; it must never be an endless bare spinner.
vi.mock('@/components/solar-modules/crc/src/App', () => new Promise(() => { /* never resolves */ }));

afterEach(() => { vi.useRealTimers(); });

describe('Solar workspace: stalled download', () => {
  it('shows the loader first, then after 12 s a "still downloading" note with a Reload button', async () => {
    vi.useFakeTimers();
    const { default: SolarGeniusProV2, SLOW_NOTE_AFTER_MS } = await import('@/components/solar-modules/SolarGeniusProV2');
    render(<SolarGeniusProV2 />);
    expect(screen.getByText(/Preparing full workspace/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Reload page' })).toBeNull();
    await act(async () => { vi.advanceTimersByTime(SLOW_NOTE_AFTER_MS + 100); });
    expect(screen.getByText(/download stalled/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy();
  });
});
