'use client';

/**
 * DiagnosticCharts - Premium Sci-Fi Visualization Components
 * Real-time charts, gauges, and data visualization for Generator Oracle
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Line, Doughnut, Radar, Bar } from 'react-chartjs-2';

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
  Legend,
  Filler,
  RadialLinearScale
);

// Sci-fi color palette
const COLORS = {
  cyan: 'rgba(6, 182, 212, 1)',
  cyanFaded: 'rgba(6, 182, 212, 0.3)',
  amber: 'rgba(245, 158, 11, 1)',
  amberFaded: 'rgba(245, 158, 11, 0.3)',
  green: 'rgba(34, 197, 94, 1)',
  greenFaded: 'rgba(34, 197, 94, 0.3)',
  red: 'rgba(239, 68, 68, 1)',
  redFaded: 'rgba(239, 68, 68, 0.3)',
  purple: 'rgba(168, 85, 247, 1)',
  purpleFaded: 'rgba(168, 85, 247, 0.3)',
  slate: 'rgba(100, 116, 139, 0.5)',
};

/**
 * Real-time Parameter Trend Chart
 */
export function ParameterTrendChart({
  data,
  label,
  color = 'cyan',
  height = 200,
}: {
  data: number[];
  label: string;
  color?: 'cyan' | 'amber' | 'green' | 'red' | 'purple';
  height?: number;
}) {
  const chartData = {
    labels: data.map((_, i) => `${i * 5}s`),
    datasets: [
      {
        label,
        data,
        borderColor: COLORS[color],
        backgroundColor: COLORS[`${color}Faded` as keyof typeof COLORS],
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS[color],
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: COLORS[color],
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: COLORS[color],
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(100, 116, 139, 0.1)', drawBorder: false },
        ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(100, 116, 139, 0.1)', drawBorder: false },
        ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div style={{ height }} className="relative">
      <Line data={chartData} options={options} />
      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none"
        style={{ top: '50%' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/**
 * Fault Distribution Doughnut Chart
 */
export function FaultDistributionChart({
  data,
  labels,
  height = 250,
}: {
  data: number[];
  labels: string[];
  height?: number;
}) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          COLORS.red,
          COLORS.amber,
          COLORS.cyan,
          COLORS.green,
          COLORS.purple,
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(148, 163, 184, 0.8)',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: COLORS.cyan,
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
      },
    },
  };

  return (
    <div style={{ height }} className="relative">
      <Doughnut data={chartData} options={options} />
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400">{data.reduce((a, b) => a + b, 0)}</div>
          <div className="text-xs text-slate-400">Total Faults</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Controller Health Radar Chart
 */
export function HealthRadarChart({
  metrics,
  height = 280,
}: {
  metrics: { label: string; value: number; max: number }[];
  height?: number;
}) {
  const chartData = {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: 'Current',
        data: metrics.map(m => (m.value / m.max) * 100),
        backgroundColor: COLORS.cyanFaded,
        borderColor: COLORS.cyan,
        borderWidth: 2,
        pointBackgroundColor: COLORS.cyan,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.cyan,
      },
      {
        label: 'Optimal',
        data: metrics.map(() => 80),
        backgroundColor: 'transparent',
        borderColor: COLORS.greenFaded,
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(148, 163, 184, 0.5)',
          backdropColor: 'transparent',
          font: { size: 9 },
        },
        grid: { color: 'rgba(100, 116, 139, 0.2)' },
        angleLines: { color: 'rgba(100, 116, 139, 0.2)' },
        pointLabels: {
          color: 'rgba(148, 163, 184, 0.8)',
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: COLORS.cyan,
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.toFixed(0)}%`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={chartData} options={options} />
    </div>
  );
}

/**
 * Fault History Bar Chart
 */
export function FaultHistoryChart({
  data,
  labels,
  height = 200,
}: {
  data: number[];
  labels: string[];
  height?: number;
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Faults',
        data,
        backgroundColor: data.map((v, i) =>
          v > 5 ? COLORS.redFaded : v > 2 ? COLORS.amberFaded : COLORS.greenFaded
        ),
        borderColor: data.map((v) =>
          v > 5 ? COLORS.red : v > 2 ? COLORS.amber : COLORS.green
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: COLORS.cyan,
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(100, 116, 139, 0.1)', drawBorder: false },
        ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

/**
 * Animated Circular Gauge
 */
export function CircularGauge({
  value,
  max,
  label,
  unit,
  size = 140,
  thresholds = { warning: 70, critical: 90 },
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  size?: number;
  thresholds?: { warning: number; critical: number };
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const getColor = () => {
    if (percentage >= thresholds.critical) return COLORS.red;
    if (percentage >= thresholds.warning) return COLORS.amber;
    return COLORS.cyan;
  };

  const getStatus = () => {
    if (percentage >= thresholds.critical) return 'CRITICAL';
    if (percentage >= thresholds.warning) return 'WARNING';
    return 'NORMAL';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="8"
          />
          {/* Tick marks */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={size / 2}
              y1="8"
              x2={size / 2}
              y2="16"
              stroke="rgba(100, 116, 139, 0.3)"
              strokeWidth="1"
              transform={`rotate(${i * 30} ${size / 2} ${size / 2})`}
            />
          ))}
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
          />
          {/* Glow effect */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            opacity="0.4"
            style={{ filter: 'blur(4px)' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold font-mono"
            style={{ color: getColor() }}
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {value.toFixed(0)}
          </motion.span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <motion.span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{
              backgroundColor: `${getColor()}20`,
              color: getColor(),
              border: `1px solid ${getColor()}50`,
            }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getStatus()}
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

/**
 * Live Data Stream Indicator
 */
export function DataStreamIndicator({ active = true }: { active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-slate-500'}`}
        animate={active ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className={`text-xs font-mono ${active ? 'text-green-400' : 'text-slate-500'}`}>
        {active ? 'LIVE' : 'OFFLINE'}
      </span>
      {active && (
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-green-500 rounded-full"
              animate={{ height: [4, 12, 4] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Holographic Panel Wrapper
 */
export function HolographicPanel({
  children,
  title,
  icon,
  className = '',
}: {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-xl"
        style={{ boxShadow: '0 0 30px rgba(0,255,255,0.05), inset 0 0 30px rgba(0,0,0,0.5)' }}
      />

      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Border */}
      <div className="absolute inset-0 rounded-xl border border-cyan-500/20" />

      {/* Title bar */}
      {title && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded-md flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-5 pt-6">{children}</div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
    </motion.div>
  );
}
