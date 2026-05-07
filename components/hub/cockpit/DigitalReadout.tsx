'use client';

import * as React from 'react';

/**
 * Engineering digital readout — large tabular-num value with eyebrow + unit,
 * inset on a sunken cockpit slot. Used by the instrument cluster.
 */
export function DigitalReadout({
  label,
  value,
  unit,
  decimals = 1,
  status = 'ok',
  caption,
  size = 'md',
}: {
  label: string;
  value: number | null | undefined;
  unit?: string;
  decimals?: number;
  status?: 'ok' | 'warn' | 'fault' | 'info';
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const txt =
    value == null || !Number.isFinite(value as number)
      ? '—'
      : (value as number).toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  const colorMap = {
    ok: 'var(--lamp-ok)',
    warn: 'var(--lamp-warn)',
    fault: 'var(--lamp-fault)',
    info: 'var(--lamp-info)',
  } as const;
  const valueSize = size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  return (
    <div
      className="rounded-md border px-3 py-2.5"
      style={{
        borderColor: 'var(--cockpit-rail)',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.02) 100%), var(--cockpit-panel-raised)',
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'var(--cockpit-ink-muted)' }}
      >
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span
          className={`font-semibold tabular-nums ${valueSize}`}
          style={{
            color: colorMap[status],
            fontFamily: 'ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, monospace',
            textShadow:
              status === 'fault' || status === 'warn'
                ? `0 0 8px ${colorMap[status]}55`
                : `0 0 6px ${colorMap[status]}30`,
            letterSpacing: '-0.01em',
          }}
        >
          {txt}
        </span>
        {unit ? (
          <span className="text-[11px]" style={{ color: 'var(--cockpit-ink-unit)' }}>
            {unit}
          </span>
        ) : null}
      </div>
      {caption ? (
        <div className="mt-0.5 text-[10px]" style={{ color: 'var(--cockpit-ink-unit)' }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Horizontal segmented bar — used for load %, SOC %, support margin, etc.
 * Renders 20 cells; lit cells follow the status color.
 */
export function SegmentBar({
  label,
  pct,
  status = 'ok',
  unit = '%',
}: {
  label: string;
  pct: number;
  status?: 'ok' | 'warn' | 'fault' | 'info';
  unit?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const lit = Math.round((clamped / 100) * 20);
  const colorMap = {
    ok: 'var(--lamp-ok)',
    warn: 'var(--lamp-warn)',
    fault: 'var(--lamp-fault)',
    info: 'var(--lamp-info)',
  } as const;
  const color = colorMap[status];
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--cockpit-ink-muted)' }}
        >
          {label}
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: 'var(--cockpit-ink)', fontFamily: 'ui-monospace, monospace' }}
        >
          {clamped.toFixed(0)}
          <span className="ml-0.5" style={{ color: 'var(--cockpit-ink-unit)' }}>
            {unit}
          </span>
        </span>
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="h-2 flex-1 rounded-[1px]"
            style={{
              background: i < lit ? color : 'var(--cockpit-rail)',
              boxShadow: i < lit ? `0 0 4px ${color}80` : undefined,
              opacity: i < lit ? 1 : 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}
