import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Performance Monitoring — DISABLED in client bundle to save ~50KB.
  // Server-side tracing (in sentry.server.config.ts) is sufficient for our needs.
  tracesSampleRate: 0,

  // Session Replay — DISABLED. Adds ~80KB+ to every page load.
  // Re-enable later only if we genuinely need replay (and lazy-load it).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Explicitly drop the heavy integrations so tree-shaking removes their code.
  integrations: (defaults) =>
    defaults.filter(
      (i) => !['Replay', 'BrowserTracing', 'BrowserProfiling'].includes(i.name)
    ),

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Ignore common non-actionable errors
  ignoreErrors: [
    // Browser extensions
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    // Network errors
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // User-initiated navigation
    'ResizeObserver loop',
    'Non-Error promise rejection',
  ],

  // Filter out development noise
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
