/**
 * GOOGLE CONSENT: the one place a visitor's cookie choice is turned into
 * behaviour (privacy correction 2026-11-27).
 *
 * WHY THIS FILE EXISTS
 * Measured on production 235e0e37 on 27 Nov 2026: a first visit with no choice
 * made 11 requests to Google within 8 s (gtag/js, GA4 /g/collect with
 * gcs=G100, googletagmanager /a, pagead2.googlesyndication.com/ccm/collect).
 * components/analytics/GoogleTags.tsx requested the library at 2.5 s whatever
 * the visitor chose ("advanced" Consent Mode). Management decision: optional
 * Google scripts must not load at all until the visitor accepts.
 *
 * WHAT HAPPENS NOW
 *   - Before any choice, after Essential Only, Reject All or Close: the
 *     library is never requested. The gtag stub and the all-denied default
 *     stay queued locally in window.dataLayer and go nowhere.
 *   - Accept All: all four consent states granted, then the library loads
 *     (window.__eimsLoadGtag, defined by the inline script in GoogleTags.tsx).
 *   - Withdrawal (Essential Only / Reject after an Accept, via Cookie
 *     settings): all four states denied, the Google cookies deleted, AND every
 *     further send from this page stopped at once (management, 27 Nov: the
 *     stop must not wait for the next page load). See haltGoogleTransmission.
 *
 * Every choice states all four consent types explicitly; before 27 Nov the
 * decline paths set only analytics_storage and ad_storage.
 */

import { GA4_IDS, GOOGLE_ADS_ID } from '@/lib/analytics/ids';

/** localStorage key and values. Unchanged: stored choices from before stay valid. */
export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const CONSENT_DATE_KEY = 'cookie-consent-date';
export type ConsentChoice = 'accepted' | 'essential' | 'rejected';

export type ConsentState = 'granted' | 'denied';
export interface GoogleConsentStates {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
}

/** Accept All accepts every optional purpose, so all four are granted. */
export const ALL_GRANTED: Readonly<GoogleConsentStates> = Object.freeze({
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
});
export const ALL_DENIED: Readonly<GoogleConsentStates> = Object.freeze({
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

/** Fired by the "Cookie settings" control; CookieConsent re-opens on it. */
export const OPEN_COOKIE_SETTINGS_EVENT = 'eims:open-cookie-settings';

type Gtag = (...args: unknown[]) => void;
interface TagWindow {
  gtag?: Gtag;
  dataLayer?: unknown[] & { push: (...items: unknown[]) => number };
  __eimsLoadGtag?: (now?: boolean) => void;
  __eimsGtagBlocked?: boolean;
  __eimsGtagHalt?: HaltRecord;
  __eimsOpenCookieSettings?: boolean;
  [key: string]: unknown;
}
interface HaltRecord {
  gtag: Gtag | undefined;
  push: ((...items: unknown[]) => number) | null;
  restore: Array<() => void>;
}

const tagWindow = (): TagWindow | null => (typeof window === 'undefined' ? null : (window as unknown as TagWindow));

export function readStoredConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'accepted' || v === 'essential' || v === 'rejected' ? v : null;
  } catch {
    return null; // storage blocked: treated as no consent
  }
}

/** True only while the visitor's current choice is Accept All. */
export function isConsentGranted(): boolean {
  const w = tagWindow();
  if (!w || w.__eimsGtagHalt) return false;
  return readStoredConsent() === 'accepted';
}

/** Every ID gtag could report to on this site. */
function tagIds(): string[] {
  return [...GA4_IDS, GOOGLE_ADS_ID].filter(Boolean);
}

/**
 * Hosts and paths Google tags send to. Matched only while transmission is
 * halted, so nothing else on the site (fonts, maps, our own APIs) is affected.
 */
const GOOGLE_TAG_URL =
  /^(?:https?:)?\/\/(?:[^/?#]*\.)?(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com|googlesyndication\.com|doubleclick\.net|googleadservices\.com)(?:[/?#:]|$)|^(?:https?:)?\/\/(?:www\.)?google\.[a-z.]+\/(?:pagead|ccm|ads|rmkt|g\/collect|measurement)(?:[/?#]|$)/i;

export function isGoogleTagUrl(url: unknown): boolean {
  if (typeof url !== 'string') {
    if (url && typeof (url as { url?: unknown }).url === 'string') return GOOGLE_TAG_URL.test((url as { url: string }).url);
    if (url instanceof URL) return GOOGLE_TAG_URL.test(url.href);
    return false;
  }
  return GOOGLE_TAG_URL.test(url);
}

/**
 * Network guard used only after a withdrawal in a page where the library may
 * already be running. The library keeps its own timers and listeners (engagement
 * pings, enhanced measurement), which no consent flag is guaranteed to silence
 * at once, so the transports it uses are refused for Google tag URLs:
 * fetch, sendBeacon, XMLHttpRequest, and script/img src. Everything else passes
 * through untouched. Each patch records how to undo itself (re-accepting in the
 * same page restores the originals).
 */
function installTransportGuard(w: TagWindow & Window, restore: Array<() => void>): void {
  if (typeof w.fetch === 'function') {
    const origFetch = w.fetch;
    const guarded: typeof fetch = (input, init) =>
      isGoogleTagUrl(input) ? Promise.reject(new TypeError('Blocked: Google consent withdrawn')) : origFetch.call(w, input, init);
    w.fetch = guarded;
    restore.push(() => { if (w.fetch === guarded) w.fetch = origFetch; });
  }
  const nav = w.navigator as Navigator & { sendBeacon?: Navigator['sendBeacon'] };
  if (nav && typeof nav.sendBeacon === 'function') {
    const origBeacon = nav.sendBeacon;
    const guardedBeacon = function (this: Navigator, url: string | URL, data?: BodyInit | null) {
      return isGoogleTagUrl(String(url)) ? false : origBeacon.call(nav, url, data);
    };
    try {
      nav.sendBeacon = guardedBeacon;
      restore.push(() => { if (nav.sendBeacon === guardedBeacon) nav.sendBeacon = origBeacon; });
    } catch { /* read-only in some engines; the other layers still apply */ }
  }
  if (typeof w.XMLHttpRequest === 'function') {
    const proto = w.XMLHttpRequest.prototype;
    const origOpen = proto.open;
    const origSend = proto.send;
    const flag = '__eimsBlocked';
    proto.open = function (this: XMLHttpRequest & Record<string, unknown>, ...args: unknown[]) {
      this[flag] = isGoogleTagUrl(String(args[1]));
      return (origOpen as (...a: unknown[]) => void).apply(this, args);
    } as typeof proto.open;
    proto.send = function (this: XMLHttpRequest & Record<string, unknown>, body?: Document | XMLHttpRequestBodyInit | null) {
      if (this[flag]) return;
      return origSend.call(this, body);
    };
    restore.push(() => { proto.open = origOpen; proto.send = origSend; });
  }
  for (const Ctor of [w.HTMLScriptElement, w.HTMLImageElement, w.HTMLIFrameElement]) {
    if (typeof Ctor !== 'function') continue;
    const proto = Ctor.prototype as HTMLElement;
    const desc = Object.getOwnPropertyDescriptor(proto, 'src');
    if (!desc || !desc.set || !desc.configurable) continue;
    const origSet = desc.set;
    Object.defineProperty(proto, 'src', {
      ...desc,
      set(this: HTMLElement, v: string) {
        if (isGoogleTagUrl(String(v))) return;
        origSet.call(this, v);
      },
    });
    restore.push(() => Object.defineProperty(proto, 'src', desc));
    const origSetAttr = proto.setAttribute;
    if (!Object.prototype.hasOwnProperty.call(proto, 'setAttribute')) {
      const guardedSetAttr = function (this: Element, name: string, value: string) {
        if (String(name).toLowerCase() === 'src' && isGoogleTagUrl(String(value))) return;
        origSetAttr.call(this, name, value);
      };
      Object.defineProperty(proto, 'setAttribute', { value: guardedSetAttr, configurable: true, writable: true });
      restore.push(() => { delete (proto as unknown as Record<string, unknown>).setAttribute; });
    }
  }
}

/**
 * Stops every further optional Google transmission from this page, at once.
 * Layers, in this order:
 *   1. window['ga-disable-<ID>'] = true for every GA4 and Ads ID (Google's
 *      documented per-property opt-out, checked by gtag before each send);
 *   2. block any library load that has not happened yet;
 *   3. consent 'update' with all four states denied, sent to the real gtag so
 *      a running library stops writing cookies;
 *   4. window.gtag and dataLayer.push replaced, so later calls from this
 *      site's code are dropped (every caller looks window.gtag up per call);
 *   5. the transport guard above, for anything the library sends by itself.
 * Idempotent.
 */
export function haltGoogleTransmission(): void {
  const w = tagWindow() as (TagWindow & Window) | null;
  if (!w) return;
  for (const id of tagIds()) w[`ga-disable-${id}`] = true;
  w.__eimsGtagBlocked = true;
  if (w.__eimsGtagHalt) return;

  const realGtag = w.gtag;
  if (typeof realGtag === 'function') realGtag('consent', 'update', { ...ALL_DENIED });

  const dl = w.dataLayer;
  const record: HaltRecord = {
    gtag: realGtag,
    push: dl && Object.prototype.hasOwnProperty.call(dl, 'push') ? dl.push : null,
    restore: [],
  };
  const dropped: Gtag = () => {};
  w.gtag = dropped;
  if (dl) {
    try {
      Object.defineProperty(dl, 'push', { value: () => dl.length, configurable: true, writable: true });
    } catch { /* frozen by the library: layers 1, 3 and 5 still apply */ }
  }
  installTransportGuard(w, record.restore);
  w.__eimsGtagHalt = record;
}

/** Undo haltGoogleTransmission in the same page (the visitor re-accepted). */
function resumeGoogleTransmission(): void {
  const w = tagWindow();
  if (!w) return;
  for (const id of tagIds()) delete w[`ga-disable-${id}`];
  w.__eimsGtagBlocked = false;
  const record = w.__eimsGtagHalt;
  if (!record) return;
  record.restore.reverse().forEach((undo) => { try { undo(); } catch { /* best effort */ } });
  const dl = w.dataLayer;
  if (dl) {
    if (record.push) Object.defineProperty(dl, 'push', { value: record.push, configurable: true, writable: true });
    else delete (dl as unknown as Record<string, unknown>).push;
  }
  w.gtag = record.gtag;
  delete w.__eimsGtagHalt;
}

/** Cookies Google Analytics and Google Ads set on this site's domain. */
const GOOGLE_COOKIE = /^(?:_ga|_ga_.+|_gid|_gat.*|_gcl_.+|_gac_.+)$/;

/**
 * Deletes _ga, _ga_*, _gid, _gat*, _gcl_* and _gac_* for this host and every
 * parent domain (gtag writes them on the top-most domain it can, e.g.
 * .emersoneims.com). Returns the names it found. HttpOnly cookies cannot be
 * reached from script, but gtag's first-party cookies are not HttpOnly.
 */
export function deleteGoogleCookies(doc: Document = document): string[] {
  const names = doc.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => GOOGLE_COOKIE.test(n));
  const host = doc.location?.hostname || '';
  const parts = host.split('.');
  const domains: Array<string | null> = [null];
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join('.');
    domains.push(d, `.${d}`);
  }
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/';
  for (const name of new Set(names)) {
    for (const d of domains) doc.cookie = `${name}=; ${expired}${d ? `; domain=${d}` : ''}`;
  }
  return [...new Set(names)];
}

function store(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    window.localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
  } catch { /* storage blocked: the choice still applies to this page */ }
}

/**
 * Records and applies a choice. Accept grants all four states and then loads
 * the library; any other choice denies all four, deletes the Google cookies
 * and stops further sends (a no-op beyond the denial when nothing had loaded).
 */
export function applyConsentChoice(choice: ConsentChoice): void {
  const w = tagWindow();
  store(choice);
  if (!w) return;
  if (choice === 'accepted') {
    resumeGoogleTransmission();
    if (typeof w.gtag === 'function') w.gtag('consent', 'update', { ...ALL_GRANTED });
    w.__eimsLoadGtag?.(true);
    return;
  }
  // Sends the all-four-denied update (explicit even when nothing has loaded,
  // so the local queue records the decline), then stops further sends.
  haltGoogleTransmission();
  deleteGoogleCookies();
}

/** Re-opens the cookie notice so the visitor can change or withdraw a choice. */
export function openCookieSettings(): void {
  const w = tagWindow();
  if (!w) return;
  // Remembered in case the banner component has not mounted yet (it mounts on idle).
  w.__eimsOpenCookieSettings = true;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

/** Read and clear a settings request made before the banner mounted. */
export function takePendingSettingsRequest(): boolean {
  const w = tagWindow();
  if (!w || !w.__eimsOpenCookieSettings) return false;
  w.__eimsOpenCookieSettings = false;
  return true;
}
