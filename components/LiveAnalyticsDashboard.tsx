'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  realtime: {
    activeUsers: number;
    activeUsersList: { id: string; page: string; country?: string; duration: number }[];
  };
  today: {
    visits: number;
    uniqueVisitors: number;
  };
  total: {
    pageViews: number;
    uniqueVisitors: number;
  };
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  topCountries: { country: string; count: number }[];
  devices: { desktop: number; mobile: number; tablet: number };
  hourlyData: { hour: string; visits: number }[];
  lastUpdated: string;
}

// Country flag emoji helper
const countryFlags: Record<string, string> = {
  'KE': '🇰🇪', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
  'IN': '🇮🇳', 'CN': '🇨🇳', 'JP': '🇯🇵', 'AU': '🇦🇺', 'CA': '🇨🇦',
  'ZA': '🇿🇦', 'NG': '🇳🇬', 'TZ': '🇹🇿', 'UG': '🇺🇬', 'ET': '🇪🇹',
  'Unknown': '🌍',
};

export default function LiveAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Poll every 5 seconds for real-time updates
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white mt-4">Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>{error || 'No data available'}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-white">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxHourlyVisits = Math.max(...data.hourlyData.map(d => d.visits), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              Live Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time visitor tracking for emersoneims.com
            </p>
          </div>
          <div className="text-right text-sm text-gray-500">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </div>
        </div>

        {/* Real-time Active Users Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium uppercase tracking-wider">Right Now</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-6xl font-bold text-white">{data.realtime.activeUsers}</span>
                <span className="text-2xl text-gray-400">active {data.realtime.activeUsers === 1 ? 'visitor' : 'visitors'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">on your website</p>
              <div className="flex gap-2 mt-2">
                {data.realtime.activeUsersList.slice(0, 5).map((user, i) => (
                  <div key={i} className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                    {countryFlags[user.country || 'Unknown'] || '🌍'} {user.page}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm">Today&apos;s Visits</p>
            <p className="text-4xl font-bold mt-2">{data.today.visits.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-1">↑ Live tracking</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm">Unique Visitors</p>
            <p className="text-4xl font-bold mt-2">{data.today.uniqueVisitors.toLocaleString()}</p>
            <p className="text-blue-400 text-sm mt-1">Individual users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm">Total Page Views</p>
            <p className="text-4xl font-bold mt-2">{data.total.pageViews.toLocaleString()}</p>
            <p className="text-purple-400 text-sm mt-1">All time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm">Avg. Pages/Visit</p>
            <p className="text-4xl font-bold mt-2">
              {data.today.uniqueVisitors > 0 
                ? (data.today.visits / data.today.uniqueVisitors).toFixed(1) 
                : '0'}
            </p>
            <p className="text-yellow-400 text-sm mt-1">Engagement</p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hourly Traffic Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic (Last 24 Hours)</h3>
            <div className="flex items-end gap-1 h-40">
              {data.hourlyData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.visits / maxHourlyVisits) * 100}%` }}
                    transition={{ delay: i * 0.02 }}
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t min-h-[4px]"
                    title={`${item.hour}: ${item.visits} visits`}
                  />
                  {i % 4 === 0 && (
                    <span className="text-[10px] text-gray-500 mt-1">{item.hour}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Devices</h3>
            <div className="space-y-4">
              {[
                { label: 'Desktop', value: data.devices.desktop, icon: '🖥️', color: 'bg-blue-500' },
                { label: 'Mobile', value: data.devices.mobile, icon: '📱', color: 'bg-green-500' },
                { label: 'Tablet', value: data.devices.tablet, icon: '📟', color: 'bg-purple-500' },
              ].map((device) => {
                const total = data.devices.desktop + data.devices.mobile + data.devices.tablet;
                const percent = total > 0 ? (device.value / total) * 100 : 0;
                return (
                  <div key={device.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{device.icon} {device.label}</span>
                      <span className="text-gray-400">{device.value} ({percent.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`h-full ${device.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Top Pages */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
            <div className="space-y-3">
              {data.topPages.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
              ) : (
                data.topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm w-5">{i + 1}.</span>
                      <span className="text-sm truncate max-w-[150px]">{page.page || '/'}</span>
                    </div>
                    <span className="text-green-400 text-sm font-medium">{page.views}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Countries</h3>
            <div className="space-y-3">
              {data.topCountries.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
              ) : (
                data.topCountries.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{countryFlags[item.country] || '🌍'}</span>
                      <span className="text-sm">{item.country}</span>
                    </div>
                    <span className="text-blue-400 text-sm font-medium">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Referrers */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {data.topReferrers.length === 0 ? (
                <p className="text-gray-500 text-sm">Direct traffic / No referrers yet</p>
              ) : (
                data.topReferrers.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[180px]">{ref.referrer}</span>
                    <span className="text-purple-400 text-sm font-medium">{ref.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Users List */}
        {data.realtime.activeUsersList.length > 0 && (
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Active Visitors Right Now
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                    <th className="pb-3">Visitor</th>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Current Page</th>
                    <th className="pb-3">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data.realtime.activeUsersList.map((user, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-3">
                        <span className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">
                          #{user.id}
                        </span>
                      </td>
                      <td className="py-3">
                        {countryFlags[user.country || 'Unknown'] || '🌍'} {user.country || 'Unknown'}
                      </td>
                      <td className="py-3 text-green-400">{user.page}</td>
                      <td className="py-3 text-gray-400 text-sm">
                        {user.duration < 60 ? `${user.duration}s ago` : `${Math.floor(user.duration / 60)}m ago`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>📊 Real-time tracking active • Data updates every 5 seconds</p>
          <p className="mt-1">For persistent analytics, consider adding Vercel KV or a database</p>
        </div>
      </div>
    </div>
  );
}
