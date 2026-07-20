'use client';

/**
 * WebVitalsReporter — real-user Core Web Vitals into first-party analytics.
 *
 * WHY THIS EXISTS (audit 2026-07-20):
 * The repo already contained TWO web-vitals implementations and NEITHER ran:
 *
 *   • app/webVitalsReporter.ts — never imported by anything, and even if it
 *     had been, it only console.log()s. It never transmitted a single sample.
 *   • components/analytics/ComprehensiveAnalytics.tsx — does call onLCP/onINP
 *     etc., but its mount chain is ClientLayout -> PerformanceProvider ->
 *     ComprehensiveAnalytics, and ClientLayout is never mounted anywhere.
 *
 * So the site reported no field performance data at all, and every statement
 * about our Core Web Vitals was a lab guess. This component closes that gap.
 *
 * DESIGN NOTES
 * - Uses Next's built-in `useReportWebVitals`, so no new dependency is added
 *   and the metrics arrive already wired to the App Router lifecycle.
 * - Ships on the SAME first-party path as the rest of our analytics
 *   (/api/analytics/collect via sendBeacon), so it is cookieless, needs no
 *   third-party script, and adds no render-blocking request.
 * - sendBeacon is fire-and-forget and survives page unload, which matters
 *   because CLS and INP are only final at unload.
 * - Bot/lab traffic is already filtered server-side by store.ts's BOT_RE,
 *   which matches "lighthouse" and "headless" — so PageSpeed runs cannot
 *   pollute the field data.
 *
 * READING THE DATA
 * Samples land as rows with type='vitals' and label='<METRIC>:<value>'.
 * Values are milliseconds except CLS, which is unitless. Google's thresholds:
 *   LCP  good <=2500ms   poor >4000ms
 *   INP  good <=200ms    poor >500ms
 *   CLS  good <=0.1      poor >0.25
 */

import { useReportWebVitals } from 'next/web-vitals';

/** Metrics we store. FCP/TTFB are diagnostic rather than ranking factors. */
const REPORTED = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!REPORTED.has(metric.name)) return;

    // CLS is a small unitless score, so it needs decimals; every other metric
    // is milliseconds where sub-millisecond precision is noise.
    const value =
      metric.name === 'CLS' ? metric.value.toFixed(3) : String(Math.round(metric.value));

    const body = JSON.stringify({
      t: 'vitals',
      p: window.location.pathname,
      label: `${metric.name}:${value}`,
    });

    try {
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(
          '/api/analytics/collect',
          new Blob([body], { type: 'application/json' })
        );
      } else {
        void fetch('/api/analytics/collect', {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Telemetry must never break the page it is measuring.
    }
  });

  return null;
}
