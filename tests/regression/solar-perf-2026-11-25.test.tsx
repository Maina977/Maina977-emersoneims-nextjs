// @vitest-environment jsdom
/**
 * Solar performance (2026-11-25, branch perf/solar-tool-loading): per-page code
 * loading in the Solar Genius Pro workspace, the page hold, held menu prefetches
 * on Solar pages, and a pageview that waits for the tool without being lost.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { act, render } from '@testing-library/react';

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
type W = { __eimsToolHold?: number; __eimsEngineeringBusy?: number };
const win = () => window as unknown as W;

afterEach(() => { vi.useRealTimers(); vi.resetModules(); delete win().__eimsToolHold; win().__eimsEngineeringBusy = 0; });

describe('page hold: the first HTML claims "engineering busy" until the tool code arrives', () => {
  it('counts as one download from module start; ends when the first tracked download settles', async () => {
    win().__eimsToolHold = 1;
    const m = await import('@/lib/loading/resilientImport');
    expect(m.engineeringDownloadsInFlight()).toBe(1);
    expect(win().__eimsEngineeringBusy).toBe(1);
    let resolve!: () => void;
    const p = m.trackEngineeringDownload(new Promise<void>((r) => { resolve = r; }));
    expect(m.engineeringDownloadsInFlight()).toBe(2);
    resolve(); await p; await Promise.resolve();
    expect(m.engineeringDownloadsInFlight()).toBe(0);
    expect(win().__eimsEngineeringBusy).toBe(0);
    expect(win().__eimsToolHold).toBe(0);
  });

  it('ends by itself after 10 s if no download ever starts (analytics delayed, never blocked)', async () => {
    vi.useFakeTimers();
    win().__eimsToolHold = 1;
    const m = await import('@/lib/loading/resilientImport');
    expect(m.engineeringDownloadsInFlight()).toBe(1);
    vi.advanceTimersByTime(m.HOLD_CEILING_MS - 1);
    expect(m.engineeringDownloadsInFlight()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(m.engineeringDownloadsInFlight()).toBe(0);
  });

  it('without the flag nothing changes (other pages)', async () => {
    const m = await import('@/lib/loading/resilientImport');
    expect(m.engineeringDownloadsInFlight()).toBe(0);
  });

  it('the inline script is set only on the exact /solar-genius-pro path, before any page code', () => {
    const src = read('app/solar-genius-pro/layout.tsx');
    expect(src).toMatch(/location\.pathname==='\/solar-genius-pro'/);
    expect(src).toMatch(/window\.__eimsToolHold=1/);
    const hold = src.indexOf('id="eims-tool-hold"');
    expect(hold).toBeGreaterThan(-1);
    expect(hold).toBeLessThan(src.indexOf('{children}'));
  });
});

describe('Solar Genius Pro workspace: each page is its own download', () => {
  it('App.tsx imports no page statically; every routed page has a loader whose file exists', async () => {
    const app = read('components/solar-modules/crc/src/App.tsx');
    expect(app).not.toMatch(/import \w+ from '\.\/pages\//);
    const { PAGE_LOADERS } = await import('@/components/solar-modules/crc/src/routes');
    const used = [...app.matchAll(/page\('([^']+)'\)/g)].map((m) => m[1]);
    expect(used.length).toBe(25);
    for (const p of used) expect(PAGE_LOADERS[p], p).toBeTypeOf('function');
    const routesSrc = read('components/solar-modules/crc/src/routes.ts');
    for (const m of routesSrc.matchAll(/import\('\.\/pages\/(\w+)'\)/g)) {
      expect(fs.existsSync(path.join(root, 'components/solar-modules/crc/src/pages', `${m[1]}.tsx`)), m[1]).toBe(true);
    }
    // Every <Route element={<XPage />}> refers to a lazily loaded page constant.
    for (const m of app.matchAll(/element=\{<(\w+Page) \/>\}/g)) expect(app).toMatch(new RegExp(`const ${m[1]} = page\\(`));
  });

  it('pageForHash: known routes map to themselves; "/", empty, query strings and unknown routes open the calculator', async () => {
    const { pageForHash } = await import('@/components/solar-modules/crc/src/routes');
    expect(pageForHash('#/quote-check')).toBe('/quote-check');
    expect(pageForHash('#/pro?tab=reports')).toBe('/pro');
    expect(pageForHash('#/pro/')).toBe('/pro');
    expect(pageForHash('')).toBe('/calculator');
    expect(pageForHash('#/')).toBe('/calculator');
    expect(pageForHash('#/smart-home')).toBe('/calculator');
  });

  it('a page download is shared (one request) and retried; a final failure can be tried again afresh', async () => {
    vi.doMock('@/lib/loading/resilientImport', async (orig) => {
      const real = await orig<typeof import('@/lib/loading/resilientImport')>();
      return { ...real, importWithRetry: (load: () => Promise<unknown>) => load() }; // no back-off wait in the test
    });
    const { PAGE_LOADERS } = await import('@/components/solar-modules/crc/src/routes');
    const a = PAGE_LOADERS['/quote-check']();
    const b = PAGE_LOADERS['/quote-check']();
    expect(a).toBe(b);
    vi.doUnmock('@/lib/loading/resilientImport');
  });

  it('the wrapper starts the current page download at module start (same wave as the shell)', () => {
    const src = read('components/solar-modules/SolarGeniusProV2.tsx');
    expect(src).toMatch(/trackEngineeringDownload\(PAGE_LOADERS\[pageForHash\(window\.location\.hash\)\]\(\)\)/);
    expect(src).toMatch(/eager: true/);
  });
});

describe('pageview waits for the tool, and is never lost', () => {
  const beacons: string[] = [];
  // jsdom's Blob has no .text(): read it with FileReader.
  const readBlob = (b: Blob) => new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.readAsText(b); });
  beforeEach(() => {
    beacons.length = 0;
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: (_u: string, b: Blob) => { void readBlob(b).then((t) => beacons.push(t)); return true; } });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  });
  async function mount(pathname: string) {
    vi.doMock('next/navigation', () => ({ usePathname: () => pathname, useSearchParams: () => new URLSearchParams() }));
    const { default: AnalyticsTracker } = await import('@/components/AnalyticsTracker');
    return render(<AnalyticsTracker />);
  }
  const pageviews = async () => { await Promise.resolve(); await Promise.resolve(); return beacons.filter((b) => b.includes('"pageview"')); };

  it('while busy: not sent; when the tool is ready: sent once', async () => {
    vi.useFakeTimers();
    win().__eimsEngineeringBusy = 1;
    const r = await mount('/solar-genius-pro');
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(await pageviews()).toHaveLength(0);
    win().__eimsEngineeringBusy = 0;
    await act(async () => { vi.advanceTimersByTime(1000 + 1600); });
    vi.useRealTimers();
    await new Promise((res) => setTimeout(res, 20));
    expect(await pageviews()).toHaveLength(1);
    r.unmount();
  });

  it('leaving before the tool is ready still sends the pageview (sendBeacon on pagehide), once', async () => {
    win().__eimsEngineeringBusy = 1;
    const r = await mount('/solar-genius-pro');
    dispatchEvent(new Event('pagehide'));
    dispatchEvent(new Event('pagehide'));
    await new Promise((res) => setTimeout(res, 20));
    expect(await pageviews()).toHaveLength(1);
    r.unmount();
  });

  it('a background tab that was never visible is still not counted, as before', async () => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    win().__eimsEngineeringBusy = 1;
    const r = await mount('/solar-genius-pro');
    dispatchEvent(new Event('pagehide'));
    await new Promise((res) => setTimeout(res, 20));
    expect(await pageviews()).toHaveLength(0);
    r.unmount();
  });

  it('other pages (never busy): sent at idle as before', async () => {
    vi.useFakeTimers();
    const r = await mount('/contact');
    await act(async () => { vi.advanceTimersByTime(1600); });
    vi.useRealTimers();
    await new Promise((res) => setTimeout(res, 20));
    expect(await pageviews()).toHaveLength(1);
    r.unmount();
  });
});

describe('menu prefetches wait on Solar pages while the tool downloads', () => {
  async function mountNav(pathname: string) {
    vi.doMock('next/navigation', () => ({ usePathname: () => pathname, useSearchParams: () => new URLSearchParams(), useRouter: () => ({ push: () => {}, prefetch: () => {} }) }));
    vi.doMock('next/link', () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: ({ prefetch, children, href, ...rest }: any) => <a href={typeof href === 'string' ? href : '#'} data-prefetch={String(prefetch)} {...rest}>{children}</a>,
    }));
    vi.doMock('next/image', () => ({ default: (p: { alt: string }) => <img alt={p.alt} /> }));
    const m = await import('@/lib/loading/resilientImport');
    const { default: Nav } = await import('@/components/navigation/TeslaStyleNavigation');
    return { m, r: render(<Nav />) };
  }
  const prefetching = (c: HTMLElement) => c.querySelectorAll('a[data-prefetch="true"]').length;

  it('Solar page: no link prefetches while busy; they resume when the download settles', async () => {
    const { m, r } = await mountNav('/solar-genius-pro');
    let resolve!: () => void;
    await act(async () => { m.trackEngineeringDownload(new Promise<void>((res) => { resolve = res; })); });
    expect(prefetching(r.container)).toBe(0);
    expect(r.container.querySelector('a[href="/"]')?.getAttribute('data-prefetch')).toBe('false');
    await act(async () => { resolve(); await Promise.resolve(); await Promise.resolve(); });
    expect(prefetching(r.container)).toBeGreaterThan(0);
    r.unmount();
  });

  it('other pages: unchanged, even while an engineering download runs', async () => {
    const { m, r } = await mountNav('/generator-oracle');
    await act(async () => { m.trackEngineeringDownload(new Promise<void>(() => {})); });
    expect(prefetching(r.container)).toBeGreaterThan(0);
    expect(r.container.querySelector('a[href="/"]')?.getAttribute('data-prefetch')).toBe('undefined');
    r.unmount();
  });
});
