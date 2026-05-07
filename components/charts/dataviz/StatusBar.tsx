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
 * StatusBar — horizontal bar showing a value within a min/max range, colored
 * by the same status logic as the rest of the system. Use for load %,
 * battery SOC, fuel level, capacity utilisation, etc.
 *
 * Units are mandatory.
 */
export interface StatusBarProps {
  label: string;
  value: number;
  min?: number;
  max: number;
  /** Unit symbol — REQUIRED. */
  unit: string;
  decimals?: number;
  /** Optional thresholds. If omitted, status is derived from % of max. */
  thresholds?: StatusThresholds;
  /** Force a status, bypassing thresholds. */
  status?: StatusKey;
  /** Show numeric value on the right (default true). */
  showValue?: boolean;
  className?: string;
}

export function StatusBar({
  label,
  value,
  min = 0,
  max,
  unit,
  decimals,
  thresholds,
  status: forcedStatus,
  showValue = true,
  className = '',
}: StatusBarProps) {
  const safeMax = max <= min ? min + 1 : max;
  const clamped = Math.min(Math.max(value, min), safeMax);
  const pct = ((clamped - min) / (safeMax - min)) * 100;

  // Default thresholds expressed as % of range when none provided.
  const defaultThresholds: StatusThresholds = thresholds ?? {
    danger: 15,
    warning: 35,
    success: 70,
  };
  const statusKey: StatusKey =
    forcedStatus ?? resolveStatus(thresholds ? value : pct, defaultThresholds);
  const palette = statusPalette(statusKey);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink-secondary">{label}</span>
        {showValue ? (
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: palette.fg, fontVariantNumeric: 'tabular-nums' }}
          >
            {formatValue(value, { unit, decimals })}
            <span className="ml-1 text-ink-muted font-normal">
              / {formatValue(safeMax, { unit, decimals })}
            </span>
          </span>
        ) : null}
      </div>

      <div
        className="mt-1 h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--color-surface-sunken)' }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-label={`${label}: ${formatValue(value, { unit, decimals })} of ${formatValue(safeMax, { unit, decimals })}`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: palette.solid,
            transitionDuration: 'var(--duration-base)',
            transitionTimingFunction: 'var(--ease-apple)',
          }}
        />
      </div>
    </div>
  );
}

export default StatusBar;
