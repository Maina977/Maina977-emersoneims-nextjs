'use client';

import { useState } from 'react';
import QuestionsChart from './QuestionsChart';
import QuestionsDonutChart from './QuestionsDonutChart';

export default function QuestionsChartToggle({ data, severityData }) {
  const [mode, setMode] = useState('bar'); // 'bar' or 'donut'

  function getBarColor(service, severityData) {
    const counts = severityData?.[service] || { HIGH: 0, MED: 0, LOW: 0 };
    if (counts.HIGH > 0) return 'bg-red-600';
    if (counts.MED > 0) return 'bg-yellow-500';
    if (counts.LOW > 0) return 'bg-green-500';
    return 'bg-blue-500'; // default
  }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="p-4 bg-gray-900 border-4 border-purple-500 rounded-lg">
      <h2 className="text-lg font-bold text-purple-300 mb-4">
        Questions Analytics
      </h2>

      {/* Cockpit-style toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode('bar')}
          className={`px-4 py-2 rounded border-2 font-mono ${
            mode === 'bar'
              ? 'bg-green-600 border-green-400 text-white'
              : 'bg-gray-700 border-gray-500 text-green-300'
          }`}
        >
          BAR VIEW
        </button>
        <button
          onClick={() => setMode('donut')}
          className={`px-4 py-2 rounded border-2 font-mono ${
            mode === 'donut'
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-gray-700 border-gray-500 text-blue-300'
          }`}
        >
          DONUT VIEW
        </button>
      </div>

      {/* Render chart based on mode */}
      {mode === 'bar' ? (
        <div>
          {Object.keys(data).map((service) => {
            const percentage = (data[service] / total) * 100;
            const counts = severityData?.[service] || { HIGH: 0, MED: 0, LOW: 0 };

            return (
              <div key={service} className="mb-2">
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>{service}</span>
                  <span>{data[service]} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded">
                  <div
                    className={`h-4 ${getBarColor(service, severityData)} rounded`}
                    style={{ width: `${percentage}%` }}
                    title={`High: ${counts.HIGH} | Med: ${counts.MED} | Low: ${counts.LOW}`}
                  ></div>
                </div>
                {severityData?.[service]?.HIGH > 0 && (
                  <div className="text-xs text-red-400 font-mono">
                    High alerts: {severityData[service].HIGH}
                  </div>
                )}
              </div>
            );
          })}

          {/* Severity Legend */}
          <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="text-xs font-bold text-gray-300 tracking-widest mb-2">
              Severity Legend
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>High severity alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Medium severity alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Low severity alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>No alerts</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <QuestionsDonutChart data={data} />
      )}
    </div>
  );
}
