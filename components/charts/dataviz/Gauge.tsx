'use client';

import * as React from 'react';
import {
  formatValue,
  resolveStatus,
  statusPalette,
  type StatusKey,
  type StatusThresholds,
} from './tokens';

/**
 * Gauge — flat 2D radial gauge (270° arc) using the same status palette as
 * KPI cards and status bars. No 3D, no glow, no decorative effects.
 *
 * Units are mandatory.
 */
export interface GaugeProps {
  label: string;
  value: number;
  min?: number;
  max: number;
  /** Unit symbol — REQUIRED. */
  unit: string;
  decimals?: number;
  /** Optional thresholds to drive arc color. If omitted, derived from % of range. */
  thresholds?: StatusThresholds;
  /** Force a status, bypassing thresholds. */
  status?: StatusKey;
  /** Pixel size of the gauge SVG. Default 160. */
  size?: number;
  className?: string;
}

const ARC_DEGREES = 270;
const ARC_OFFSET = 135; // start at south-west, sweep clockwise

export function Gauge({
  label,
  value,
  min = 0,
  max,
  unit,
  decimals,
  thresholds,
  status: forcedStatus,
  size = 160,
  className = '',
}: GaugeProps) {
  const safeMax = max <= min ? min + 1 : max;
  const clamped = Math.min(Math.max(value, min), safeMax);
  const pct = (clamped - min) / (safeMax - min);

  const defaultThresholds: StatusThresholds = thresholds ?? {
    danger: 15,
    warning: 35,
    success: 70,
  };
  const statusKey: StatusKey =
    forcedStatus ?? resolveStatus(thresholds ? value : pct * 100, defaultThresholds);
  const palette = statusPalette(statusKey);

  const stroke = Math.max(12, Math.round(size * 0.11));
  const radius = size / 2 - stroke;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (ARC_DEGREES / 360) * circumference;
  const valueLength = arcLength * pct;

  // Format value/unit so the unit can render at a smaller, lighter weight.
  const formatted = formatValue(value, { unit, decimals });
  const unitTrim = (unit ?? '').trim();
  let centerNum = formatted;
  let centerUnit = '';
  if (unitTrim && formatted.endsWith(unitTrim)) {
    centerNum = formatted.slice(0, formatted.length - unitTrim.length).trimEnd();
    centerUnit = unitTrim;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${formatted} of ${formatValue(safeMax, { unit, decimals })}`}
      >
        {/* Track — heavier so the instrument reads as confident, not wireframe */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-surface-sunken)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(${ARC_OFFSET} ${cx} ${cy})`}
          opacity={0.85}
        />
        {/* Value arc — solid status color, same stroke as track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={palette.solid}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${valueLength} ${circumference}`}
          transform={`rotate(${ARC_OFFSET} ${cx} ${cy})`}
        />
        {/* Center value — larger, tabular numerals */}
        <text
          x={cx}
          y={cy - Math.round(size * 0.02)}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fill: palette.fg,
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: Math.round(size * 0.24),
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}
        >
          {centerNum}
        </text>
        {/* Center unit — one step lighter and smaller */}
        {centerUnit ? (
          <text
            x={cx}
            y={cy + Math.round(size * 0.18)}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fill: 'var(--color-ink-muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: Math.round(size * 0.1),
              letterSpacing: '0.04em',
            }}
          >
            {centerUnit}
          </text>
        ) : null}
      </svg>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</span>
    </div>
  );
}

export default Gauge;
