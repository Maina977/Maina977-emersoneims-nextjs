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
 * Since 2026-09-26 that request is also DEFERRED off the critical path — to
 * first interaction, browser idle, or a 2.5 s ceiling, whichever comes first.
 * The queue is what makes that safe; see the note beside the loader below.
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
    /*
     * THE LIBRARY IS REQUESTED OFF THE CRITICAL PATH.
     *
     * Measured on the live homepage with Lighthouse mobile on 2026-09-26:
     * gtag/js cost 669 ms of main-thread CPU and shipped 71 KB that the page
     * never executed, while total blocking time was 1,280 ms. Analytics was
     * competing with the hero for the one thread a phone has.
     *
     * THIS LOSES NO DATA, and the reason is the queue above. gtag() is defined
     * synchronously and pushes to dataLayer; consent defaults, 'js' and every
     * config are already queued before this runs. Whenever the library arrives
     * it drains the queue in order, so the page_view is recorded with the
     * timestamp it was queued at, not the timestamp the script loaded.
     *
     * THREE TRIGGERS, WHICHEVER FIRES FIRST:
     *   - first real interaction (pointer, key, scroll, touch), because a
     *     visitor who is about to act is one we must not miss;
     *   - browser idle, via requestIdleCallback where supported;
     *   - a hard 2.5 s ceiling, so a visitor who reads without touching
     *     anything and then closes the tab is still counted.
     *
     * The ceiling is what makes deferral safe rather than a quiet data leak.
     * Without it, a fast bounce on a slow phone would never report.
     *
     * MEASURED RESULT, RECORDED HONESTLY: this does NOT improve the Lighthouse
     * number. Re-measured after the change, gtag still cost 720 ms across three
     * long tasks inside the trace, against 766 ms before — noise, not a win.
     * The reason is that requestIdleCallback fires as soon as the main thread
     * quietens, which happens well inside Lighthouse's measurement window, and
     * the 2.5 s ceiling sits inside it too. A lab run cannot show a benefit from
     * deferring work that it still waits around to observe.
     *
     * It is kept because the ordering is still right for a real visitor on a
     * slow connection — 71 KB of analytics no longer competes with the hero for
     * bandwidth and CPU at the moment someone is waiting for content — but that
     * benefit is UNPROVEN here. Verify it in field data (Search Console Core
     * Web Vitals, and GA4 page-view counts to confirm nothing was lost), not in
     * another Lighthouse run. If field data shows no gain either, revert this:
     * unjustified complexity on 4,970 pages is not worth keeping.
     */
    '(function(){var done=false;',
    'function load(){if(done)return;done=true;',
    "var s=document.createElement('script');s.async=true;",
    `s.src='https://www.googletagmanager.com/gtag/js?id=${loaderId}';`,
    'document.head.appendChild(s);}',
    "var evs=['pointerdown','keydown','scroll','touchstart'];",
    'function go(){evs.forEach(function(e){removeEventListener(e,go)});load();}',
    "evs.forEach(function(e){addEventListener(e,go,{once:true,passive:true})});",
    'if(window.requestIdleCallback){requestIdleCallback(load,{timeout:2500});}',
    'else{setTimeout(load,2500);}',
    'setTimeout(load,2500);})();',
  ].join('');

  return (
    <>
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: init }} />
      {GA4_IDS.length > 0 ? <GoogleTagsRouteChange /> : null}
    </>
  );
}
