'use client';

import { useEffect, useState } from 'react';

/**
 * LiveBackendStatus
 *
 * Calls /api/generator-oracle/health from the browser and reports real-time
 * connection status to the diagnostic engine. Shows actual counts pulled from
 * the server-side fault index — never hardcoded, never faked.
 *
 * Three honest states:
 *  - "checking"   → request in flight
 *  - "connected"  → API returned ok:true with a totals payload
 *  - "offline"    → API failed, returned !ok, or returned malformed payload
 */

export interface BackendHealthTotals {
  faultCodes: number;
  verifiedCodes: number;
  templateCodes: number;
  brands: number;
  models: number;
  categories: number;
}

export interface BackendHealthState {
  status: 'checking' | 'connected' | 'offline';
  totals?: BackendHealthTotals;
  error?: string;
  generatedAt?: string;
}

export function useBackendHealth(): BackendHealthState {
  const [state, setState] = useState<BackendHealthState>({ status: 'checking' });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);

    (async () => {
      try {
        const res = await fetch('/api/generator-oracle/health', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) {
          if (!cancelled) setState({ status: 'offline', error: `HTTP ${res.status}` });
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        if (json && json.ok && json.totals && typeof json.totals.faultCodes === 'number') {
          setState({
            status: 'connected',
            totals: json.totals as BackendHealthTotals,
            generatedAt: typeof json.generatedAt === 'string' ? json.generatedAt : undefined,
          });
        } else {
          setState({ status: 'offline', error: 'invalid_payload' });
        }
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'unknown';
        setState({ status: 'offline', error: msg });
      } finally {
        clearTimeout(t);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(t);
    };
  }, []);

  return state;
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US');
}

interface Props {
  variant?: 'banner' | 'compact';
  className?: string;
}

export default function LiveBackendStatus({ variant = 'banner', className = '' }: Props) {
  const health = useBackendHealth();

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 text-xs font-medium ${className}`}
        role="status"
        aria-live="polite"
      >
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            health.status === 'connected'
              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
              : health.status === 'checking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-400'
          }`}
          aria-hidden="true"
        />
        <span className="text-slate-300">
          {health.status === 'connected' && health.totals
            ? `Diagnostic engine connected · ${formatNumber(health.totals.faultCodes)} fault-code references`
            : health.status === 'checking'
              ? 'Checking diagnostic engine…'
              : 'Diagnostic engine unreachable — using offline references'}
        </span>
      </div>
    );
  }

  // banner
  const bg =
    health.status === 'connected'
      ? 'border-emerald-500/40 bg-emerald-500/5'
      : health.status === 'checking'
        ? 'border-amber-500/40 bg-amber-500/5'
        : 'border-rose-500/40 bg-rose-500/5';

  const dot =
    health.status === 'connected'
      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
      : health.status === 'checking'
        ? 'bg-amber-400 animate-pulse'
        : 'bg-rose-400';

  const label =
    health.status === 'connected'
      ? 'Diagnostic engine connected'
      : health.status === 'checking'
        ? 'Verifying diagnostic engine'
        : 'Diagnostic engine unreachable';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border px-4 py-3 ${bg} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${dot}`} aria-hidden="true" />
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>

      {health.status === 'connected' && health.totals && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-300">
          <span>
            <span className="text-cyan-300 font-semibold">{formatNumber(health.totals.faultCodes)}</span> fault-code references
          </span>
          <span>
            <span className="text-emerald-300 font-semibold">{formatNumber(health.totals.verifiedCodes)}</span> manufacturer-curated
          </span>
          <span>
            <span className="text-amber-300 font-semibold">{formatNumber(health.totals.brands)}</span> brands ·{' '}
            <span className="text-amber-300 font-semibold">{formatNumber(health.totals.models)}</span> controllers
          </span>
        </div>
      )}

      {health.status === 'offline' && (
        <div className="text-xs text-slate-400">
          Local fault-code references remain available; live API will reconnect automatically.
        </div>
      )}
    </div>
  );
}
