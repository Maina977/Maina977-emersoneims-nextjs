'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DepthChartProps {
  depth: number;
  minDepth?: number;
  maxDepth?: number;
  regionalAverage?: number;
}

export const DepthChart: React.FC<DepthChartProps> = ({
  depth,
  minDepth = 20,
  maxDepth = 120,
  regionalAverage = 50
}) => {
  const data = [
    { name: 'Min', depth: minDepth },
    { name: 'Recommended', depth: depth },
    { name: 'Regional Avg', depth: regionalAverage },
    { name: 'Max', depth: maxDepth }
  ];
  
  const getBarColor = (entry: any) => {
    if (entry.name === 'Recommended') return '#4CAF50';
    if (entry.name === 'Regional Avg') return '#FFC107';
    return '#9E9E9E';
  };
  
  return (
    <div className="depth-chart" style={{ width: '100%', height: 400 }}>
      <h3>Recommended Drilling Depth</h3>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'Depth (meters)', position: 'bottom' }} />
          <YAxis type="category" dataKey="name" />
          <Tooltip formatter={(value) => `${value} meters`} />
          <Legend />
          <Bar dataKey="depth" fill="#8884d8" barSize={30} fillOpacity={0.8}>
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="depth" fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};