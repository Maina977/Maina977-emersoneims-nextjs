'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { releaseConsentBarSpace, reserveConsentBarSpace } from '@/lib/compliance/consentBarSpace';
// Privacy correction 2026-11-27: choices are applied, and the wording kept, in
// separate modules (consent logic / text pending approval).
import { applyConsentChoice, OPEN_COOKIE_SETTINGS_EVENT, takePendingSettingsRequest } from '@/lib/compliance/googleConsent';
import { COOKIE_NOTICE_FULL, COOKIE_NOTICE_SHORT } from '@/lib/compliance/cookieNoticeText';

/**
 * Cookie Consent Banner - GDPR Compliance
 * Shows on first visit, stores preference in localStorage.
 *
 * IMPORTANT: every localStorage access is wrapped. Edge's Tracking Prevention
 * (and Firefox/Brave strict modes, private windows with storage blocked, etc.)
 * makes even *reading* `localStorage` throw a SecurityError. Because this banner
 * is mounted site-wide, an unguarded access here threw inside a passive effect
 * and took the WHOLE page down via the error boundary ("Oops! Error"). Guard
 * everything so blocked storage degrades to "banner just shows" instead of a crash.
 */
function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* storage blocked — ignore */ }
}

// Layout effect in the browser (no server warning): the reservation is written
// before the banner's first frame is painted, so floating controls and padding
// are already in place when the banner appears (layout shift fix 2026-11-22).
const useBeforePaintEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  // "Cookie settings" (footer, privacy page) re-opens the notice at once, so a
  // stored choice can be changed or withdrawn (privacy correction 2026-11-27).
  useEffect(() => {
    const open = () => setShowBanner(true);
    if (takePendingSettingsRequest()) open();
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    // Check if user has already consented
    const consent = safeGet('cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      const t = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptCookies = () => {
    safeSet('cookie-consent', 'accepted');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);

    // Initialize analytics after consent
    if (typeof window !== 'undefined') {
      /*
       * ad_storage was pinned to 'denied' here with the note "We don't use
       * ads". That changed on 2026-09-22: the business is advertising through
       * Google Ads, and a denied ad_storage means conversions cannot be
       * attributed to a click — the campaign would spend without ever
       * reporting what it produced.
       *
       * This fires only from acceptCookies(), i.e. after the visitor has
       * pressed Accept. Declining still denies everything below.
       *
       * 2026-11-27: grants all four states, THEN loads the library (it is no
       * longer loaded before consent). See lib/compliance/googleConsent.ts.
       */
      applyConsentChoice('accepted');
    }
  };

  // 2026-11-27: both decline paths deny all four consent states explicitly
  // (before, only analytics_storage and ad_storage), delete the Google cookies
  // and stop any further Google sends from this page (withdrawal).
  const declineCookies = () => {
    safeSet('cookie-consent', 'essential');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    if (typeof window !== 'undefined') applyConsentChoice('essential');
  };

  const rejectAllCookies = () => {
    safeSet('cookie-consent', 'rejected');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    if (typeof window !== 'undefined') applyConsentChoice('rejected');
  };

  /*
   * Reserve the bar's height at the bottom of the page while it is visible
   * (lib/compliance/consentBarSpace.ts explains the CSS that uses it), so no
   * tool result or button can end up permanently behind the banner. Measured
   * with a ResizeObserver, so text wrapping, zoom and rotation stay in step.
   * Released on dismiss and on unmount, so the space goes when the bar does.
   */
  useBeforePaintEffect(() => {
    const root = document.documentElement;
    if (!showBanner) {
      releaseConsentBarSpace(root);
      return;
    }
    const el = barRef.current;
    if (!el) return;

    const publish = () => {
      reserveConsentBarSpace(root, el.getBoundingClientRect().height);
    };
    publish();

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(publish);
      ro.observe(el);
    }
    window.addEventListener('resize', publish);
    window.addEventListener('orientationchange', publish);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', publish);
      window.removeEventListener('orientationchange', publish);
      releaseConsentBarSpace(root);
    };
  }, [showBanner]);

  if (!showBanner) return null;

  // Mobile UX audit 2026-07-10: on a 390px phone this banner rendered 326px
  // tall -- with the floating accessibility button it covered 54% of every
  // first-time visitor's screen.
  // 2026-11-21 ("must not obscure tool results or actions"): now one slim row
  // on desktop (title inline, no emoji/heading block) and a short wrapped line
  // plus one row of buttons on phones. Every button keeps a 44px touch target,
  // and the three choices are the same size so Reject is as easy as Accept.
  // It is a NON-modal dialog: no focus trap, the page stays usable, and its
  // height is reserved at the bottom of the page (see the effect above).
  // z-[45]: above floating widgets' z-40 layer, but BELOW full-screen modal
  // overlays (z-50) a visitor opens on a tool, so the banner can never cover a
  // modal's own action buttons; it is back in view as soon as the modal closes.
  return (
    <div
      ref={barRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-notice-title"
      aria-describedby="cookie-notice-text"
      className="fixed bottom-0 left-0 right-0 z-[45] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4 bg-gradient-to-r from-gray-900 to-black border-t border-cyan-500/30 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <p id="cookie-notice-text" className="flex-1 min-w-0 text-gray-300 text-xs md:text-sm leading-snug">
            <strong id="cookie-notice-title" className="text-white font-semibold">
              Cookie &amp; Privacy Notice:
            </strong>{' '}
            {/* PENDING management/legal approval (privacy correction 2026-11-27): text in lib/compliance/cookieNoticeText.ts */}
            <span className="xl:hidden">{COOKIE_NOTICE_SHORT}</span>
            <span className="hidden xl:inline">{COOKIE_NOTICE_FULL}</span>
            <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
              Privacy Policy
            </a>
          </p>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none min-h-[44px] px-2 md:px-5 bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs md:text-sm whitespace-nowrap"
              // Must CONTAIN the visible text "Accept All" (WCAG 2.5.3), or
              // voice control cannot target the button by what it says.
              // "Accept cookies" did not contain it.
              aria-label="Accept All cookies"
            >
              Accept All
            </button>
            <button
              onClick={declineCookies}
              className="flex-1 md:flex-none min-h-[44px] px-2 md:px-5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-xs md:text-sm whitespace-nowrap"
              // Must contain the visible text "Essential Only" (WCAG 2.5.3).
              // "Allow only essential cookies" did not, so voice control could
              // not activate the button by the words printed on it.
              aria-label="Essential Only cookies"
            >
              Essential Only
            </button>
            <button
              onClick={rejectAllCookies}
              className="flex-1 md:flex-none min-h-[44px] px-2 md:px-5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-xs md:text-sm whitespace-nowrap"
              aria-label="Reject all cookies"
            >
              Reject All
            </button>
            <button
              onClick={declineCookies}
              className="hidden md:flex items-center justify-center min-h-[44px] min-w-[44px] text-gray-400 hover:text-white transition-colors"
              aria-label="Close cookie notice"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
