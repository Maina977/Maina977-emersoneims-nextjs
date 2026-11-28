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
 *   - Close keeps the stored choice; for a first-time visitor that is no
 *     consent, so nothing loads.
 *   - Withdrawal (Withdraw consent, Essential Only or Reject All after an
 *     Accept, via Cookie settings): all four states denied, the Google cookies deleted, AND every
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
/**
 * 'withdrawn' (management, 27 Nov 2026): the explicit "Withdraw consent"
 * action in the re-opened settings. It behaves as a decline; it is stored as
 * its own value so the record shows the visitor withdrew an earlier Accept.
 * Close is NOT a choice: it keeps whatever was stored (nothing, for a
 * first-time visitor).
 */
export type ConsentChoice = 'accepted' | 'essential' | 'rejected' | 'withdrawn';

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
  /** CA-53: cross-tab listeners installed in this page. */
  __eimsConsentSync?: boolean;
  /** CA-53: set by the inline early listener when another tab withdrew before this module loaded. */
  __eimsCrossTabStop?: boolean;
  [key: string]: unknown;
}
interface HaltRecord {
  gtag: Gtag | undefined;
  push: ((...items: unknown[]) => number) | null;
  restore: Array<() => void>;
  /** The no-op installed as window.gtag by this halt. */
  dropped: Gtag;
  /** Queued config commands taken out before the library read them (CA-53 review, finding 1). */
  purgedConfigs: unknown[];
  /** A dataLayer.push the library tried to install while stopped (ignored until a re-accept). */
  capturedPush?: ((...items: unknown[]) => number) | null;
}

const tagWindow = (): TagWindow | null => (typeof window === 'undefined' ? null : (window as unknown as TagWindow));

export function readStoredConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'accepted' || v === 'essential' || v === 'rejected' || v === 'withdrawn' ? v : null;
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
  let carried: unknown[] = [];
  if (w.__eimsGtagHalt) {
    // Already halted. If something has installed a new window.gtag since the
    // halt, undo the old halt and halt again, so the new function also gets
    // the denial and is neutralised.
    if (w.gtag === w.__eimsGtagHalt.dropped) return;
    const current = w.gtag;
    carried = w.__eimsGtagHalt.purgedConfigs;
    resumeGoogleTransmission();
    w.gtag = current;
    w.__eimsGtagBlocked = true;
    for (const id of tagIds()) w[`ga-disable-${id}`] = true;
  }

  const realGtag = w.gtag;
  // CA-53 review, finding 1: a library that is still downloading has not read
  // the queue yet. Take out the queued grant, config and event commands first,
  // so when it does run it never sees a grant or a config (which is what writes
  // _gcl_au / _ga). Kept in the record: a later Accept in THIS tab puts the
  // configs back after its fresh grant (see applyConsentChoice).
  const purgedConfigs = [...carried, ...(libraryRunning(w) ? [] : purgeQueuedGrants(w.dataLayer))];
  if (typeof realGtag === 'function') realGtag('consent', 'update', { ...ALL_DENIED });

  const dl = w.dataLayer;
  const dropped: Gtag = () => {};
  const record: HaltRecord = {
    gtag: realGtag,
    push: dl && Object.prototype.hasOwnProperty.call(dl, 'push') ? dl.push : null,
    restore: [],
    dropped,
    purgedConfigs,
  };
  // window.gtag stays a plain writable property: the inline script declares
  // gtag as a global function, which makes window.gtag non-configurable, so it
  // cannot be redefined. The library does not replace window.gtag; it replaces
  // dataLayer.push, and that is locked below.
  w.gtag = dropped;
  if (dl) {
    try {
      // Finding 1: an accessor whose setter ignores assignment, so a library
      // that loads after the halt cannot install its own push (assignment is
      // silently ignored, also in strict mode). Configurable, so a later Accept
      // in this tab can restore the original.
      // The push the library tried to install is kept (never called while
      // stopped), so a re-accept in this tab hands the queue back to it.
      const noopPush = () => dl.length;
      Object.defineProperty(dl, 'push', {
        get: () => noopPush,
        set: (v: unknown) => { if (typeof v === 'function') record.capturedPush = v as HaltRecord['push']; },
        configurable: true,
      });
    } catch { /* frozen by the library: layers 1, 3 and 5 still apply */ }
  }
  installTransportGuard(w, record.restore);
  w.__eimsGtagHalt = record;
  watchPendingLibrary(w);
}

/** True once gtag.js has executed in this page (it defines these globals). */
function libraryRunning(w: TagWindow): boolean {
  return !!(w.google_tag_manager || w.google_tag_data);
}

/**
 * Removes queued `consent update` grants, `config` and `event` commands from
 * a dataLayer the library has not read yet. Returns the removed configs.
 */
function purgeQueuedGrants(dl: TagWindow['dataLayer']): unknown[] {
  if (!dl || !Array.isArray(dl)) return [];
  const configs: unknown[] = [];
  const keep: unknown[] = [];
  for (const item of dl) {
    const a = item && typeof item === 'object' && 'length' in (item as object) ? Array.from(item as ArrayLike<unknown>) : null;
    const cmd = a ? a[0] : null;
    const isGrant = cmd === 'consent' && a![1] === 'update' && a![2] && Object.values(a![2] as object).includes('granted');
    if (cmd === 'config') configs.push(item);
    if (cmd === 'config' || cmd === 'event' || isGrant) continue;
    keep.push(item);
  }
  if (keep.length !== dl.length) {
    dl.length = 0;
    Array.prototype.push.apply(dl, keep);
  }
  return configs;
}

/**
 * Finding 1: if a Google tag script is still downloading when the page is
 * stopped, the request has already left and cannot be recalled. When it
 * finishes (load or error), and the page is still stopped, run the stop again
 * and wipe the Google cookies, then once more shortly after, in case the
 * library wrote one during its first run.
 */
function watchPendingLibrary(w: TagWindow & Window): void {
  const doc = w.document;
  if (!doc) return;
  const scripts = Array.from(doc.querySelectorAll('script[src]')).filter((s) => isGoogleTagUrl(s.getAttribute('src') || ''));
  for (const s of scripts) {
    const el = s as HTMLScriptElement & { __eimsHaltWatch?: boolean };
    if (el.__eimsHaltWatch) continue;
    el.__eimsHaltWatch = true;
    const after = () => {
      if (!w.__eimsGtagHalt) return; // re-accepted in this tab meanwhile
      haltGoogleTransmission();
      deleteGoogleCookies(doc);
      for (const ms of [500, 2000]) {
        setTimeout(() => { if (w.__eimsGtagHalt) deleteGoogleCookies(doc); }, ms);
      }
    };
    el.addEventListener('load', after, { once: true });
    el.addEventListener('error', after, { once: true });
  }
}

/**
 * Undo haltGoogleTransmission in the same page (the visitor re-accepted).
 * Returns the config commands the halt took out of the queue, for the caller
 * to queue again AFTER its grant.
 */
function resumeGoogleTransmission(): unknown[] {
  const w = tagWindow();
  if (!w) return [];
  for (const id of tagIds()) delete w[`ga-disable-${id}`];
  w.__eimsGtagBlocked = false;
  const record = w.__eimsGtagHalt;
  if (!record) return [];
  record.restore.reverse().forEach((undo) => { try { undo(); } catch { /* best effort */ } });
  const dl = w.dataLayer;
  if (dl) {
    const push = record.capturedPush || record.push;
    if (push) Object.defineProperty(dl, 'push', { value: push, configurable: true, writable: true });
    else delete (dl as unknown as Record<string, unknown>).push;
  }
  w.gtag = record.gtag;
  delete w.__eimsGtagHalt;
  return record.purgedConfigs || [];
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
  // CA-53: tell every other open tab of this site (see installCrossTabConsentSync).
  broadcastChoice(choice);
  if (choice === 'accepted') {
    const configs = resumeGoogleTransmission();
    if (typeof w.gtag === 'function') w.gtag('consent', 'update', { ...ALL_GRANTED });
    // Configs a halt took out of the queue go back in, after the grant, so a
    // re-accept in this tab measures exactly as it did before (same-tab
    // Accept-after-withdraw semantics unchanged).
    if (configs.length && w.dataLayer) for (const c of configs) w.dataLayer.push(c);
    w.__eimsLoadGtag?.(true);
    return;
  }
  // Sends the all-four-denied update (explicit even when nothing has loaded,
  // so the local queue records the decline), then stops further sends.
  haltGoogleTransmission();
  deleteGoogleCookies();
}

/* ------------------------------------------------------------------------
 * CROSS-TAB WITHDRAWAL (CA-53, 28 Nov 2026)
 *
 * Before this, a withdrawal, Reject All or Essential Only stopped Google sends
 * only in the tab where the button was pressed. Any other tab of the site that
 * was already open (and had accepted) kept measuring until it was reloaded.
 *
 * Two signals, both handled by the same code:
 *   - the 'storage' event on 'cookie-consent', which the browser fires in every
 *     OTHER tab of this origin when the stored choice changes;
 *   - BroadcastChannel('eims-consent'), posted by applyConsentChoice. It also
 *     covers a choice that does not change the stored value (for example
 *     Essential Only pressed again), which fires no storage event.
 * One channel object per tab is used for both sending and receiving, so a tab
 * never receives its own message.
 *
 * On a withdrawn, rejected or essential choice from another tab (or the key
 * being removed, which is no consent), this tab runs the SAME full stop as a
 * withdrawal pressed here: all four states denied, ga-disable flags, gtag and
 * dataLayer neutralised, the transport guard, Google cookies deleted.
 *
 * DELIBERATE CHOICE: an Accept recorded in another tab does NOT start tags in
 * this tab. Starting measurement in a page the visitor is not looking at, on
 * the strength of a click elsewhere, is the riskier direction; the Accept is
 * applied only on this tab's next full page load (the inline script in
 * GoogleTags.tsx reads the stored choice), or when Accept is pressed in this
 * tab. Stopping is always applied at once; starting never is.
 *
 * RECONCILE (CA-53 review, finding 2): a page restored from the back/forward
 * cache, or one that missed an event, is checked again on 'pageshow'
 * (persisted) and on 'visibilitychange' to visible. If the stored choice is no
 * longer Accept and the page is not stopped yet, it is stopped. This check
 * only ever stops.
 * ---------------------------------------------------------------------- */
export const CONSENT_CHANNEL_NAME = 'eims-consent';
interface ConsentMessage { type: 'eims-consent'; choice: ConsentChoice }

let consentChannel: BroadcastChannel | null = null;
function channel(): BroadcastChannel | null {
  if (consentChannel) return consentChannel;
  try {
    if (typeof BroadcastChannel === 'function') {
      consentChannel = new BroadcastChannel(CONSENT_CHANNEL_NAME);
      // Node (test runner) only: do not keep the process alive. Absent in browsers.
      (consentChannel as unknown as { unref?: () => void }).unref?.();
    }
  } catch { /* unsupported or blocked: the storage event still applies */ }
  return consentChannel;
}

function broadcastChoice(choice: ConsentChoice): void {
  try {
    const msg: ConsentMessage = { type: 'eims-consent', choice };
    channel()?.postMessage(msg);
  } catch { /* best effort: the storage event still applies */ }
}

const isChoice = (v: unknown): v is ConsentChoice =>
  v === 'accepted' || v === 'essential' || v === 'rejected' || v === 'withdrawn';

/**
 * Applies a choice recorded in ANOTHER tab to this one. Does not store or
 * re-broadcast (the other tab already did). null means the stored choice was
 * removed, which is no consent, so it stops too. 'accepted' is ignored on
 * purpose; see the note above.
 */
export function applyChoiceFromOtherTab(choice: ConsentChoice | null): void {
  if (choice === 'accepted') return; // never start tags from another tab's click
  if (!tagWindow()) return;
  haltGoogleTransmission();
  deleteGoogleCookies();
}

/**
 * Starts listening for choices made in other tabs. Idempotent per page; the
 * listeners live for the page's lifetime (the consent state is page-wide, not
 * tied to a component). Called by the client components that mount on every
 * page (GoogleTagsRouteChange, CookieConsent).
 *
 * If the early listener in the inline gtag-init script (GoogleTags.tsx) saw a
 * withdrawal before this module loaded, it has already blocked the library
 * load and set the ga-disable flags; the full stop runs here.
 */
export function installCrossTabConsentSync(): void {
  const w = tagWindow();
  if (!w || w.__eimsConsentSync) return;
  w.__eimsConsentSync = true;

  window.addEventListener('storage', (e: StorageEvent) => {
    // key null: localStorage.clear() in another tab (no consent any more).
    if (e.key !== CONSENT_STORAGE_KEY && e.key !== null) return;
    if (e.storageArea && e.storageArea !== safeLocalStorage()) return;
    applyChoiceFromOtherTab(isChoice(e.newValue) ? e.newValue : null);
  });

  const ch = channel();
  if (ch) {
    ch.addEventListener('message', (e: MessageEvent) => {
      const data = e.data as Partial<ConsentMessage> | null;
      if (!data || data.type !== 'eims-consent' || !isChoice(data.choice)) return;
      applyChoiceFromOtherTab(data.choice);
    });
  }

  // Finding 2: back/forward-cache restore and any missed event.
  const reconcile = () => {
    if (w.__eimsGtagHalt) return;
    if (readStoredConsent() === 'accepted') return;
    if (!pageMayMeasure(w)) return; // nothing was ever requested or granted here: nothing to stop
    applyChoiceFromOtherTab(null);
  };
  window.addEventListener('pageshow', (e: PageTransitionEvent) => { if (e.persisted) reconcile(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reconcile(); });

  if (w.__eimsCrossTabStop) applyChoiceFromOtherTab(null);
}

/**
 * True when this page could be sending to Google: a Google tag script was
 * requested, the library has run, or a grant was queued. A page with none of
 * these (a visitor who never accepted) has nothing to stop, so the reconcile
 * check leaves it untouched.
 */
function pageMayMeasure(w: TagWindow): boolean {
  if (libraryRunning(w)) return true;
  if (Array.from(document.querySelectorAll('script[src]')).some((s) => isGoogleTagUrl(s.getAttribute('src') || ''))) return true;
  return (w.dataLayer || []).some((item) => {
    const a = item && typeof item === 'object' && 'length' in (item as object) ? Array.from(item as ArrayLike<unknown>) : null;
    return !!a && a[0] === 'consent' && a[1] === 'update' && !!a[2] && Object.values(a[2] as object).includes('granted');
  });
}

function safeLocalStorage(): Storage | null {
  try { return window.localStorage; } catch { return null; }
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
