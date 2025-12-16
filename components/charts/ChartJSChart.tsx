'use client';

import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartJSChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

export default function ChartJSChart({ type, data, options, className }: ChartJSChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { 
          color: 'oklch(0.75 0.20 200)',
          font: { family: 'var(--font-manrope), sans-serif', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'oklch(0.10 0.05 200 / 0.95)',
        borderColor: 'oklch(0.40 0.05 200)',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'var(--font-manrope), sans-serif', size: 12 },
        bodyFont: { family: 'var(--font-body), sans-serif', size: 11 },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label || ''}: ${context.parsed.y?.toLocaleString() || context.parsed}`;
          }
        }
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: { 
        ticks: { 
          color: 'oklch(0.60 0.05 200)',
          font: { family: 'var(--font-body), sans-serif', size: 11 },
        }, 
        grid: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          lineWidth: 1,
          drawBorder: false,
        } 
      },
      y: { 
        ticks: { 
          color: 'oklch(0.60 0.05 200)',
          font: { family: 'var(--font-body), sans-serif', size: 11 },
          callback: function(value: any) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          }
        }, 
        grid: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          lineWidth: 1,
          drawBorder: false,
        } 
      },
    } : undefined,
    ...options,
  };

  const chartData = {
    ...data,
    datasets: data.datasets?.map((dataset: any) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 'oklch(0.75 0.20 200 / 0.8)',
      borderColor: dataset.borderColor || 'oklch(0.75 0.20 200)',
    })),
  };

  switch (type) {
    case 'bar':
      return <Bar data={chartData} options={defaultOptions} className={className} />;
    case 'line':
      return <Line data={chartData} options={defaultOptions} className={className} />;
    case 'pie':
      return <Pie data={chartData} options={defaultOptions} className={className} />;
    case 'doughnut':
      return <Doughnut data={chartData} options={defaultOptions} className={className} />;
    default:
      return <Line data={chartData} options={defaultOptions} className={className} />;
  }
}

