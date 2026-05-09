'use client';

/**
 * ANALYTICS DASHBOARD
 * Real-time analytics dashboard for viewing visitor data and performance
 */

import { useEffect, useState } from 'react';

interface DashboardData {
  visitors: {
    total: number;
    active: number;
    new: number;
    returning: number;
  };
  pages: Array<{
    path: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    bounceRate: number;
    conversionRate: number;
  }>;
  conversions: {
    total: number;
    today: number;
    rate: number;
    byType: Record<string, number>;
  };
  topLeads: Array<{
    visitorId: string;
    engagementScore: number;
    conversionProbability: number;
    lastActivity: string;
    interests: string[];
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.warn('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-dashboard loading">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="analytics-dashboard error">Failed to load analytics</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h2>Real-Time Analytics Dashboard</h2>
      
      {/* Visitor Stats */}
      <div className="dashboard-section">
        <h3>Visitors</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{data.visitors.total}</div>
            <div className="stat-label">Total Visitors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.visitors.active}</div>
            <div className="stat-label">Active Now</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.visitors.new}</div>
            <div className="stat-label">New Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.visitors.returning}</div>
            <div className="stat-label">Returning</div>
          </div>
        </div>
      </div>

      {/* Page Performance */}
      <div className="dashboard-section">
        <h3>Page Performance</h3>
        <table className="pages-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Unique Visitors</th>
              <th>Avg Time</th>
              <th>Bounce Rate</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.pages.map((page, idx) => (
              <tr key={idx}>
                <td>{page.path}</td>
                <td>{page.views}</td>
                <td>{page.uniqueVisitors}</td>
                <td>{Math.round(page.avgTimeOnPage)}s</td>
                <td>{page.bounceRate.toFixed(1)}%</td>
                <td>{page.conversionRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conversions */}
      <div className="dashboard-section">
        <h3>Conversions</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{data.conversions.total}</div>
            <div className="stat-label">Total Conversions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.conversions.today}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.conversions.rate.toFixed(1)}%</div>
            <div className="stat-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Top Leads */}
      <div className="dashboard-section">
        <h3>Top Leads</h3>
        <div className="leads-list">
          {data.topLeads.map((lead, idx) => (
            <div key={idx} className="lead-card">
              <div className="lead-id">{lead.visitorId}</div>
              <div className="lead-metrics">
                <span>Engagement: {lead.engagementScore}%</span>
                <span>Conversion: {lead.conversionProbability}%</span>
              </div>
              <div className="lead-interests">
                {lead.interests.map((interest, i) => (
                  <span key={i} className="interest-tag">{interest}</span>
                ))}
              </div>
              <div className="lead-time">{lead.lastActivity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

