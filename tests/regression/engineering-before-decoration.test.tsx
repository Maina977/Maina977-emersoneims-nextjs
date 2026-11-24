// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, render } from '@testing-library/react';
import { createPreloader, engineeringDownloadsInFlight, trackEngineeringDownload, useEngineeringIdle } from '@/lib/loading/resilientImport';

vi.mock('next/script', () => ({ default: () => null }));
vi.mock('next/navigation', () => ({ usePathname: () => '/', useSearchParams: () => new URLSearchParams() }));

// Solar stall root cause (2026-11-22): on a slow link the calculator a visitor
// asked for shared the connection with three.js (decorative gallery) and gtag.
// Engineering downloads are now counted, and non-essential downloads wait.
describe('engineering downloads are counted while in flight', () => {
  it('a preloader download counts until it settles, success or failure, and publishes the count on window', async () => {
    let resolve!: (v: string) => void;
    const ok = createPreloader(() => new Promise<string>((r) => { resolve = r; }), { wait: async () => {} });
    const bad = createPreloader(() => Promise.reject(new Error('Loading chunk 9 failed.')), { attempts: 1, wait: async () => {} });
    const base = engineeringDownloadsInFlight();
    const p = ok();
    const q = bad().catch(() => 'failed');
    expect(engineeringDownloadsInFlight()).toBe(base + 2);
    expect((window as unknown as { __eimsEngineeringBusy: number }).__eimsEngineeringBusy).toBe(base + 2);
    expect(await q).toBe('failed');
    expect(engineeringDownloadsInFlight()).toBe(base + 1);
    resolve('module');
    expect(await p).toBe('module');
    await Promise.resolve();
    expect(engineeringDownloadsInFlight()).toBe(base);
  });

  it('useEngineeringIdle follows the count, and is false on the server', async () => {
    function Probe() { return <span>{useEngineeringIdle() ? 'idle' : 'busy'}</span>; }
    expect(renderToStaticMarkup(<Probe />)).toContain('busy'); // server: never claims idle
    const { container } = render(<Probe />);
    expect(container.textContent).toBe('idle');
    let resolve!: () => void;
    await act(async () => { trackEngineeringDownload(new Promise<void>((r) => { resolve = r; })); });
    expect(container.textContent).toBe('busy');
    await act(async () => { resolve(); await Promise.resolve(); });
    expect(container.textContent).toBe('idle');
  });
});

describe('the gtag loader waits for engineering downloads, at most 20 s', () => {
  afterEach(() => { vi.useRealTimers(); document.head.innerHTML = ''; delete (window as unknown as { __eimsEngineeringBusy?: number }).__eimsEngineeringBusy; });

  async function initScript(): Promise<string> {
    const { default: GoogleTags } = await import('@/components/analytics/GoogleTags');
    const html = renderToStaticMarkup(<GoogleTags />);
    const m = html.match(/<script id="gtag-init">([\s\S]*?)<\/script>/);
    if (!m) throw new Error('gtag-init script not rendered');
    return m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  const tagLoaded = () => !!document.head.querySelector('script[src*="googletagmanager.com/gtag/js"]');

  it('loads at 2.5 s when no engineering module is downloading (unchanged behaviour)', async () => {
    const src = await initScript();
    vi.useFakeTimers();
    new Function(src)();
    vi.advanceTimersByTime(2400);
    expect(tagLoaded()).toBe(false);
    vi.advanceTimersByTime(200);
    expect(tagLoaded()).toBe(true);
    expect(document.head.querySelectorAll('script[src*="gtag/js"]').length).toBe(1);
  });

  it('waits while a module downloads, loads once it has arrived; never twice', async () => {
    const src = await initScript();
    vi.useFakeTimers();
    (window as unknown as { __eimsEngineeringBusy: number }).__eimsEngineeringBusy = 1;
    new Function(src)();
    window.dispatchEvent(new Event('pointerdown')); // an interaction does not jump the queue either
    vi.advanceTimersByTime(8000);
    expect(tagLoaded()).toBe(false);
    (window as unknown as { __eimsEngineeringBusy: number }).__eimsEngineeringBusy = 0;
    vi.advanceTimersByTime(1100);
    expect(tagLoaded()).toBe(true);
    vi.advanceTimersByTime(30000);
    expect(document.head.querySelectorAll('script[src*="gtag/js"]').length).toBe(1);
  });

  it('loads after 20 s even if a download never finishes (measurement is never lost)', async () => {
    const src = await initScript();
    vi.useFakeTimers();
    (window as unknown as { __eimsEngineeringBusy: number }).__eimsEngineeringBusy = 1;
    new Function(src)();
    vi.advanceTimersByTime(19000);
    expect(tagLoaded()).toBe(false);
    vi.advanceTimersByTime(2100);
    expect(tagLoaded()).toBe(true);
  });
});
