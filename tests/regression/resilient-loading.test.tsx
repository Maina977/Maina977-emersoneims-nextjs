// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createPreloader, importWithRetry, onBeforeRecoveryReload, pageReload, recoveryReload, SLOW_NOTE_AFTER_MS } from '@/lib/loading/resilientImport';
import { resilient } from '@/lib/loading/ResilientModule';

// Management priority 1 (2026-11-21): every dynamically loaded engineering
// module recovers from slow, interrupted and failed downloads.
const noWait = () => Promise.resolve();
const Panel = ({ label }: { label: string }) => <p>Loaded: {label}</p>;
const mod = { default: Panel };
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('importWithRetry and createPreloader', () => {
  it('waits 1 s then 2 s between three attempts, then passes the error on', async () => {
    const waits: number[] = [];
    const load = vi.fn().mockRejectedValue(new Error('ChunkLoadError'));
    await expect(importWithRetry(load, 3, async (ms) => { waits.push(ms); })).rejects.toThrow(/ChunkLoadError/);
    expect(load).toHaveBeenCalledTimes(3);
    expect(waits).toEqual([1000, 2000]);
  });
  it('the download is shared, and after a failure the next call downloads again', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue('M');
    const pre = createPreloader(load, { attempts: 1, wait: noWait });
    await expect(pre()).rejects.toThrow();
    expect(pre.peek()).toBeUndefined();
    const [a, b] = [pre(), pre()];
    expect(a).toBe(b);
    await expect(a).resolves.toBe('M');
    expect(pre.peek()).toBe('M');
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe('ResilientModule in four network states', () => {
  it('normal: the loader, then the module with its props', async () => {
    const C = resilient<{ label: string }>(() => Promise.resolve(mod), { name: 'Test tool', wait: noWait });
    render(<C label="normal" />);
    await flush();
    expect(screen.getByText('Loaded: normal')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('slow: after 12 s a "still downloading" note with Reload page, which writes drafts first', async () => {
    vi.useFakeTimers();
    const C = resilient(() => new Promise<typeof mod>(() => { /* stalled */ }), { name: 'Slow tool' });
    render(<C label="x" />);
    expect(screen.getByText(/Preparing full workspace/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Reload page' })).toBeNull();
    await act(async () => { vi.advanceTimersByTime(SLOW_NOTE_AFTER_MS + 100); });
    expect(screen.getByText(/download stalled/)).toBeTruthy();
    const order: string[] = [];
    const off = onBeforeRecoveryReload(() => order.push('flush'));
    const original = pageReload.run;
    pageReload.run = () => { order.push('reload'); };
    fireEvent.click(screen.getByRole('button', { name: 'Reload page' }));
    expect(order).toEqual(['flush', 'reload']);
    pageReload.run = original; off();
  });

  it('interrupted: one failed download is retried and the module appears, no error shown', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('net::ERR_INTERNET_DISCONNECTED')).mockResolvedValue(mod);
    const C = resilient<{ label: string }>(load, { name: 'Interrupted tool', wait: noWait });
    render(<C label="after retry" />);
    await flush();
    expect(screen.getByText('Loaded: after retry')).toBeTruthy();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('failed: after 3 failures "Try again" is shown, and it downloads again', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('a')).mockRejectedValueOnce(new Error('b')).mockRejectedValueOnce(new Error('c')).mockResolvedValue(mod);
    const C = resilient<{ label: string }>(load, { name: 'Failing tool', variant: 'panel', wait: noWait });
    render(<C label="recovered" />);
    await flush();
    expect(screen.getByRole('alert').textContent).toMatch(/Failing tool did not download/);
    expect(load).toHaveBeenCalledTimes(3);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await flush();
    expect(screen.getByText('Loaded: recovered')).toBeTruthy();
    expect(load).toHaveBeenCalledTimes(4);
  });

  it('a module already downloaded renders at once on a second mount (no loader flash)', async () => {
    const C = resilient<{ label: string }>(() => Promise.resolve(mod), { name: 'Panel', variant: 'panel', wait: noWait });
    await C.preload();
    render(<C label="again" />);
    expect(screen.getByText('Loaded: again')).toBeTruthy();
  });

  it('the server render is the loader, never the module (no hydration mismatch)', async () => {
    const C = resilient<{ label: string }>(() => Promise.resolve(mod), { name: 'SSR tool', wait: noWait });
    await C.preload();
    const html = renderToString(<C label="ssr" />);
    expect(html).toMatch(/SSR tool/);
    expect(html).not.toMatch(/Loaded: ssr/);
  });
});

describe('Pro Tools report generation (#/pro "Generate & Download PDF")', () => {
  const blobRes = () => new Response(new Blob(['%PDF']), { status: 200, headers: { 'content-type': 'application/pdf' } });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('interrupted: a dropped connection is retried and the file arrives', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue(blobRes());
    vi.stubGlobal('fetch', fetchMock);
    const { postReport } = await import('@/components/solar-modules/crc/src/services/api');
    const out = await postReport('/reports/proposal', {}, { wait: noWait });
    expect(out).toBeInstanceOf(Blob);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('stalled: each attempt is stopped at the timeout, and after 3 a clear message re-enables the button', async () => {
    const fetchMock = vi.fn((_u: string, init: RequestInit) => new Promise((_r, reject) => {
      init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    }));
    vi.stubGlobal('fetch', fetchMock);
    const { postReport } = await import('@/components/solar-modules/crc/src/services/api');
    await expect(postReport('/reports/proposal', {}, { timeoutMs: 20, wait: noWait })).rejects.toThrow(/did not answer.*Tried 3 times/);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('an HTTP error from the server is not retried', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'bad input' }), { status: 400, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const { postReport } = await import('@/components/solar-modules/crc/src/services/api');
    await expect(postReport('/reports/proposal', {}, { wait: noWait })).rejects.toThrow('bad input');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('recoveryReload', () => {
  it('a failing flush does not block the others or the reload', () => {
    const calls: string[] = [];
    const a = onBeforeRecoveryReload(() => { throw new Error('quota'); });
    const b = onBeforeRecoveryReload(() => calls.push('b'));
    recoveryReload(() => calls.push('reload'));
    expect(calls).toEqual(['b', 'reload']);
    a(); b();
  });
});
