'use client';

import { useEffect, useRef } from 'react';
import { GOOGLE_ADS_ID, GOOGLE_ADS_CONTACT_LABEL } from '@/lib/analytics/ids';
import { usePathname } from 'next/navigation';

/**
 * AnalyticsTracker — performance-tuned, first-party analytics beacon.
 *
 * Sends three event types to /api/analytics/collect:
 *   • pageview — one per pathname change, fired via requestIdleCallback so it
 *     never competes with First Contentful Paint or hydration.
 *   • click    — CTA / lead clicks (phone, WhatsApp, email, tools, buttons).
 *   • ping     — 60s presence heartbeat; the store counts it ONLY toward
 *     live-visitor presence, NOT toward pageviews, so it never inflates views.
 *
 * Performance behaviours preserved:
 *   • navigator.sendBeacon when available (non-blocking, survives unload),
 *     fetch keepalive fallback otherwise.
 *   • Skips entirely on Save-Data / 2g / slow-2g connections.
 *   • Pauses the heartbeat while the document is hidden.
 *   • 60s heartbeat interval, cleared on unmount.
 */

const COLLECT_ENDPOINT = '/api/analytics/collect';

// CTA selector — anything that signals a lead / engagement action.
const CTA_SELECTOR =
  "a[data-track], a[href*='wa.me'], a[href*='whatsapp'], a[href*='tel:'], a.tool, a.wa, a.cta, button[data-track], [data-cta]";

type Payload =
  | { t: 'pageview'; p: string; h: string; r: string }
  | { t: 'click'; p: string; h: string; label: string }
  | { t: 'ping'; p: string; h: string };

/** True when we should stay quiet (Save-Data / very slow connections). */
function shouldSkip(): boolean {
  const conn = (navigator as unknown as {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;
  return !!(
    conn?.saveData ||
    conn?.effectiveType === '2g' ||
    conn?.effectiveType === 'slow-2g'
  );
}

/**
 * Single shared sender: builds a JSON Blob and ships it via sendBeacon, falling
 * back to fetch keepalive. Wrapped so it can never throw into caller code.
 */
function send(payload: Payload): void {
  try {
    if (shouldSkip()) return;
    const body = JSON.stringify(payload);
    if ('sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(COLLECT_ENDPOINT, blob);
    } else {
      fetch(COLLECT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        /* silent */
      });
    }
  } catch {
    /* silent — analytics must never break the page */
  }
}

/** Run a callback when the main thread is idle (or soon, as a fallback). */
function idle(fn: () => void): void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 2000 });
  else setTimeout(fn, 1500);
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const heartbeatId = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Pageview + presence heartbeat ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Dedupe: same path on a re-render must not double-count.
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Referrer hostname only (privacy-friendly, never the full URL).
    let referrerHostname = '';
    try {
      referrerHostname = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {
      referrerHostname = '';
    }

    // Fire the pageview off the critical path.
    idle(() => {
      if (document.hidden) return;
      send({
        t: 'pageview',
        p: pathname,
        h: location.hostname,
        r: referrerHostname,
      });
    });

    // (Re)start the presence heartbeat for the current path. Paused while the
    // tab is hidden; counted only toward live-visitor presence by the store.
    if (heartbeatId.current) clearInterval(heartbeatId.current);
    heartbeatId.current = setInterval(() => {
      if (document.hidden) return;
      send({ t: 'ping', p: location.pathname, h: location.hostname });
    }, 60_000);

    return () => {
      if (heartbeatId.current) clearInterval(heartbeatId.current);
      heartbeatId.current = null;
    };
  }, [pathname]);

  // ─── CTA click tracking ─────────────────────────────────────────────────
  // Single capture-phase, passive listener added once on mount. Purely
  // observational — never preventDefault / blocks the click.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return; // guard null / non-element
      const el = target.closest(CTA_SELECTOR) as HTMLElement | null;
      if (!el) return;

      const label = (
        el.getAttribute('data-track') ||
        el.textContent ||
        el.getAttribute('href') ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 60);

      send({ t: 'click', p: location.pathname, h: location.hostname, label });

      /*
       * The same click, reported to GA4 and Google Ads.
       *
       * The first-party beacon above feeds our own dashboard and cannot reach
       * Google, so without this an ad campaign has nothing to optimise
       * toward. These are the actions that are actually worth money on this
       * site — a phone call, a WhatsApp message, an email — so they are named
       * rather than lumped into one generic event.
       *
       * Guarded on gtag existing: with no measurement ID configured,
       * components/analytics/GoogleTags.tsx renders nothing, window.gtag is
       * undefined and this is a no-op.
       */
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      if (typeof w.gtag === 'function') {
        const href = (el.getAttribute('href') || '').toLowerCase();
        const action =
          href.startsWith('tel:') ? 'contact_phone'
          : /wa\.me|whatsapp/.test(href) ? 'contact_whatsapp'
          : href.startsWith('mailto:') ? 'contact_email'
          : 'cta_click';

        w.gtag('event', action, {
          event_category: 'engagement',
          event_label: label,
          page_path: location.pathname,
        });

        /*
         * The Google Ads conversion itself. It needs a conversion ID AND the
         * label of a conversion action created inside the Ads account, in the
         * form AW-123456789/AbC-D_efGh. Without the label no conversion can
         * be sent, so this stays silent until it is configured.
         */
        const convId = GOOGLE_ADS_ID;
        const convLabel = GOOGLE_ADS_CONTACT_LABEL;
        if (convId && convLabel && action !== 'cta_click') {
          w.gtag('event', 'conversion', { send_to: `${convId}/${convLabel}` });
        }
      }
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', onClick, {
        capture: true,
      } as EventListenerOptions);
    };
  }, []);

  return null;
}
