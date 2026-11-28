// @vitest-environment jsdom
/**
 * CA-53 (28 Nov 2026): a withdrawal, Reject All or Essential Only in ONE tab
 * must stop optional Google sends at once in every OTHER open tab of the site,
 * without that tab being reloaded. An Accept in another tab must NOT start tags
 * in this tab (it applies on this tab's next page load).
 *
 * "Another tab" is simulated the two ways a browser delivers it:
 *   - a StorageEvent on window (the browser fires it only in other tabs);
 *   - a message on a second BroadcastChannel('eims-consent') object (a
 *     channel never receives its own messages, so a second object stands in
 *     for the other tab).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import CookieConsent from '@/components/compliance/CookieConsent';
import GoogleTagsRouteChange from '@/components/analytics/GoogleTagsRouteChange';
import {
  ALL_DENIED,
  CONSENT_CHANNEL_NAME,
  applyConsentChoice,
  installCrossTabConsentSync,
} from '@/lib/compliance/googleConsent';
import { GA4_IDS, GOOGLE_ADS_ID } from '@/lib/analytics/ids';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname, useSearchParams: () => new URLSearchParams() }));

type W = Window & Record<string, unknown> & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
const w = window as unknown as W;
const IDS = [...GA4_IDS, GOOGLE_ADS_ID].filter(Boolean);

const GOOGLE_SRC = /googletagmanager\.com|google-analytics\.com|googlesyndication\.com|doubleclick\.net|googleadservices\.com/;
const googleScripts = () => Array.from(document.querySelectorAll('script[src]')).filter((s) => GOOGLE_SRC.test(s.getAttribute('src') || ''));

async function initScript(): Promise<string> {
  const { default: GoogleTags } = await import('@/components/analytics/GoogleTags');
  const html = renderToStaticMarkup(<GoogleTags />);
  const m = html.match(/<script id="gtag-init">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('gtag-init script not rendered');
  return m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

/** Each inline script run adds a window 'storage' listener; remove them between tests. */
const inlineListeners: Array<EventListenerOrEventListenerObject> = [];
const realAdd = window.addEventListener.bind(window);
async function runInline() {
  const src = await initScript();
  const spy = vi.spyOn(window, 'addEventListener').mockImplementation(((type: string, fn: EventListenerOrEventListenerObject, opts?: unknown) => {
    if (type === 'storage') inlineListeners.push(fn);
    realAdd(type, fn, opts as AddEventListenerOptions);
  }) as typeof window.addEventListener);
  try { new Function(src)(); } finally { spy.mockRestore(); }
}

function resetWindow() {
  document.head.innerHTML = '';
  for (const fn of inlineListeners.splice(0)) window.removeEventListener('storage', fn);
  for (const k of ['dataLayer', 'gtag', '__eimsLoadGtag', '__eimsGtagBlocked', '__eimsOpenCookieSettings', '__eimsEngineeringBusy', '__eimsCrossTabStop']) delete w[k];
  if (w.__eimsGtagHalt) {
    (w.__eimsGtagHalt as { restore: Array<() => void> }).restore.reverse().forEach((u) => u());
    delete w.__eimsGtagHalt;
  }
  for (const id of IDS) delete w[`ga-disable-${id}`];
  window.localStorage.clear();
  for (const c of document.cookie.split(';')) {
    const n = c.split('=')[0].trim();
    if (n) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

/** Tab 2: an accepted visitor whose page is already measuring (library loaded). */
const realGtagCalls: unknown[][] = [];
async function measuringTab() {
  window.localStorage.setItem('cookie-consent', 'accepted');
  await runInline();
  render(<CookieConsent />);
  render(<GoogleTagsRouteChange />);
  (w.__eimsLoadGtag as (now?: boolean) => void)(true);
  expect(googleScripts()).toHaveLength(1);
  // Stand-in for the running library's gtag, to see what it is told.
  realGtagCalls.length = 0;
  const queueGtag = w.gtag!;
  w.gtag = (...a: unknown[]) => { realGtagCalls.push(a); queueGtag(...a); };
  document.cookie = '_ga=GA1.1.1.1; path=/';
  document.cookie = '_ga_TEST=GS1.1; path=/';
  document.cookie = '_gcl_au=1.1.1; path=/';
  document.cookie = 'keep_me=1; path=/';
}

/** Another tab wrote the stored choice. */
function otherTabStores(value: string | null, key: string | null = 'cookie-consent') {
  if (key === 'cookie-consent') {
    if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value);
  }
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: value, oldValue: 'accepted', storageArea: window.localStorage }));
}

async function expectFullStop() {
  // 1. all four denied, told to the library's gtag
  expect(realGtagCalls.at(-1)).toEqual(['consent', 'update', { ...ALL_DENIED }]);
  // 2. ga-disable for every ID
  for (const id of IDS) expect(w[`ga-disable-${id}`]).toBe(true);
  // 3. gtag and dataLayer neutralised
  const n = (w.dataLayer || []).length;
  w.gtag!('event', 'page_view');
  (w.dataLayer as unknown[]).push(['event', 'x']);
  expect((w.dataLayer || []).length).toBe(n);
  expect(realGtagCalls.at(-1)).toEqual(['consent', 'update', { ...ALL_DENIED }]);
  // 4. transport guard: Google refused, everything else passes
  await expect(window.fetch('https://region1.google-analytics.com/g/collect?v=2')).rejects.toThrow(/withdrawn/);
  const img = document.createElement('img');
  img.src = 'https://www.google.com/ccm/collect?x=1';
  expect(img.getAttribute('src')).toBeNull();
  // 5. Google cookies deleted, others kept
  expect(document.cookie).not.toMatch(/_ga=|_ga_TEST=|_gcl_au=/);
  expect(document.cookie).toContain('keep_me=1');
  // 6. a client-side navigation sends no page_view
  const before = realGtagCalls.length;
  pathname = '/generators';
  render(<GoogleTagsRouteChange />);
  expect(realGtagCalls.length).toBe(before);
}

let origFetch: typeof fetch;
beforeEach(() => {
  resetWindow();
  pathname = '/';
  origFetch = window.fetch;
  window.fetch = (() => Promise.resolve(new Response(''))) as typeof fetch;
  installCrossTabConsentSync();
});
afterEach(() => {
  resetWindow();
  window.fetch = origFetch;
});

describe('CA-53: storage event from another tab', () => {
  it.each(['withdrawn', 'rejected', 'essential'])('another tab records %s: this measuring tab runs the full stop, no reload', async (choice) => {
    await measuringTab();
    otherTabStores(choice);
    await expectFullStop();
  });

  it('another tab clears the stored choice (no consent): full stop', async () => {
    await measuringTab();
    window.localStorage.clear();
    window.dispatchEvent(new StorageEvent('storage', { key: null, newValue: null, storageArea: window.localStorage }));
    await expectFullStop();
  });

  it('another tab records accepted: this tab does NOT start tags (applies on next load)', async () => {
    await runInline();
    render(<CookieConsent />);
    otherTabStores('accepted');
    await new Promise((r) => setTimeout(r, 2700));
    expect(googleScripts()).toHaveLength(0);
    expect(w.__eimsGtagHalt).toBeUndefined();
    expect((w.dataLayer || []).map((a) => Array.from(a as ArrayLike<unknown>)).some((a) => a[0] === 'config')).toBe(false);
  });

  it('a tab stopped by another tab stays stopped when a third tab later accepts', async () => {
    await measuringTab();
    otherTabStores('withdrawn');
    otherTabStores('accepted');
    expect(w.__eimsGtagHalt).toBeDefined();
    const n = (w.dataLayer || []).length;
    w.gtag!('event', 'page_view');
    expect((w.dataLayer || []).length).toBe(n);
  });

  it('other storage keys are ignored', async () => {
    await measuringTab();
    window.dispatchEvent(new StorageEvent('storage', { key: 'something-else', newValue: 'x', storageArea: window.localStorage }));
    expect(w.__eimsGtagHalt).toBeUndefined();
    expect(document.cookie).toMatch(/_ga=/);
  });

  it('early inline listener: a withdrawal before the client module installed blocks the pending load; install runs the full stop', async () => {
    // Fresh page whose module listeners are not installed yet: use a page
    // flag check only (installCrossTabConsentSync is idempotent per window).
    window.localStorage.setItem('cookie-consent', 'accepted');
    await runInline();
    // Library not loaded yet (deferred). Another tab withdraws.
    window.localStorage.setItem('cookie-consent', 'withdrawn');
    const ev = new StorageEvent('storage', { key: 'cookie-consent', newValue: 'withdrawn', storageArea: window.localStorage });
    for (const fn of inlineListeners) (typeof fn === 'function' ? fn : fn.handleEvent).call(window, ev);
    expect(w.__eimsGtagBlocked).toBe(true);
    expect(w.__eimsCrossTabStop).toBe(true);
    for (const id of IDS) expect(w[`ga-disable-${id}`]).toBe(true);
    await new Promise((r) => setTimeout(r, 2700));
    expect(googleScripts()).toHaveLength(0);
    // Module install (re-run its pending check) completes the stop.
    const { installCrossTabConsentSync: install } = await import('@/lib/compliance/googleConsent');
    delete w.__eimsConsentSync;
    install();
    expect(w.__eimsGtagHalt).toBeDefined();
  }, 10000);

  it('early inline listener ignores an Accept from another tab', async () => {
    await runInline();
    const ev = new StorageEvent('storage', { key: 'cookie-consent', newValue: 'accepted', storageArea: window.localStorage });
    for (const fn of inlineListeners) (typeof fn === 'function' ? fn : fn.handleEvent).call(window, ev);
    expect(w.__eimsGtagBlocked).toBeFalsy();
    expect(w.__eimsCrossTabStop).toBeUndefined();
  });
});

describe('CA-53: BroadcastChannel from another tab', () => {
  let other: BroadcastChannel;
  beforeEach(() => { other = new BroadcastChannel(CONSENT_CHANNEL_NAME); });
  afterEach(() => { other.close(); });

  it.each(['withdrawn', 'rejected', 'essential'])('another tab broadcasts %s (stored value unchanged, so no storage event): full stop', async (choice) => {
    await measuringTab();
    window.localStorage.setItem('cookie-consent', choice);
    other.postMessage({ type: 'eims-consent', choice });
    await vi.waitFor(() => expect(w.__eimsGtagHalt).toBeDefined(), { timeout: 3000 });
    await expectFullStop();
  });

  it('another tab broadcasts accepted: ignored, tags not started', async () => {
    await runInline();
    render(<CookieConsent />);
    other.postMessage({ type: 'eims-consent', choice: 'accepted' });
    await new Promise((r) => setTimeout(r, 300));
    expect(googleScripts()).toHaveLength(0);
    expect(w.__eimsGtagHalt).toBeUndefined();
  });

  it('malformed messages are ignored', async () => {
    await measuringTab();
    other.postMessage({ type: 'other', choice: 'withdrawn' });
    other.postMessage('withdrawn');
    other.postMessage({ type: 'eims-consent', choice: 'bogus' });
    await new Promise((r) => setTimeout(r, 300));
    expect(w.__eimsGtagHalt).toBeUndefined();
  });

  it('a choice made in this tab is broadcast to other tabs', async () => {
    const got: unknown[] = [];
    other.onmessage = (e) => got.push(e.data);
    applyConsentChoice('rejected');
    await vi.waitFor(() => expect(got).toEqual([{ type: 'eims-consent', choice: 'rejected' }]), { timeout: 3000 });
  });
});
