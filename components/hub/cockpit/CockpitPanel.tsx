'use client';

import * as React from 'react';

/**
 * Cockpit surface primitives — used ONLY inside the Smart Sizing simulator
 * (`/hub/simulator`). Provides the dark instrument-panel surface system that
 * sets the cockpit apart from the rest of the (light) hub.
 *
 * Token contract: every color is sourced from `--cockpit-*` and `--lamp-*`
 * variables in `app/styles/tokens.css`. No raw hex values here.
 */

export function CockpitFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border ${className}`}
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, rgba(60,90,160,0.12) 0%, transparent 50%), var(--cockpit-bg)',
        borderColor: 'var(--cockpit-edge)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px -32px rgba(0,0,0,0.55)',
        color: 'var(--cockpit-ink)',
      }}
    >
      {children}
    </div>
  );
}

export function CockpitPanel({
  eyebrow,
  title,
  right,
  children,
  variant = 'default',
  className = '',
}: {
  eyebrow?: string;
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'raised' | 'verdict';
  className?: string;
}) {
  const bg = variant === 'raised' ? 'var(--cockpit-panel-raised)' : 'var(--cockpit-panel)';
  return (
    <section
      className={`relative rounded-xl border ${className}`}
      style={{
        background: bg,
        borderColor: 'var(--cockpit-rail)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {variant === 'verdict' ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-xl"
          style={{ background: 'var(--cockpit-accent)' }}
        />
      ) : null}
      {(eyebrow || title || right) && (
        <header
          className="flex items-center justify-between gap-3 border-b px-4 py-2.5"
          style={{ borderColor: 'var(--cockpit-rail)' }}
        >
          <div className="min-w-0">
            {eyebrow ? (
              <div
                className="text-[10px] font-semibold uppercase leading-none tracking-[0.18em]"
                style={{ color: 'var(--cockpit-ink-muted)' }}
              >
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <div
                className="mt-1 truncate text-[13px] font-semibold tracking-tight"
                style={{ color: 'var(--cockpit-ink)' }}
              >
                {title}
              </div>
            ) : null}
          </div>
          {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CockpitDivider() {
  return <div className="my-3 h-px" style={{ background: 'var(--cockpit-rail)' }} />;
}
