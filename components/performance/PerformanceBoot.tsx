// PerformanceBoot intentionally renders nothing.
//
// It previously mounted FontOptimizer, ResourcePreloader and AdvancedPreloader
// on EVERY page. Audit (2026-06-18) found those three were net-negative:
//   • They <link rel=preload as=font> seven /fonts/*.woff2 files that do NOT
//     exist in /public — every one 404s and triggers a "preloaded but not used"
//     console warning, competing with the real LCP image for bandwidth.
//   • AdvancedPreloader re-added a blanket <link rel=prefetch> for /about-us,
//     /services and /solutions — forcing three extra HTML downloads on every
//     page load on mobile data, the exact thing app/layout.tsx removed on
//     purpose (see the PERF comment there).
//   • They duplicated preconnect/dns-prefetch hints already in the layout head.
//
// The real font (Inter) is self-hosted and preloaded correctly by
// next/font/google in app/layout.tsx, so nothing of value is lost.
export default function PerformanceBoot() {
  return null;
}
