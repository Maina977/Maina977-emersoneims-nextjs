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
 * NO LIBRARY WITHOUT CONSENT (privacy correction 2026-11-27). Until that date
 * the library was requested for every visitor and Google received cookieless
 * pings (IP address, user agent) before any choice: 11 requests in 8 s,
 * measured on production 235e0e37. Now the library is requested only for a
 * returning visitor whose stored choice is Accept All, or when a visitor
 * presses Accept All (lib/compliance/googleConsent.ts calls
 * window.__eimsLoadGtag). Before a choice, and after Essential Only, Reject All
 * or Close, the stub and the all-denied default stay in the local queue and no
 * request is made to any Google host. Withdrawal also stops a library that is
 * already running; see haltGoogleTransmission there.
 *
 * ad_user_data and ad_personalization are required by Consent Mode v2 and are
 * stated on every choice, alongside analytics_storage and ad_storage.
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
    /*
     * PRIVACY CORRECTION 2026-11-27: the library is requested ONLY with consent.
     * Until then everything above stays in the local queue and nothing leaves
     * the browser. A returning visitor who accepted (stored by
     * lib/compliance/googleConsent.ts under the same key as before) has all four
     * states granted here, before any config, so the landing page_view carries
     * the grant. Before this change a returning visitor was never re-granted.
     */
    "var eimsC=null;try{eimsC=localStorage.getItem('cookie-consent');}catch(e){}",
    "var eimsOk=eimsC==='accepted';",
    "if(eimsOk){gtag('consent','update',{",
    "analytics_storage:'granted',",
    "ad_storage:'granted',",
    "ad_user_data:'granted',",
    "ad_personalization:'granted'});}",
    "gtag('js',new Date());",
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
    // Engineering first (Solar stall root cause, 2026-11-22): while a tool module
    // is downloading (window.__eimsEngineeringBusy, set by lib/loading/resilientImport),
    // the tag waits, re-checking each second, for at most 20 s after this script ran,
    // so it always loads. Pages without engineering tools never set the flag:
    // their behaviour is unchanged.
    '(function(){var done=false,cfg=false,armed=false,t0=Date.now();',
    // Every GA4 property (gtag reports to each independently), then Ads. Queued
    // once: at page load for a returning accepted visitor, or right after the
    // grant when a visitor presses Accept All.
    'function config(){if(cfg)return;cfg=true;',
    ...GA4_IDS.map((id) => `gtag('config','${id}',{send_page_view:true});`),
    GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : '',
    '}',
    // window.__eimsGtagBlocked is set on withdrawal (lib/compliance/googleConsent.ts):
    // a load that has not happened yet never happens.
    'function load(){if(done||window.__eimsGtagBlocked)return;',
    'if((window.__eimsEngineeringBusy|0)>0&&Date.now()-t0<20000){setTimeout(load,1000);return;}',
    'done=true;config();',
    "var s=document.createElement('script');s.async=true;",
    `s.src='https://www.googletagmanager.com/gtag/js?id=${loaderId}';`,
    'document.head.appendChild(s);}',
    "var evs=['pointerdown','keydown','scroll','touchstart'];",
    'function go(){evs.forEach(function(e){removeEventListener(e,go)});load();}',
    // Called ONLY with consent: here for a returning accepted visitor (deferred,
    // as before), or by applyConsentChoice('accepted') with now=true (the
    // visitor has just interacted, so there is nothing left to defer for).
    'window.__eimsLoadGtag=function(now){if(done||window.__eimsGtagBlocked)return;',
    'if(now){t0=Date.now();load();return;}',
    'if(armed)return;armed=true;',
    "evs.forEach(function(e){addEventListener(e,go,{once:true,passive:true})});",
    'if(window.requestIdleCallback){requestIdleCallback(load,{timeout:2500});}',
    'else{setTimeout(load,2500);}',
    'setTimeout(load,2500);};',
    'if(eimsOk){config();window.__eimsLoadGtag(false);}',
    '})();',
    /*
     * CA-53 (28 Nov 2026): EARLY cross-tab stop. If the visitor withdraws,
     * rejects or chooses Essential Only in ANOTHER tab before this page's
     * client code has loaded, block the library load and set the ga-disable
     * flags at once, and leave a marker; installCrossTabConsentSync in
     * lib/compliance/googleConsent.ts runs the full stop when it starts (and
     * handles every later change itself). An Accept in another tab is ignored
     * here on purpose: it applies on this tab's next page load.
     */
    "addEventListener('storage',function(e){",
    "if(e.key!=='cookie-consent'&&e.key!==null)return;",
    // localStorage only (as the module listener): a sessionStorage write in a
    // same-origin frame is not the visitor's stored choice.
    'try{if(e.storageArea&&e.storageArea!==localStorage)return;}catch(x){}',
    "if(e.newValue==='accepted')return;",
    'window.__eimsGtagBlocked=true;window.__eimsCrossTabStop=true;',
    ...[...GA4_IDS, GOOGLE_ADS_ID].filter(Boolean).map((id) => `window['ga-disable-${id}']=true;`),
    // CA-53 review, finding 5: a library already running before the client
    // module loads is told the denial at once, not only at module install.
    "if(typeof window.gtag==='function')window.gtag('consent','update',{",
    "analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});",
    '});',
  ].join('');

  return (
    <>
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: init }} />
      {GA4_IDS.length > 0 ? <GoogleTagsRouteChange /> : null}
    </>
  );
}
