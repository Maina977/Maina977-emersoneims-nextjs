'use client';

import { Fragment, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { releaseConsentBarSpace, reserveConsentBarSpace } from '@/lib/compliance/consentBarSpace';
// Privacy correction 2026-11-27: choices are applied, and the wording kept, in
// separate modules (consent logic / text pending approval).
import { applyConsentChoice, isConsentGranted, OPEN_COOKIE_SETTINGS_EVENT, takePendingSettingsRequest } from '@/lib/compliance/googleConsent';
import { COOKIE_NOTICE_FULL_PHRASES, COOKIE_NOTICE_SHORT } from '@/lib/compliance/cookieNoticeText';

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
  // No stored choice: ask on the first render.
  // HUB-03 (2026-11-27): the extra 2 s timer that used to sit here is gone.
  // It added nothing for the visitor and made the notice the LAST thing
  // painted on a first visit, so on desktop it became the page's LCP element
  // at 4-5.6 s. Consent is now requested as soon as this component mounts
  // (ClientSideComponents' first tier, unchanged; it is loaded with
  // ssr:false, so window and storage are available here). Nothing is granted
  // until a button is pressed.
  const [showBanner, setShowBanner] = useState(
    () => typeof window !== 'undefined' && !safeGet('cookie-consent'),
  );
  const barRef = useRef<HTMLDivElement | null>(null);

  // "Cookie settings" (footer, privacy page) re-opens the notice at once, so a
  // stored choice can be changed or withdrawn (privacy correction 2026-11-27).
  // While consent is currently granted, the re-opened notice offers an explicit
  // "Withdraw consent" in place of Accept All (management, 27 Nov 2026).
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    const open = () => { setGranted(isConsentGranted()); setShowBanner(true); };
    if (takePendingSettingsRequest()) open();
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
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

  // Explicit withdrawal of an earlier Accept: the same immediate stop as a
  // decline (all four denied, cookies deleted, no further Google sends).
  const withdrawConsent = () => {
    setShowBanner(false);
    setGranted(false);
    applyConsentChoice('withdrawn');
  };

  // Close is NOT a choice (management, 27 Nov 2026): it hides the notice and
  // keeps the stored choice. A first-time visitor who closes stays at no
  // consent, so nothing loads, and is asked again on the next visit.
  const closeNotice = () => setShowBanner(false);

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
          {/*
            LCP (HUB-03, 2026-11-27). Chrome scores text for Largest Contentful
            Paint per block box: every inline run inside one block is added up.
            As one <p>, the long desktop (xl) notice measured 30,747 px², larger
            than the Hub's own caption (26,604 px² on /hub, 10,982 on
            /hub/solar-ups), so a first visit reported the consent notice as the
            page's main content, painted last. Chosen fix: CONSTRAIN THE TEXT
            BLOCK SIZE. At xl the paragraph is a wrapping flex row and the same
            words are set as short phrases ([data-notice-phrase]), each a flex
            item, i.e. its own small block (5,100 px² or less, measured at
            1280-1920 px on a local build). They wrap like ordinary text, in the
            same two lines (bar height unchanged, 61 px). Inline-block phrases
            were tried first and measured: Chrome still added them up into the
            paragraph (20,202 px², still the LCP on /hub/solar-ups), so flex
            items are used. Below xl nothing changes: the paragraph is a normal
            block and phones keep the short wording they already had (10,081
            px², below the Hub captions).
            Rejected: a long timer (that games LCP), fading in from opacity 0,
            content-visibility:hidden or shortening the copy. Nothing is hidden,
            delayed or removed: the notice is fully visible from its first frame,
            all of it is the dialog's description (aria-describedby), and the
            three choices below are unchanged.
          */}
          <p id="cookie-notice-text" className="flex-1 min-w-0 text-gray-300 text-xs md:text-sm leading-snug xl:flex xl:flex-wrap xl:gap-x-[0.25em]">
            <strong id="cookie-notice-title" data-notice-phrase="" className="text-white font-semibold">
              Cookie &amp; Privacy Notice:
            </strong>{' '}
            {/* PENDING management/legal approval (privacy correction 2026-11-27): text in lib/compliance/cookieNoticeText.ts.
                The xl phrases keep the HUB-03 structure above: each is its own flex item. */}
            <span className="xl:hidden">{COOKIE_NOTICE_SHORT}</span>
            <span className="hidden xl:contents">
              {COOKIE_NOTICE_FULL_PHRASES.map((phrase) => (
                // The space between phrases keeps the words apart for screen
                // readers (aria-describedby); the flex gap spaces them visually.
                <Fragment key={phrase}><span data-notice-phrase="">{phrase}</span>{' '}</Fragment>
              ))}
            </span>
            <a href="/privacy" data-notice-phrase="" className="text-cyan-400 hover:text-cyan-300 underline">
              Privacy Policy
            </a>
          </p>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {granted ? (
              <button
                onClick={withdrawConsent}
                className="flex-1 md:flex-none min-h-[44px] px-2 md:px-5 bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs md:text-sm whitespace-nowrap"
              >
                Withdraw consent
              </button>
            ) : (
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
            )}
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
              onClick={closeNotice}
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
