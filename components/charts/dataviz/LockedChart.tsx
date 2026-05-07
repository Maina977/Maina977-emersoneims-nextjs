'use client';

import * as React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
import {
  CHART_THEME,
  formatValue,
  formatTick,
  seriesColor,
  STATUS_SERIES,
  type StatusKey,
} from './tokens';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * LockedChart — the ONLY chart wrapper allowed in app code.
 *
 * Enforces:
 *   • 2D bar / line / doughnut only — no 3D, no radar/polar/scatter sprawl.
 *   • Flat fills, no gradients, no decorative shadows.
 *   • Categorical color palette (≤ 6 series) drawn from design tokens; or
 *     status-keyed palette when each series IS a status.
 *   • Tooltips and axis ticks always include the supplied `unit`.
 *   • Legend hidden when there is only one series.
 *
 * If you need a chart this wrapper does not expose, raise a design review —
 * do not bypass it with raw `react-chartjs-2`.
 */

export type LockedChartType = 'bar' | 'line' | 'doughnut';

export interface LockedSeries {
  label: string;
  data: number[];
  /** Override series color with a status key (success/warning/danger/...). */
  statusKey?: StatusKey;
}

export interface LockedChartProps {
  type: LockedChartType;
  /** Category labels (x-axis or doughnut slices). */
  labels: string[];
  /** Up to 6 series. */
  series: LockedSeries[];
  /** Unit for every numeric value rendered (axis ticks + tooltips). REQUIRED. */
  unit: string;
  decimals?: number;
  /** Accessible chart title; also rendered visually above the chart. */
  title: string;
  /** Optional subtitle / caption. Should reference units / time window. */
  caption?: string;
  /** Pixel height for the chart canvas. Default 280. */
  height?: number;
  className?: string;
}

export function LockedChart({
  type,
  labels,
  series,
  unit,
  decimals,
  title,
  caption,
  height = 280,
  className = '',
}: LockedChartProps) {
  if (series.length > 6) {
    // Visual lock: too many series = decorative noise.
    // Throw in dev so it is caught early; trim in prod to stay rendering.
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `[LockedChart] Maximum 6 series allowed (got ${series.length}). Aggregate or split the chart.`,
      );
    }
    series = series.slice(0, 6);
  }

  const datasets = series.map((s, i) => {
    const c = s.statusKey ? STATUS_SERIES[s.statusKey] : seriesColor(i);
    return {
      label: s.label,
      data: s.data,
      backgroundColor: type === 'line' ? `${c}20` : c,
      borderColor: c,
      borderWidth: type === 'line' ? 2 : 1,
      pointBackgroundColor: c,
      pointRadius: type === 'line' ? 2 : 0,
      pointHoverRadius: 4,
      tension: 0,                // no decorative curves
      fill: false,               // no decorative area fills
      hoverBackgroundColor: c,
      hoverBorderColor: c,
    };
  });

  const showLegend = series.length > 1;

  const baseOptions: ChartOptions<LockedChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          color: CHART_THEME.textColor,
          font: { family: CHART_THEME.fontFamily, size: 12 },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: CHART_THEME.tooltipBg,
        titleColor: CHART_THEME.tooltipFg,
        bodyColor: CHART_THEME.tooltipFg,
        borderColor: CHART_THEME.tooltipBorder,
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4,
        titleFont: { family: CHART_THEME.fontFamily, size: 12, weight: 600 },
        bodyFont: { family: CHART_THEME.fontFamily, size: 12 },
        callbacks: {
          label: (ctx: TooltipItem<LockedChartType>) => {
            const datasetLabel = ctx.dataset.label ?? '';
            const parsed = ctx.parsed as unknown;
            const raw =
              typeof parsed === 'object' && parsed !== null && 'y' in parsed
                ? (parsed as { y?: number }).y
                : (parsed as number);
            const num = typeof raw === 'number' ? raw : Number(raw);
            const formatted = formatValue(num, { unit, decimals });
            return datasetLabel ? `${datasetLabel}: ${formatted}` : formatted;
          },
        },
      },
    },
  };

  const cartesianOptions: ChartOptions<'bar' | 'line'> = {
    ...(baseOptions as ChartOptions<'bar' | 'line'>),
    scales: {
      x: {
        border: { display: false, color: CHART_THEME.axisColor },
        grid: { display: false },
        ticks: {
          color: CHART_THEME.mutedColor,
          font: { family: CHART_THEME.fontFamily, size: 11 },
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        border: { display: false },
        grid: { color: CHART_THEME.gridColor, drawTicks: false },
        ticks: {
          color: CHART_THEME.mutedColor,
          font: { family: CHART_THEME.fontFamily, size: 11 },
          padding: 8,
          callback: formatTick(unit, decimals),
        },
      },
    },
  };

  const data = { labels, datasets } as ChartData<LockedChartType, number[], string>;

  return (
    <figure className={`rounded-lg border bg-surface-base p-4 ${className}`}
      style={{ borderColor: 'var(--color-border-subtle)' }}>
      <figcaption className="mb-2">
        <div className="text-sm font-semibold text-ink-primary">{title}</div>
        {caption ? (
          <div className="text-xs text-ink-muted">
            {caption}
            {unit ? <span className="ml-1">· values in {unit}</span> : null}
          </div>
        ) : unit ? (
          <div className="text-xs text-ink-muted">values in {unit}</div>
        ) : null}
      </figcaption>
      <div style={{ height }}>
        {type === 'bar' && (
          <Bar
            data={data as unknown as ChartData<'bar', number[], string>}
            options={cartesianOptions as ChartOptions<'bar'>}
          />
        )}
        {type === 'line' && (
          <Line
            data={data as unknown as ChartData<'line', number[], string>}
            options={cartesianOptions as ChartOptions<'line'>}
          />
        )}
        {type === 'doughnut' && (
          <Doughnut
            data={data as unknown as ChartData<'doughnut', number[], string>}
            options={baseOptions as ChartOptions<'doughnut'>}
          />
        )}
      </div>
    </figure>
  );
}

export default LockedChart;
