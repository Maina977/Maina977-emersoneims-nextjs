// components/diagnostics/RealTimeMonitor.tsx
'use client';

import { useState } from 'react';

export default function RealTimeMonitor() {
  const [metrics] = useState({
    activeSystems: 1247,
    avgUptime: 98.7,
    totalPower: 125,
    alerts: 3,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Active Systems', value: metrics.activeSystems.toLocaleString(), color: 'text-blue-400' },
        { label: 'Uptime', value: `${metrics.avgUptime.toFixed(1)}%`, color: 'text-green-400' },
        { label: 'Power (kW)', value: metrics.totalPower, color: 'text-amber-400' },
        { label: 'Alerts', value: metrics.alerts, color: 'text-red-400' },
      ].map((metric) => (
        <div key={metric.label} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm text-gray-400">{metric.label}</h3>
          <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
