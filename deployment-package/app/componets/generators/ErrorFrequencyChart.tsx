'use client';

import React from 'react';

export default function ErrorFrequencyChart() {
  // Placeholder error frequency chart data
  const errorData = [
    { error: 'Low Fuel', frequency: 35 },
    { error: 'Battery Failure', frequency: 28 },
    { error: 'Overload', frequency: 22 },
    { error: 'Coolant Temp', frequency: 15 },
  ];

  const maxFrequency = Math.max(...errorData.map(d => d.frequency));

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Error Frequency</h3>
      <div className="space-y-4">
        {errorData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>{item.error}</span>
              <span>{item.frequency}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                style={{ width: `${(item.frequency / maxFrequency) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

