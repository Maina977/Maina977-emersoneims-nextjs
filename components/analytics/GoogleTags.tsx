/**
 * GA4 + GOOGLE ADS — the single place gtag is loaded.
 *
 * WHY THIS FILE EXISTS
 * Before it, this site had no analytics at all. components/analytics/
 * GoogleAnalytics.tsx existed and read correctly, but was unreachable three
 * times over: NEXT_PUBLIC_GA_ID was never set, the component returns null
 * without it, and nothing rendered it anyway — its only importer was
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
 *       was handed to the client runtime and injected after hydration. In the
 *       HTML: gtag/js present, consent defaults and config ABSENT. The library
 *       would load and be configured by nothing — no page_view, no
 *       conversions, window.gtag possibly undefined when AnalyticsTracker
 *       looks for it. A tag that loads and reports nothing is worse than no
 *       tag, because the network panel says it is working.
 *
 *   plain <script> tags, inline first, then <script async src>
 *       React 19 hoists a script with src into <head>. Measured: library at
 *       byte 3,901 (head), inline block at byte 20,655 (body) — reversing the
 *       order Consent Mode requires.
 *
 * Creating the library tag from inside the inline block removes the question:
 * consent defaults are queued, then config, and only then is the library
 * requested. The order holds wherever React places a tag and however fast the
 * network answers.
 *
 * CONSENT COMES FIRST, DELIBERATELY. Nothing is stored until a visitor
 * accepts; components/compliance/CookieConsent.tsx sends the 'update' that
 * grants it. wait_for_update gives that banner half a second to answer before
 * tags decide. ad_user_data and ad_personalization are required by Consent
 * Mode v2 for EEA traffic and are harmless everywhere else.
 *
 * IDS LIVE IN lib/analytics/ids.ts, in source rather than in the environment,
 * because a Measurement ID is public by design — see the note there.
 */

import GoogleTagsRouteChange from './GoogleTagsRouteChange';
import { GA4_IDS, GOOGLE_ADS_ID, HAS_GOOGLE_TAGS } from '@/lib/analytics/ids';

export default function GoogleTags() {
  if (!HAS_GOOGLE_TAGS) return null;

  // Either tag can fetch the library; whichever is configured is used.
  const loaderId = GA4_IDS[0] || GOOGLE_ADS_ID;

  const init = [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    'window.gtag=gtag;',
    // Denied until the banner says otherwise.
    "gtag('consent','default',{",
    "analytics_storage:'denied',",
    "ad_storage:'denied',",
    "ad_user_data:'denied',",
    "ad_personalization:'denied',",
    'wait_for_update:500});',
    "gtag('js',new Date());",
    // Every GA4 property. gtag reports to each independently.
    ...GA4_IDS.map((id) => `gtag('config','${id}',{send_page_view:true});`),
    GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : '',
    // Request the library only after the above is queued.
    "(function(){var s=document.createElement('script');s.async=true;",
    `s.src='https://www.googletagmanager.com/gtag/js?id=${loaderId}';`,
    'document.head.appendChild(s);})();',
  ].join('');

  return (
    <>
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: init }} />
      {GA4_IDS.length > 0 ? <GoogleTagsRouteChange /> : null}
    </>
  );
}
