import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export const metadata = {
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
