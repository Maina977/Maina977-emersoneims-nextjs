'use client';

import * as React from 'react';

export type LampState = 'ok' | 'warn' | 'fault' | 'info' | 'off';

const LAMP_TOKENS: Record<LampState, { color: string; halo: string; label: string }> = {
  ok:    { color: 'var(--lamp-ok)',    halo: 'var(--lamp-ok-halo)',    label: 'Healthy' },
  warn:  { color: 'var(--lamp-warn)',  halo: 'var(--lamp-warn-halo)',  label: 'Caution' },
  fault: { color: 'var(--lamp-fault)', halo: 'var(--lamp-fault-halo)', label: 'Fault' },
  info:  { color: 'var(--lamp-info)',  halo: 'var(--lamp-info-halo)',  label: 'Active' },
  off:   { color: 'var(--lamp-off)',   halo: 'var(--lamp-off-halo)',   label: 'Off' },
};

/**
 * Illuminated cockpit lamp + label. Renders an LED-style dot with a soft halo
 * and optional pulse on `pulse` prop (used for active fault states).
 */
export function StatusLight({
  state,
  label,
  description,
  pulse,
  size = 'md',
}: {
  state: LampState;
  label: string;
  description?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}) {
  const t = LAMP_TOKENS[state];
  const dot = size === 'sm' ? 8 : 10;
  const halo = size === 'sm' ? 16 : 22;
  return (
    <div className="flex items-center gap-2.5" title={description ?? t.label}>
      <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: halo, height: halo }}>
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${t.halo} 0%, transparent 70%)`,
            opacity: state === 'off' ? 0 : 1,
          }}
        />
        <span
          aria-hidden
          className={`relative rounded-full ${pulse && state !== 'off' ? 'cockpit-lamp-pulse' : ''}`}
          style={{
            width: dot,
            height: dot,
            background: t.color,
            boxShadow:
              state === 'off'
                ? 'inset 0 0 0 1px rgba(255,255,255,0.06)'
                : `0 0 0 1px rgba(255,255,255,0.06), 0 0 6px ${t.halo}`,
          }}
        />
      </span>
      <span className="min-w-0">
        <span
          className="block truncate text-[11px] font-medium leading-tight"
          style={{ color: 'var(--cockpit-ink)' }}
        >
          {label}
        </span>
        {description ? (
          <span
            className="block truncate text-[10px] leading-tight"
            style={{ color: 'var(--cockpit-ink-muted)' }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );
}

/**
 * Compact LED bar — horizontal row of lamps used for "lamp test" or
 * mode-bank style indicators.
 */
export function LampBar({ items }: { items: Array<{ state: LampState; label: string }> }) {
  return (
    <div
      className="flex items-center gap-x-4 gap-y-2 rounded-md border px-3 py-2"
      style={{ borderColor: 'var(--cockpit-rail)', background: 'var(--cockpit-panel-raised)' }}
    >
      {items.map((it) => (
        <StatusLight key={it.label} state={it.state} label={it.label} size="sm" />
      ))}
    </div>
  );
}
