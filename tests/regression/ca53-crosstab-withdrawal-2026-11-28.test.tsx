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
import type { ReactElement } from 'react';
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
  for (const k of ['dataLayer', 'gtag', '__eimsLoadGtag', '__eimsGtagBlocked', '__eimsOpenCookieSettings', '__eimsEngineeringBusy', '__eimsCrossTabStop', 'google_tag_data', 'google_tag_manager', '__eimsPageChoice', '__eimsPageChoiceStored']) delete w[k];
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
/** Re-renders the SAME GoogleTagsRouteChange instance (review finding 3). */
let routeRerender: (ui: ReactElement) => void = () => {};
const pageViews = () => realGtagCalls.filter((a) => a[0] === 'event' && a[1] === 'page_view');
async function measuringTab() {
  window.localStorage.setItem('cookie-consent', 'accepted');
  await runInline();
  render(<CookieConsent />);
  routeRerender = render(<GoogleTagsRouteChange />).rerender;
  (w.__eimsLoadGtag as (now?: boolean) => void)(true);
  expect(googleScripts()).toHaveLength(1);
  // Stand-in for the running library's gtag, to see what it is told.
  realGtagCalls.length = 0;
  const queueGtag = w.gtag!;
  w.gtag = (...a: unknown[]) => { realGtagCalls.push(a); queueGtag(...a); };
  // Positive control: before the withdrawal, a client-side navigation on this
  // same instance DOES send a page_view.
  pathname = '/before-withdrawal';
  routeRerender(<GoogleTagsRouteChange />);
  expect(pageViews()).toEqual([['event', 'page_view', { page_path: '/before-withdrawal' }]]);
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
  // 6. a client-side navigation on the SAME route-change instance (the one
  // that sent a page_view before the withdrawal) now sends none
  const before = pageViews().length;
  pathname = '/generators';
  routeRerender(<GoogleTagsRouteChange />);
  pathname = '/solar';
  routeRerender(<GoogleTagsRouteChange />);
  expect(pageViews().length).toBe(before);
  expect((w.dataLayer || []).map((a) => Array.from(a as ArrayLike<unknown>)).some((a) => a[0] === 'event' && a[1] === 'page_view')).toBe(false);
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

  it('inline listener ignores a sessionStorage event (review note 6)', async () => {
    await runInline();
    const ev = new StorageEvent('storage', { key: 'cookie-consent', newValue: 'withdrawn', storageArea: window.sessionStorage });
    for (const fn of inlineListeners) (typeof fn === 'function' ? fn : fn.handleEvent).call(window, ev);
    expect(w.__eimsGtagBlocked).toBeFalsy();
    expect(w.__eimsCrossTabStop).toBeUndefined();
  });

  it('inline listener also sends the all-denied update to gtag at once (review note 5)', async () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    await runInline();
    const ev = new StorageEvent('storage', { key: 'cookie-consent', newValue: 'rejected', storageArea: window.localStorage });
    for (const fn of inlineListeners) (typeof fn === 'function' ? fn : fn.handleEvent).call(window, ev);
    const last = Array.from((w.dataLayer || []).at(-1) as ArrayLike<unknown>);
    expect(last).toEqual(['consent', 'update', { ...ALL_DENIED }]);
  });

  it('a choice made in this tab is broadcast to other tabs', async () => {
    const got: unknown[] = [];
    other.onmessage = (e) => got.push(e.data);
    applyConsentChoice('rejected');
    await vi.waitFor(() => expect(got).toEqual([{ type: 'eims-consent', choice: 'rejected' }]), { timeout: 3000 });
  });
});

const items = () => (w.dataLayer || []).map((a) => Array.from(a as ArrayLike<unknown>));
const hasGrantOrConfig = () => items().some((a) => a[0] === 'config' || a[0] === 'event'
  || (a[0] === 'consent' && a[1] === 'update' && Object.values((a[2] || {}) as object).includes('granted')));

describe('CA-53 review finding 1: withdrawal while gtag/js is still downloading', () => {
  /** Accepted tab whose library script is requested but has not executed. */
  async function downloadingTab() {
    window.localStorage.setItem('cookie-consent', 'accepted');
    await runInline();
    render(<CookieConsent />);
    (w.__eimsLoadGtag as (now?: boolean) => void)(true);
    expect(googleScripts()).toHaveLength(1);
    expect(hasGrantOrConfig()).toBe(true); // the grant and configs are queued, waiting for the library
    return googleScripts()[0] as HTMLScriptElement;
  }

  it('the queued grant, configs and events are taken out before the library can read them', async () => {
    await downloadingTab();
    otherTabStores('withdrawn');
    expect(hasGrantOrConfig()).toBe(false);
    expect(items().at(-1)).toEqual(['consent', 'update', { ...ALL_DENIED }]);
    expect(items()[0]).toEqual(['consent', 'default', expect.objectContaining({ ...ALL_DENIED })]);
  });

  it('the library cannot install its own dataLayer.push after the stop', async () => {
    await downloadingTab();
    otherTabStores('rejected');
    const libPush = vi.fn(() => 0);
    (w.dataLayer as unknown as { push: unknown }).push = libPush; // what gtag.js does on load
    expect(w.dataLayer!.push).not.toBe(libPush);
    const n = w.dataLayer!.length;
    w.dataLayer!.push(['config', 'G-X']);
    expect(w.dataLayer!.length).toBe(n);
    expect(libPush).not.toHaveBeenCalled();
  });

  it('when the late script loads (or fails), the stop runs again and Google cookies written meanwhile are wiped, twice', async () => {
    const s = await downloadingTab();
    otherTabStores('essential');
    // The library runs and writes cookies before our load listener fires.
    w.google_tag_data = {};
    document.cookie = '_gcl_au=1.1.late; path=/';
    document.cookie = '_ga=GA1.1.late; path=/';
    document.cookie = 'keep_me=1; path=/';
    s.dispatchEvent(new Event('load'));
    expect(document.cookie).not.toMatch(/_gcl_au=|_ga=/);
    expect(document.cookie).toContain('keep_me=1');
    // ...and a cookie written by its first run, shortly after, is wiped too.
    document.cookie = '_gcl_au=1.1.later; path=/';
    await new Promise((r) => setTimeout(r, 650));
    expect(document.cookie).not.toMatch(/_gcl_au=/);
  });

  it('error on the late script also re-runs the wipe', async () => {
    const s = await downloadingTab();
    otherTabStores('withdrawn');
    document.cookie = '_gcl_au=1.1.err; path=/';
    s.dispatchEvent(new Event('error'));
    expect(document.cookie).not.toMatch(/_gcl_au=/);
  });

  it('same-tab Accept after such a stop still measures: grant first, configs back, the library gets the queue', async () => {
    await downloadingTab();
    otherTabStores('withdrawn');
    const libPush = vi.fn((...a: unknown[]) => a.length);
    (w.dataLayer as unknown as { push: unknown }).push = libPush; // library loaded while stopped
    applyConsentChoice('accepted');
    expect(w.__eimsGtagHalt).toBeUndefined();
    expect(w.dataLayer!.push).toBe(libPush);
    const pushed = libPush.mock.calls.map((c) => Array.from(c[0] as ArrayLike<unknown>));
    const grantAt = pushed.findIndex((a) => a[0] === 'consent' && a[1] === 'update' && (a[2] as Record<string, string>).analytics_storage === 'granted');
    const configAt = pushed.findIndex((a) => a[0] === 'config');
    expect(grantAt).toBeGreaterThanOrEqual(0);
    expect(configAt).toBeGreaterThan(grantAt);
    expect(pushed.filter((a) => a[0] === 'config').map((a) => a[1])).toEqual(IDS);
  });

  it('re-review note B: a non-configurable library push does not make a later same-tab Accept throw', async () => {
    await downloadingTab();
    const libPush = function (this: unknown, ...a: unknown[]) { return a.length; };
    Object.defineProperty(w.dataLayer!, 'push', { value: libPush, configurable: false, writable: false });
    otherTabStores('withdrawn'); // the stop's defineProperty is skipped (caught)
    expect(() => applyConsentChoice('accepted')).not.toThrow();
    expect(w.__eimsGtagHalt).toBeUndefined();
    expect(window.localStorage.getItem('cookie-consent')).toBe('accepted');
  });

  it('same-tab Accept after a stop before the library was requested: configs back after the grant, library loads', async () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    await runInline(); // configs queued, library deferred (not requested yet)
    render(<CookieConsent />);
    otherTabStores('rejected');
    expect(googleScripts()).toHaveLength(0);
    applyConsentChoice('accepted');
    expect(googleScripts()).toHaveLength(1);
    const it2 = items();
    const grantAt = it2.findIndex((a) => a[0] === 'consent' && a[1] === 'update' && (a[2] as Record<string, string>).analytics_storage === 'granted');
    expect(it2.findIndex((a) => a[0] === 'config')).toBeGreaterThan(grantAt);
  });
});

describe('CA-53 review finding 2: reconcile on back/forward-cache restore and on becoming visible', () => {
  const setVisible = (v: 'visible' | 'hidden') => Object.defineProperty(document, 'visibilityState', { value: v, configurable: true });
  afterEach(() => { delete (document as unknown as Record<string, unknown>).visibilityState; });

  function pageshow(persisted: boolean) {
    const e = new Event('pageshow');
    Object.defineProperty(e, 'persisted', { value: persisted });
    window.dispatchEvent(e);
  }

  it('stored choice changed with NO event delivered; pageshow persisted: full stop', async () => {
    await measuringTab();
    window.localStorage.setItem('cookie-consent', 'withdrawn'); // event missed (bfcache)
    expect(w.__eimsGtagHalt).toBeUndefined();
    pageshow(true);
    await expectFullStop();
  });

  it('stored choice changed with NO event delivered; tab becomes visible: full stop', async () => {
    await measuringTab();
    window.localStorage.setItem('cookie-consent', 'essential');
    setVisible('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await expectFullStop();
  });

  it('pageshow that is not a cache restore, or becoming hidden, does nothing', async () => {
    await measuringTab();
    window.localStorage.setItem('cookie-consent', 'rejected');
    pageshow(false);
    setVisible('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(w.__eimsGtagHalt).toBeUndefined();
  });

  it('still accepted: nothing stops', async () => {
    await measuringTab();
    pageshow(true);
    setVisible('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(w.__eimsGtagHalt).toBeUndefined();
  });

  // Re-review finding A: blocked storage must not stop a page accepted HERE.
  it('storage blocked (getItem and setItem throw): Accept in this tab keeps measuring through tab switches and bfcache restores', async () => {
    await runInline();
    render(<CookieConsent />);
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError'); });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError'); });
    try {
      applyConsentChoice('accepted');
      expect(googleScripts()).toHaveLength(1);
      setVisible('visible');
      document.dispatchEvent(new Event('visibilitychange'));
      pageshow(true);
      expect(w.__eimsGtagHalt).toBeUndefined();
      const n = (w.dataLayer || []).length;
      w.gtag!('event', 'page_view');
      expect((w.dataLayer || []).length).toBe(n + 1);
    } finally {
      get.mockRestore();
      set.mockRestore();
    }
  });

  it('storage write fails but reads an old value (quota): Accept in this tab is not undone by reconcile', async () => {
    window.localStorage.setItem('cookie-consent', 'rejected'); // older choice
    await runInline();
    render(<CookieConsent />);
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    try {
      applyConsentChoice('accepted');
      expect(window.localStorage.getItem('cookie-consent')).toBe('rejected');
      setVisible('visible');
      document.dispatchEvent(new Event('visibilitychange'));
      pageshow(true);
      expect(w.__eimsGtagHalt).toBeUndefined();
    } finally {
      set.mockRestore();
    }
  });

  it('control: Accept stored normally in this tab, then a withdrawal elsewhere whose event was missed: reconcile still stops', async () => {
    await runInline();
    render(<CookieConsent />);
    applyConsentChoice('accepted');
    window.localStorage.setItem('cookie-consent', 'withdrawn'); // another tab; event missed
    setVisible('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(w.__eimsGtagHalt).toBeDefined();
  });

  it('a page that never requested or granted anything is left untouched', async () => {
    await runInline(); // no stored choice: nothing queued but the denied default
    setVisible('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    pageshow(true);
    expect(w.__eimsGtagHalt).toBeUndefined();
  });
});
