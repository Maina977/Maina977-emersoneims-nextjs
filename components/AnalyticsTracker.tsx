'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * AnalyticsTracker — performance-tuned.
 *
 *  • Fires the pageview through requestIdleCallback so it never competes with
 *    First Contentful Paint or hydration.
 *  • Uses navigator.sendBeacon when available — non-blocking, survives unload.
 *  • Pauses the heartbeat while the document is hidden (saves battery + main
 *    thread on backgrounded tabs).
 *  • Skips entirely on Save-Data / 2g / slow-2g connections.
 *  • Heartbeat dropped from 30s to 60s — half the network chatter, same
 *    fidelity for active-user tracking.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const heartbeatId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname || lastTracked.current === pathname) return;

    // Respect Save-Data / very slow connections — do not add network noise.
    const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') {
      lastTracked.current = pathname;
      return;
    }

    const post = (action: 'pageview' | 'heartbeat') => {
      if (document.hidden) return;
      try {
        const body = JSON.stringify({
          action,
          page: pathname,
          ...(action === 'pageview' ? { referrer: document.referrer } : {}),
        });
        if ('sendBeacon' in navigator) {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics', blob);
        } else {
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => { /* silent */ });
        }
      } catch { /* silent */ }
    };

    const idle = (fn: () => void) => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 2000 });
      else setTimeout(fn, 1500);
    };

    idle(() => post('pageview'));
    lastTracked.current = pathname;

    if (heartbeatId.current) clearInterval(heartbeatId.current);
    heartbeatId.current = setInterval(() => post('heartbeat'), 60_000);

    // ─── Lead-conversion tracking ──────────────────────────────────────────
    // Global click listener: phone, WhatsApp, email, quote, booking & emergency
    // CTAs. Fires a beacon to /api/analytics so Marketing can see real lead
    // signals beyond pageviews.
    const sendLead = (kind: string, target: string, label?: string) => {
      try {
        const body = JSON.stringify({
          action: 'cta_click',
          page: pathname,
          kind,
          target,
          label: label || '',
          ts: Date.now(),
        });
        if ('sendBeacon' in navigator) {
          navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
        } else {
          fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
        }
        // Also push to dataLayer if GTM is present
        const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
        if (Array.isArray(w.dataLayer)) {
          w.dataLayer.push({ event: 'cta_click', cta_kind: kind, cta_target: target, cta_label: label, page: pathname });
        }
      } catch { /* silent */ }
    };

    const onClick = (e: MouseEvent) => {
      const path = (e.composedPath?.() || []) as EventTarget[];
      const el = path.find((n) => n instanceof HTMLAnchorElement || n instanceof HTMLButtonElement) as
        | HTMLAnchorElement
        | HTMLButtonElement
        | undefined;
      if (!el) return;
      const href = (el as HTMLAnchorElement).href || '';
      const text = (el.textContent || '').trim().slice(0, 80);
      const dataCta = el.getAttribute('data-cta') || '';

      let kind = '';
      if (href.startsWith('tel:')) kind = 'phone';
      else if (href.includes('wa.me') || href.includes('api.whatsapp')) kind = 'whatsapp';
      else if (href.startsWith('mailto:')) kind = 'email';
      else if (/\/contact(\?|$|\/)/.test(href) && /quote|consult|emergency/i.test(href + text)) kind = 'quote';
      else if (/\/booking(\?|$|\/)/.test(href)) kind = 'booking';
      else if (dataCta) kind = dataCta;

      if (kind) sendLead(kind, href || el.tagName.toLowerCase(), text);
    };
    document.addEventListener('click', onClick, { capture: true, passive: true });

    return () => {
      if (heartbeatId.current) clearInterval(heartbeatId.current);
      heartbeatId.current = null;
      document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions);
    };
  }, [pathname]);

  return null;
}
