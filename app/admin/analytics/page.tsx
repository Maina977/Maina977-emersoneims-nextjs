// Admin Analytics Dashboard Page
// Access at: /admin/analytics
import LiveAnalyticsDashboard from '@/components/LiveAnalyticsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/admin/analytics' },
  title: 'Live Analytics',
  description: 'Real-time visitor analytics dashboard',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AnalyticsPage() {
  return <LiveAnalyticsDashboard />;
}
