'use client';

import * as React from 'react';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import { KPICard, formatValue, statusPalette } from '@/components/charts/dataviz';

/**
 * Documentation, Training & Case Library — client island.
 *
 * Three resource collections behind a single search + tag filter.
 * Status badges (e.g. doc revision freshness, course readiness) use the
 * shared status logic.
 */

type Kind = 'doc' | 'training' | 'case';

interface Resource {
  id: string;
  kind: Kind;
  title: string;
  summary: string;
  tags: string[];
  meta: string;
  freshnessDays: number;     // days since last update — drives status
  href?: string;
}

const SAMPLE: Resource[] = [
  // Docs
  { id: 'D-INST-GEN', kind: 'doc', title: 'Diesel generator installation manual',
    summary: 'Foundation, ventilation, exhaust, fuel, earthing and acceptance test sign-off.',
    tags: ['Generator', 'Install', 'Manual'], meta: 'Rev 4.2 · 38 pages',
    freshnessDays: 14 },
  { id: 'D-MAINT-PV', kind: 'doc', title: 'Solar PV preventive maintenance schedule',
    summary: 'Quarterly module wash, IR scan annually, isolation test, breaker exercise.',
    tags: ['Solar', 'Maintenance'], meta: 'Rev 2.0 · 12 pages',
    freshnessDays: 92 },
  { id: 'D-UPS-COMM', kind: 'doc', title: 'UPS commissioning checklist',
    summary: 'Pre-power, battery inrush, transfer test, runtime verification, alarm logging.',
    tags: ['UPS', 'Commissioning'], meta: 'Rev 1.5 · 8 pages',
    freshnessDays: 210 },
  { id: 'D-EARTH', kind: 'doc', title: 'Earthing & lightning protection guide',
    summary: 'TT/TN-S configurations, electrode resistance targets, SPD coordination.',
    tags: ['Safety', 'Standards'], meta: 'Rev 3.1 · 22 pages',
    freshnessDays: 45 },

  // Training
  { id: 'T-OPS-GEN', kind: 'training', title: 'Generator operator (level 1)',
    summary: 'Daily checks, alarm interpretation, safe shutdown, fuel handling.',
    tags: ['Generator', 'Operations'], meta: '4 hours · certificate',
    freshnessDays: 30 },
  { id: 'T-PV-INST', kind: 'training', title: 'Solar PV installer fundamentals',
    summary: 'String design, isolation testing, mounting torque, commissioning sign-off.',
    tags: ['Solar', 'Install'], meta: '12 hours · 3 modules',
    freshnessDays: 60 },
  { id: 'T-AUDIT', kind: 'training', title: 'Quotation audit walk-through',
    summary: 'Use the Hub audit tool: catalogue benchmarks, labour ratios, sanity checks.',
    tags: ['Procurement', 'Audit'], meta: '2 hours',
    freshnessDays: 7 },

  // Cases
  { id: 'C-HOSP-NRB', kind: 'case', title: 'Nairobi tertiary hospital — N+1 250 kVA',
    summary: 'Two synchronised gensets, 30 min UPS, 0 ms transfer for theatre block.',
    tags: ['Healthcare', 'Generator', 'UPS'], meta: '2025 · Nairobi',
    freshnessDays: 120 },
  { id: 'C-FACT-MSA', kind: 'case', title: 'Mombasa industrial — 600 kWp PV + storage',
    summary: 'Self-consumption 78 %, payback 4.6 years, 312 t CO₂/yr avoided.',
    tags: ['Industry', 'Solar'], meta: '2025 · Mombasa',
    freshnessDays: 60 },
  { id: 'C-DC-NRB', kind: 'case', title: 'Tier-III data centre — 800 kVA UPS train',
    summary: '2N topology, lithium strings, 15 min autonomy at 60 % design load.',
    tags: ['Data centre', 'UPS'], meta: '2024 · Nairobi',
    freshnessDays: 280 },
];

const KINDS: Array<{ k: Kind | 'all'; label: string }> = [
  { k: 'all',      label: 'All' },
  { k: 'doc',      label: 'Documentation' },
  { k: 'training', label: 'Training' },
  { k: 'case',     label: 'Case studies' },
];

function freshnessStatus(days: number) {
  return days <= 30 ? 'success' : days <= 90 ? 'info' : days <= 180 ? 'warning' : 'danger';
}

export default function LibraryClient() {
  const [kind, setKind] = React.useState<Kind | 'all'>('all');
  const [query, setQuery] = React.useState('');

  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    SAMPLE.forEach(r => r.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, []);
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const filtered = SAMPLE.filter(r => {
    if (kind !== 'all' && r.kind !== kind) return false;
    if (activeTag && !r.tags.includes(activeTag)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (![r.title, r.summary, r.id, ...r.tags].some(s => s.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const counts = {
    doc:      SAMPLE.filter(r => r.kind === 'doc').length,
    training: SAMPLE.filter(r => r.kind === 'training').length,
    case:     SAMPLE.filter(r => r.kind === 'case').length,
    stale:    SAMPLE.filter(r => r.freshnessDays > 180).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard label="Documents"      value={counts.doc} unit="" />
        <KPICard label="Training tracks" value={counts.training} unit="" />
        <KPICard label="Case studies"   value={counts.case} unit="" />
        <KPICard label="Stale (>180 d)" value={counts.stale} unit="" thresholds={{ warning: 1, danger: 3, invert: true }} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Library" title="Search and filter" />
          <SampleBadge />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, tag, ID…"
            className="w-full max-w-xs rounded-md border bg-surface-base px-3 py-2 text-sm focus:outline-none focus:ring-2 md:w-72"
            style={{
              borderColor: 'var(--color-border-subtle)',
              // @ts-expect-error custom prop
              '--tw-ring-color': 'var(--color-brand-blue)',
            }}
          />
          <div className="inline-flex flex-wrap gap-1">
            {KINDS.map(k => (
              <button
                key={k.k}
                type="button"
                onClick={() => setKind(k.k)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  kind === k.k ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken/60'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-3 py-1 text-xs ${
              activeTag === null ? 'bg-surface-sunken' : 'text-ink-muted hover:bg-surface-sunken/60'
            }`}
          >
            All tags
          </button>
          {allTags.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTag(t === activeTag ? null : t)}
              className={`rounded-full px-3 py-1 text-xs ${
                activeTag === t ? 'bg-surface-sunken text-ink-primary' : 'text-ink-muted hover:bg-surface-sunken/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(r => {
            const sk = freshnessStatus(r.freshnessDays);
            const p = statusPalette(sk);
            return (
              <li key={r.id}>
                <article
                  className="flex h-full flex-col rounded-lg border bg-surface-base p-4 shadow-sm"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      {r.kind === 'doc' ? 'Documentation' : r.kind === 'training' ? 'Training' : 'Case study'}
                    </span>
                    <span className={`status-chip status-chip--${sk}`}>
                      {formatValue(r.freshnessDays, { unit: 'd' })} since update
                    </span>
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{r.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-ink-muted">{r.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {r.tags.map(t => (
                      <span key={t} className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs text-ink-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="font-mono text-ink-muted">{r.id}</span>
                    <span style={{ color: p.fg }}>{r.meta}</span>
                  </div>
                </article>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="md:col-span-2 xl:col-span-3 rounded-md border bg-surface-base p-6 text-center text-ink-muted"
                style={{ borderColor: 'var(--color-border-subtle)' }}>
              No resources match the filter.
            </li>
          )}
        </ol>
      </Card>

      <HubConnectStrip active="/hub/library" />
    </div>
  );
}
