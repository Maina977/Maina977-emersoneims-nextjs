/**
 * Client-side Sentry — loaded ONLY when Sentry is configured.
 *
 * Next.js runs this file in every browser, on every page, before the page
 * becomes interactive. Until 2026-09-11 it imported the whole @sentry/nextjs
 * SDK and initialised it with `tracesSampleRate: 1` — performance tracing on
 * 100% of visits — under a header comment copied from the EDGE config template
 * ("configures the initialization of Sentry for edge features"), which it is
 * not.
 *
 * Two things were wrong with that:
 *
 *  1. It never worked. Its DSN was `process.env.SENTRY_DSN`, which is not a
 *     NEXT_PUBLIC_ variable and so is never exposed to the browser — and there
 *     is no Sentry DSN set in Vercel in any environment anyway. No error was
 *     ever reported from a browser.
 *  2. It still cost every visitor. The SDK sat in the largest start-up script
 *     (414 KB uncompressed on the homepage), parsed and executed on a phone's
 *     main thread before the page could respond.
 *
 * sentry.client.config.ts holds a carefully tuned config — tracing off, replay
 * off, heavy integrations stripped — but nothing loads it: next.config.ts has no
 * withSentryConfig wrapper. The tuned values are reproduced below so they are
 * the ones that apply if monitoring is ever switched on.
 *
 * NEXT_PUBLIC_SENTRY_DSN is inlined at build time. Unset, the `if` below is dead
 * code and the bundler removes the SDK from the client bundle entirely. Set it
 * in Vercel and Sentry loads — lazily, after start-up, off the critical path.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  void import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      integrations: (defaults) =>
        defaults.filter((i) => !['Replay', 'BrowserTracing', 'BrowserProfiling'].includes(i.name)),
      environment: process.env.NODE_ENV,
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      enabled: process.env.NODE_ENV === 'production',
      ignoreErrors: [
        /^chrome-extension:\/\//,
        /^moz-extension:\/\//,
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        'ResizeObserver loop',
        'Non-Error promise rejection',
      ],
    });
  });
}
