import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export const metadata = {
  /*
   * NOINDEX - an internal analytics dashboard, not a page for customers.
   *
   * Audited 2026-09-21 against production: this answered 200 with
   * "index, follow" and was reachable by any crawler. /phase-4 and /console
   * already carried this line; the rest of the set never did.
   *
   * It is in no sitemap and nothing links to it, so noindex here creates none
   * of the contradictions this codebase has been bitten by before: a
   * noindexed URL submitted for indexing, or a noindex sitting beside a
   * canonical pointing somewhere else.
   *
   * Google combines robots rules across meta tags and takes the sum of the
   * negative ones, so this coexists with the site-wide noarchive meta in
   * SecurityShield rather than fighting it.
   */
  robots: { index: false, follow: false },
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/analytics' },
  title: 'Analytics Dashboard',
  description: 'Real-time visitor analytics and engagement metrics',
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
