'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load the chart component
const DiagnosticChart = dynamic(() => import('./DiagnosticChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
});

interface ServiceData {
  service: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  avgResolutionTime: number; // hours
  satisfaction: number; // 1-5
  revenue: number;
}

interface ServiceAnalyticsProps {
  questionsData?: ServiceData[];
}

export default function ServiceAnalytics({ questionsData }: ServiceAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const defaultData: ServiceData[] = [
    { service: 'Engine Diagnostics', count: 145, trend: 'up', avgResolutionTime: 2.3, satisfaction: 4.7, revenue: 28750 },
    { service: 'Electrical Systems', count: 98, trend: 'stable', avgResolutionTime: 1.8, satisfaction: 4.5, revenue: 19500 },
    { service: 'Fuel System', count: 76, trend: 'up', avgResolutionTime: 3.1, satisfaction: 4.3, revenue: 15200 },
    { service: 'Cooling System', count: 54, trend: 'down', avgResolutionTime: 2.7, satisfaction: 4.6, revenue: 10800 },
    { service: 'Transmission', count: 43, trend: 'stable', avgResolutionTime: 4.2, satisfaction: 4.2, revenue: 8600 },
    { service: 'Preventive Maintenance', count: 67, trend: 'up', avgResolutionTime: 1.5, satisfaction: 4.8, revenue: 13400 },
  ];

  const data = questionsData || defaultData;

  const chartData = useMemo(() => {
    return data.map(item => ({
      label: item.service,
      value: item.count,
      color: item.trend === 'up' ? '#10b981' : item.trend === 'down' ? '#ef4444' : '#6b7280'
    }));
  }, [data]);

  const totalServices = data.reduce((sum, item) => sum + item.count, 0);
  const avgResolutionTime = data.reduce((sum, item) => sum + (item.avgResolutionTime * item.count), 0) / totalServices;
  const avgSatisfaction = data.reduce((sum, item) => sum + (item.satisfaction * item.count), 0) / totalServices;
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Service Analytics Dashboard</h3>
          <p className="text-gray-600">Real-time service performance metrics</p>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>

          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-l-lg ${viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-r-lg ${viewMode === 'detailed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Services</p>
          <p className="text-2xl font-bold text-blue-900">{totalServices}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Avg Resolution</p>
          <p className="text-2xl font-bold text-green-900">{avgResolutionTime.toFixed(1)}h</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Customer Satisfaction</p>
          <p className="text-2xl font-bold text-purple-900">{avgSatisfaction.toFixed(1)}/5</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">Revenue</p>
          <p className="text-2xl font-bold text-orange-900">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <DiagnosticChart
          data={chartData}
          type="bar"
          width={600}
          height={300}
          title="Service Requests by Category"
          showExport={true}
          voiceEnabled={true}
        />
      </div>

      {/* Service Details */}
      {viewMode === 'detailed' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t pt-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Performance Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Service</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Requests</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Trend</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Resolution Time</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Satisfaction</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <motion.tr
                    key={item.service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{item.service}</td>
                    <td className="py-3 px-4 text-center">{item.count}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-lg">{getTrendIcon(item.trend)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">{item.avgResolutionTime}h</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSatisfactionColor(item.satisfaction)}`}>
                        {item.satisfaction}/5
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">${item.revenue.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Data updated in real-time. Use the voice narration feature for accessibility.
          Export charts as SVG for reports and presentations.
        </p>
      </div>
    </motion.div>
  );
}