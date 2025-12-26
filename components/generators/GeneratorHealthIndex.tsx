'use client';

import React from 'react';

export default function GeneratorHealthIndex() {
  const healthMetrics = [
    { name: 'Engine Health', value: 92, status: 'Excellent' },
    { name: 'Electrical System', value: 88, status: 'Good' },
    { name: 'Fuel System', value: 95, status: 'Excellent' },
    { name: 'Cooling System', value: 85, status: 'Good' },
    { name: 'Battery System', value: 78, status: 'Fair' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      case 'Fair':
        return 'text-yellow-600';
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBarColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 80) return 'bg-blue-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Generator Health Index</h3>

      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {metric.name}
                </span>
                <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(metric.value)}`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-lg font-bold text-gray-900">
              {metric.value}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Overall Health Score:</span>
          <span className="font-bold text-green-600">
            {Math.round(healthMetrics.reduce((sum, metric) => sum + metric.value, 0) / healthMetrics.length)}%
          </span>
        </div>
      </div>
    </div>
  );
}