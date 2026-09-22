/**
 * GA4 + GOOGLE ADS — the single place gtag is loaded.
 *
 * WHY THIS FILE EXISTS
 * Before it, this site had no analytics at all. components/analytics/
 * GoogleAnalytics.tsx existed and looked correct, but it was unreachable in
 * three separate ways: NEXT_PUBLIC_GA_ID was never set, the component returns
 * null without it, and nothing rendered it anyway — its only importer was
 * PerformanceProvider, whose only importer is ClientLayout, which is mounted
 * nowhere. Measured on the live homepage and /contact on 2026-09-21: zero
 * occurrences of gtag, dataLayer or googletagmanager.
 *
 * ONE INLINE SCRIPT THAT INJECTS THE LIBRARY ITSELF. This looks like the long
 * way round and is not. Two earlier shapes were built with test IDs and
 * measured in the emitted HTML, and both were wrong:
 *
 *   next/script, both parts afterInteractive
 *       The library (having a src) was emitted server-side; the INLINE part
 *       was handed to the client runtime and injected after hydration. Result
 *       in the HTML: gtag/js present, consent defaults and config absent. The
 *       library would load and be configured by nothing — no page_view, no
 *       conversions, and window.gtag possibly undefined when AnalyticsTracker
 *       looks for it. A tag that loads and reports nothing is worse than no
 *       tag, because the network panel says it is working.
 *
 *   plain <script> elements, inline first then <script async src>
 *       React 19 hoists a script with src into <head>. Measured: library at
 *       byte 3,901 (head), inline block at byte 20,655 (body). Google's
 *       Consent Mode documentation requires the defaults to be set BEFORE
 *       gtag.js is requested, and this reversed that.
 *
 * Creating the library tag from inside the inline block removes the question.
 * The consent defaults are queued, then config, and only then is the library
 * requested — so the order holds regardless of where React decides to place a
 * tag, and regardless of how fast the network answers.
 *
 * CONSENT COMES FIRST, DELIBERATELY. Nothing is stored until a visitor
 * accepts; components/compliance/CookieConsent.tsx sends the 'update' that
 * grants it. wait_for_update gives that banner half a second to answer before
 * tags decide, which stops a race between the banner mounting and the first
 * page_view. ad_user_data and ad_personalization are required by Consent Mode
 * v2 for EEA traffic and are harmless everywhere else.
 *
 * SAFE WHEN UNCONFIGURED. With neither ID set this renders nothing at all —
 * no script, no dataLayer, no cookie. Setting the environment variables is the
 * entire activation step.
 */

import GoogleTagsRouteChange from './GoogleTagsRouteChange';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';

/** Only ever our own IDs reach this, but the shape is checked regardless. */
const safe = (id: string) => /^(G|AW|GT)-[A-Za-z0-9_-]+$/.test(id);

export default function GoogleTags() {
  const ga = safe(GA_ID) ? GA_ID : '';
  const ads = safe(ADS_ID) ? ADS_ID : '';
  if (!ga && !ads) return null;

  // Either tag can fetch the library; whichever is configured is used.
  const loaderId = ga || ads;

  const init = [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    'window.gtag=gtag;',
    "gtag('consent','default',{",
    "analytics_storage:'denied',",
    "ad_storage:'denied',",
    "ad_user_data:'denied',",
    "ad_personalization:'denied',",
    'wait_for_update:500});',
    "gtag('js',new Date());",
    ga ? `gtag('config','${ga}',{send_page_view:true});` : '',
    ads ? `gtag('config','${ads}');` : '',
    // Request the library only after the above is queued.
    "(function(){var s=document.createElement('script');s.async=true;",
    `s.src='https://www.googletagmanager.com/gtag/js?id=${loaderId}';`,
    'document.head.appendChild(s);})();',
  ].join('');

  return (
    <>
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: init }} />
      {ga ? <GoogleTagsRouteChange /> : null}
    </>
  );
}
