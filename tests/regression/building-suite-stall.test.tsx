// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import ProBuildingSuiteClient from '@/app/(building)/pro-building-suite/ProBuildingSuiteClient';
import { SLOW_NOTE_AFTER_MS, pageReload } from '@/lib/loading/resilientImport';

// Building Suite Pro is a same-origin iframe. A stalled download used to end in
// a blank frame after the 6 s safety hide; now a note with Reload appears at
// 12 s unless the suite has loaded (jsdom never loads the frame's src).
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('Building Suite Pro: stalled download', () => {
  it('no note before 12 s; after it a "still downloading" note whose Reload reloads the page', async () => {
    vi.useFakeTimers();
    render(<ProBuildingSuiteClient />);
    await act(async () => { vi.advanceTimersByTime(SLOW_NOTE_AFTER_MS - 100); });
    expect(screen.queryByRole('button', { name: 'Reload page' })).toBeNull();
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(screen.getByText(/Building Suite Pro — the connection is slow or a download stalled/)).toBeTruthy();
    const original = pageReload.run;
    const reload = vi.fn();
    pageReload.run = reload;
    fireEvent.click(screen.getByRole('button', { name: 'Reload page' }));
    pageReload.run = original;
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('a suite that has loaded never shows the note', async () => {
    vi.useFakeTimers();
    const { container } = render(<ProBuildingSuiteClient />);
    fireEvent.load(container.querySelector('iframe') as HTMLIFrameElement);
    await act(async () => { vi.advanceTimersByTime(SLOW_NOTE_AFTER_MS + 1000); });
    expect(screen.queryByRole('button', { name: 'Reload page' })).toBeNull();
  });
});
