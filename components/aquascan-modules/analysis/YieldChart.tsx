'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface YieldChartProps {
  estimatedYield: number;
  depth: number;
}

export const YieldChart: React.FC<YieldChartProps> = ({ estimatedYield, depth }) => {
  // Generate mock yield vs depth data
  const generateData = () => {
    const data = [];
    for (let d = 10; d <= depth + 20; d += 10) {
      let yieldValue = 2 + (d / depth) * estimatedYield;
      if (d > depth) yieldValue *= 0.8;
      data.push({ depth: d, yield: Math.min(yieldValue, 25) });
    }
    return data;
  };
  
  const data = generateData();
  
  return (
    <div className="yield-chart" style={{ width: '100%', height: 400 }}>
      <h3>Estimated Yield vs Depth</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="depth" label={{ value: 'Depth (meters)', position: 'bottom' }} />
          <YAxis label={{ value: 'Yield (m³/hour)', angle: -90, position: 'left' }} />
          <Tooltip formatter={(value) => `${(value as number)?.toFixed(1) || '0'} m³/hour`} />
          <Line
            type="monotone"
            dataKey="yield"
            stroke="#4CAF50"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <strong>Recommended Depth: {depth}m</strong> | 
        <strong style={{ marginLeft: 20 }}>Estimated Yield: {estimatedYield.toFixed(1)} m³/hour</strong>
      </div>
    </div>
  );
};