// Admin Analytics Dashboard Page
// Access at: /admin/analytics
import LiveAnalyticsDashboard from '@/components/LiveAnalyticsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Analytics | EmersonEIMS Admin',
  description: 'Real-time visitor analytics dashboard',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AnalyticsPage() {
  return <LiveAnalyticsDashboard />;
}
