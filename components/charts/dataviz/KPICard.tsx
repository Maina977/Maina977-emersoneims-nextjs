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
 * KPICard — single metric with mandatory unit and consistent status logic.
 * Used across landing, simulator, quote audit, diagnostics, product DB,
 * docs and homepage feature blocks. Do not fork.
 */
export interface KPICardProps {
  /** Short label, e.g. "Generator load". */
  label: string;
  /** Raw numeric value. Pass null/undefined to render an em-dash. */
  value: number | null | undefined;
  /** Unit symbol — REQUIRED for engineering values. Pass "" only for counts. */
  unit: string;
  /** Decimal places. Auto if omitted. */
  decimals?: number;
  /** Optional secondary line, e.g. "Target ≥ 80 %". Should also include units. */
  caption?: string;
  /** Optional thresholds to drive the status color. */
  thresholds?: StatusThresholds;
  /** Force a status, bypassing thresholds. */
  status?: StatusKey;
  /** Optional delta, e.g. +2.3. Will be rendered with same unit. */
  delta?: number | null;
  /** When true, higher delta is bad (e.g. fault count, temp). */
  deltaInverse?: boolean;
  className?: string;
}

export function KPICard({
  label,
  value,
  unit,
  decimals,
  caption,
  thresholds,
  status: forcedStatus,
  delta,
  deltaInverse = false,
  className = '',
}: KPICardProps) {
  const statusKey: StatusKey =
    forcedStatus ?? (typeof value === 'number' ? resolveStatus(value, thresholds) : 'neutral');
  const palette = statusPalette(statusKey);

  const deltaStatus: StatusKey =
    delta == null
      ? 'neutral'
      : (delta > 0) === deltaInverse
      ? 'danger'
      : delta === 0
      ? 'neutral'
      : 'success';
  const deltaPalette = statusPalette(deltaStatus);

  // Split the formatted string into number + unit so we can render the
  // unit one step lighter than the value (premium numeric hierarchy).
  const formatted = formatValue(value ?? null, { unit, decimals });
  const unitTrim = (unit ?? '').trim();
  let numPart = formatted;
  let unitPart = '';
  if (unitTrim && formatted.endsWith(unitTrim)) {
    numPart = formatted.slice(0, formatted.length - unitTrim.length).trimEnd();
    unitPart = unitTrim;
  }

  return (
    <div
      className={`rounded-lg border bg-surface-base p-4 shadow-sm ${className}`}
      style={{ borderColor: 'var(--color-border-subtle)' }}
      role="group"
      aria-label={`${label}: ${formatted}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</span>
        <span
          className="status-dot"
          style={{ background: palette.solid }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className="text-3xl font-semibold tracking-tight tabular-nums"
          style={{ color: palette.fg, fontVariantNumeric: 'tabular-nums' }}
        >
          {numPart}
        </span>
        {unitPart ? (
          <span
            className="text-sm font-medium text-ink-muted tabular-nums"
            aria-hidden="true"
          >
            {unitPart}
          </span>
        ) : null}
        {delta != null && Number.isFinite(delta) ? (
          <span
            className="ml-1 text-sm font-semibold tabular-nums"
            style={{ color: deltaPalette.solid }}
            aria-label={`Change ${formatValue(delta, { unit, decimals })}`}
          >
            {delta > 0 ? '▲' : delta < 0 ? '▼' : '■'} {formatValue(Math.abs(delta), { unit, decimals })}
          </span>
        ) : null}
      </div>

      {caption ? (
        <p className="mt-1 text-xs text-ink-muted">{caption}</p>
      ) : null}
    </div>
  );
}

export default KPICard;
