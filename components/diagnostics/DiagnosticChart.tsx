// components/diagnostics/DiagnosticChart.tsx
'use client';

import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DiagnosticChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  width?: number;
  height?: number;
  title?: string;
  showExport?: boolean;
  voiceEnabled?: boolean;
}

export default function DiagnosticChart({
  data,
  type,
  title,
}: DiagnosticChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label: title || 'Data',
      data: data.map(d => d.value),
      backgroundColor: data.map((d, i) => d.color || `hsl(${i * 30}, 70%, 50%)`),
      borderColor: data.map((d, i) => d.color || `hsl(${i * 30}, 70%, 40%)`),
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title
      }
    }
  };

  const chartStyle = { height: '300px', width: '100%' };

  return (
    <div style={chartStyle}>
      {type === 'bar' && <Bar data={chartData} options={options} />}
      {type === 'line' && <Line data={chartData} options={options} />}
      {type === 'pie' && <Pie data={chartData} options={options} />}
    </div>
  );
}
