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
  type ChartData,
  type ChartOptions,
  type TooltipItem,
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
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData<'bar' | 'line' | 'pie' | 'doughnut', (number | null)[], string>;
  options?: ChartOptions<'bar' | 'line' | 'pie' | 'doughnut'>;
  className?: string;
}

export default function ChartJSChart({ type, data, options, className }: ChartJSChartProps) {
  const defaultOptions: ChartOptions<'bar' | 'line' | 'pie' | 'doughnut'> = {
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
          label: (context: TooltipItem<'bar' | 'line' | 'pie' | 'doughnut'>) => {
            const datasetLabel = (context.dataset.label ?? '').toString();
            const parsed = context.parsed as unknown;
            const yValue =
              typeof parsed === 'object' && parsed !== null && 'y' in parsed
                ? (parsed as { y?: unknown }).y
                : parsed;
            const formatted =
              typeof yValue === 'number'
                ? yValue.toLocaleString()
                : yValue == null
                ? ''
                : String(yValue);
            return `${datasetLabel}: ${formatted}`;
          },
        }
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: { 
        ticks: { 
          color: 'oklch(0.60 0.05 200)',
          font: { family: 'var(--font-body), sans-serif', size: 11 },
        }, 
        border: {
          display: false,
        },
        grid: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          lineWidth: 1,
        } 
      },
      y: { 
        ticks: { 
          color: 'oklch(0.60 0.05 200)',
          font: { family: 'var(--font-body), sans-serif', size: 11 },
          callback: (value) => (typeof value === 'number' ? value.toLocaleString() : String(value)),
        }, 
        border: {
          display: false,
        },
        grid: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          lineWidth: 1,
        } 
      },
    } : undefined,
    ...(options ?? {}),
  };

  const chartData = {
    ...data,
    datasets: data.datasets?.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 'oklch(0.75 0.20 200 / 0.8)',
      borderColor: dataset.borderColor || 'oklch(0.75 0.20 200)',
    })),
  };

  switch (type) {
    case 'bar':
      return (
        <Bar
          data={chartData as unknown as ChartData<'bar', (number | null)[], string>}
          options={defaultOptions as unknown as ChartOptions<'bar'>}
          className={className}
        />
      );
    case 'line':
      return (
        <Line
          data={chartData as unknown as ChartData<'line', (number | null)[], string>}
          options={defaultOptions as unknown as ChartOptions<'line'>}
          className={className}
        />
      );
    case 'pie':
      return (
        <Pie
          data={chartData as unknown as ChartData<'pie', (number | null)[], string>}
          options={defaultOptions as unknown as ChartOptions<'pie'>}
          className={className}
        />
      );
    case 'doughnut':
      return (
        <Doughnut
          data={chartData as unknown as ChartData<'doughnut', (number | null)[], string>}
          options={defaultOptions as unknown as ChartOptions<'doughnut'>}
          className={className}
        />
      );
    default:
      return (
        <Line
          data={chartData as unknown as ChartData<'line', (number | null)[], string>}
          options={defaultOptions as unknown as ChartOptions<'line'>}
          className={className}
        />
      );
  }
}

