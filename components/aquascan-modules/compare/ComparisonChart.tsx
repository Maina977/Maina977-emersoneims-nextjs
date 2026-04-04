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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Site {
  id: string;
  name: string;
  probability: number;
  yield: number;
  waterQuality: number;
  risk: number;
  costEfficiency: number;
}

interface ComparisonChartProps {
  sites: Site[];
  chartType: 'bar' | 'radar';
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ sites, chartType }) => {
  if (chartType === 'bar') {
    const barData = sites.map(site => ({
      name: site.name,
      'Success Rate': site.probability * 100,
      'Yield (m³/h)': site.yield,
      'Water Quality': site.waterQuality * 100,
      'Risk Score': site.risk * 100
    }));

    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Success Rate" fill="#4CAF50" />
            <Bar dataKey="Yield (m³/h)" fill="#2196F3" />
            <Bar dataKey="Water Quality" fill="#FFC107" />
            <Bar dataKey="Risk Score" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Radar chart
  const radarData = [
    { subject: 'Success Rate', A: sites[0]?.probability * 100 || 0, B: sites[1]?.probability * 100 || 0 },
    { subject: 'Yield', A: sites[0]?.yield || 0, B: sites[1]?.yield || 0 },
    { subject: 'Water Quality', A: sites[0]?.waterQuality * 100 || 0, B: sites[1]?.waterQuality * 100 || 0 },
    { subject: 'Risk (inverse)', A: (1 - (sites[0]?.risk || 0)) * 100, B: (1 - (sites[1]?.risk || 0)) * 100 },
    { subject: 'Cost Efficiency', A: sites[0]?.costEfficiency || 0, B: sites[1]?.costEfficiency || 0 }
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RadarChart outerRadius={150} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          {sites[0] && <Radar name={sites[0].name} dataKey="A" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />}
          {sites[1] && <Radar name={sites[1].name} dataKey="B" stroke="#2196F3" fill="#2196F3" fillOpacity={0.3} />}
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};