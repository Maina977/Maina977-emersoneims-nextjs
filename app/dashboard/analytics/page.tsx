'use client';

/**
 * ADMIN ANALYTICS DASHBOARD
 * Real-time KPI tracking for e-commerce operations
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { DashboardMetrics } from '@/lib/analytics/analyticsService';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchMetrics();
  }, [selectedPeriod]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const data = await response.json();
      setMetrics(data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-lg">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400 mt-1">Real-time e-commerce metrics & performance</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `KES ${metrics.totalRevenue.toLocaleString()}`, icon: '💰', color: 'amber' },
            { label: 'Orders', value: metrics.totalOrders.toString(), icon: '📦', color: 'blue' },
            { label: 'Customers', value: metrics.totalCustomers.toString(), icon: '👥', color: 'green' },
            { label: 'Avg Rating', value: `${metrics.averageRating.toFixed(1)}★`, icon: '⭐', color: 'yellow' }
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
            >
              <p className="text-gray-400 text-sm mb-2">{kpi.label}</p>
              <p className={`text-3xl font-bold text-${kpi.color}-400 mb-2`}>{kpi.value}</p>
              <p className="text-2xl opacity-50">{kpi.icon}</p>
            </motion.div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales & Conversion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
          >
            <h3 className="text-lg font-bold text-white mb-4">Sales Performance</h3>
            <div className="space-y-4">
              <MetricBar label="Conversion Rate" value={metrics.conversionRate} max={100} />
              <MetricBar label="Payment Success" value={metrics.paymentSuccessRate} max={100} />
              <MetricBar label="On-Time Delivery" value={metrics.onTimeDeliveryRate} max={100} />
              <MetricBar label="Customer Retention" value={metrics.customerRetentionRate} max={100} />
            </div>
          </motion.div>

          {/* Fulfillment Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
          >
            <h3 className="text-lg font-bold text-white mb-4">Fulfillment</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Avg Delivery Time</span>
                <span className="font-bold text-amber-400">{metrics.averageDeliveryTime} days</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Refund Time</span>
                <span className="font-bold text-amber-400">{metrics.averageRefundTime} days</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Orders</span>
                <span className="font-bold text-green-400">{metrics.ordersCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Return Rate</span>
                <span className={`font-bold ${metrics.returnRate < 5 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.returnRate}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top Selling Parts</h3>
          <div className="space-y-3">
            {metrics.topSellingParts.slice(0, 5).map((part, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white font-semibold">{part.partName}</p>
                  <p className="text-xs text-gray-500">{part.partCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-bold">{part.unitsSold} units</p>
                  <p className="text-xs text-gray-500">KES {part.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
          >
            <h3 className="text-lg font-bold text-white mb-4">Orders by Location</h3>
            <div className="space-y-2">
              {Object.entries(metrics.ordersByLocation).map(([location, count], i) => (
                <div key={i} className="flex justify-between items-center text-gray-300">
                  <span>{location}</span>
                  <span className="bg-amber-500/20 px-3 py-1 rounded text-amber-400 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-6 border border-slate-800"
          >
            <h3 className="text-lg font-bold text-white mb-4">Revenue by Location</h3>
            <div className="space-y-2">
              {Object.entries(metrics.revenueByLocation).map(([location, revenue], i) => (
                <div key={i} className="flex justify-between items-center text-gray-300">
                  <span>{location}</span>
                  <span className="text-green-400 font-bold">KES {revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-900/20 border border-red-500/30 rounded-lg p-6"
          >
            <h3 className="text-lg font-bold text-red-400 mb-3">⚠️ Alerts</h3>
            <ul className="space-y-2 text-red-300">
              {metrics.paymentSuccessRate < 80 && (
                <li>• Payment success rate is {metrics.paymentSuccessRate}% (target: 80%+)</li>
              )}
              {metrics.onTimeDeliveryRate < 90 && (
                <li>• On-time delivery rate is {metrics.onTimeDeliveryRate}% (target: 90%+)</li>
              )}
              {metrics.returnRate > 5 && (
                <li>• Return rate is {metrics.returnRate}% (target: below 5%)</li>
              )}
              {metrics.paymentSuccessRate >= 80 && metrics.onTimeDeliveryRate >= 90 && metrics.returnRate <= 5 && (
                <li>✓ All KPIs on target!</li>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </main>
  );
}

// Helper component
function MetricBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = (value / max) * 100;
  const barColor = percentage >= 90 ? 'bg-green-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-bold text-amber-400">{value}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
