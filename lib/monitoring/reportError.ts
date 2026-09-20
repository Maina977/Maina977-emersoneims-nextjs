/**
 * Report an error to Sentry — ONLY if Sentry is actually configured, and
 * without making every page download the Sentry SDK up front.
 *
 * WHY THIS EXISTS (2026-09-11). Three error boundaries imported
 * `* as Sentry from '@sentry/nextjs'` at the top of the file. Error boundaries
 * are part of the page's JavaScript whether or not an error ever happens, so
 * that import put the whole SDK into the bundle every visitor downloads — on
 * every page, every phone. Lighthouse on a throttled mid-range phone showed the
 * homepage's largest script at 414 KB, with Sentry in it.
 *
 * And it bought nothing: there is no Sentry DSN in Vercel in any environment,
 * so no error was ever reported. The SDK was downloaded, parsed and run on
 * every visit to send nothing.
 *
 * NEXT_PUBLIC_SENTRY_DSN is inlined at build time. With it unset, the check
 * below is `if (!undefined) return`, the dynamic import is dead code, and the
 * bundler drops the SDK from the client entirely. Set the variable in Vercel and
 * monitoring switches on by itself — loaded on demand, the first time an error
 * actually occurs, never on a normal page view.
 */
type CaptureContext = Parameters<typeof import('@sentry/nextjs').captureException>[1];

export function reportError(error: unknown, context?: CaptureContext): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  void import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.captureException(error, context);
    })
    .catch(() => {
      // Monitoring must never be the thing that breaks an error page.
    });
}
