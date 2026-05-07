import * as React from 'react';
import Link from 'next/link';
import {
  HubShell,
  SectionHeading,
  Card,

  SampleBadge,
} from '@/components/hub/HubShell';
import { HUB_TOOLS } from '@/components/hub/hub-tools';
import { StatusBar } from '@/components/charts/dataviz';
import LazyLockedChart from '@/components/charts/LazyLockedChart';

export const metadata = {
  title: 'Solar & UPS Intelligence Hub',
  description:
    'Solar & UPS Intelligence Hub — sizing, audit, product intelligence, diagnostics, solar/UPS and the case library, in one workspace.',
};

/* ---------- Local content ---------- */

const FLAGSHIP_TOOL = {
  href: '/hub/simulator',
  title: 'Smart Sizing Cockpit',
  caption:
    'Get the kVA, derate and battery picture right before you quote or audit. Sizing is the upstream decision; everything downstream improves when sizing is correct.',
  meta: 'Cockpit · sample dataset · units shown on every value',
} as const;

const TOOL_CAPTIONS: Record<string, string> = {
  '/hub/verifier':             'Signature tool: enter loads + quote + budget; get a verdict, missing items, safety risks, and a 10-year cost comparison against cheaper-safe and premium alternatives.',
  '/hub/ups-lab':              'UPS Live Lab — interactive cockpit. Pick UPS units, add loads (servers, computers, fridges, motors), and watch input vs output, headroom, runtime and alarms update live.',
  '/hub/quote-audit':          'Audit a vendor quote against the sized envelope. Flag oversizing, undersizing and missing line-items.',
  '/hub/product-intelligence': 'Browse the catalogue: gensets, UPS, batteries and PV strings, with traceable specs.',
  '/hub/installation':         'Installation Visualizer — single-line diagram, breaker chain, earthing, SPDs and panel layout for the chosen architecture.',
  '/hub/authenticity':         'Authenticity Verification — serial portals, BIS/CE marks, seal photos and field-verification cautions by brand.',
  '/hub/maintenance':          'Maintenance Planner — scheduled tasks, intervals, consumables and predictive checks per battery chemistry and inverter family.',
  '/hub/safety':               'Safety & Fire Prevention — thermal-runaway, ventilation, clearance, PPE and fire-class extinguisher matrix.',
  '/hub/abuse':                'Abuse / Misuse Predictor — what happens when batteries are over-discharged, AVR is bypassed, or loads are run undervoltage.',
  '/hub/power-quality':        'Power Quality dashboard — voltage, THD-V, THD-I, frequency, sags/swells and flicker against EN 50160 / IEEE 519 with prioritised recommendations.',
  '/hub/lifecycle':            'Lifecycle Cost Calculator — 25-year discounted cashflow comparing grid-only, grid + diesel, and solar/UPS hybrid; returns NPV and payback.',
  '/hub/doc-pack':             'Documentation Pack — printable installer & commissioning bundle with SLD reference, checklist, acceptance test record and sign-off.',
  '/hub/learn':                'Learning Mode — short structured lessons. Client basics on the Client side; engineering depth on the Pro side.',
  '/hub/diagnostics':          'Walk through alarms and field symptoms with structured fault-tree guidance.',
  '/hub/solar-ups':            'Hybrid solar + UPS sizing notes, derate factors and architecture patterns.',
  '/hub/library':              'Case studies, datasheets and reference documents collected from real deployments.',
};

const TOOL_CARDS = HUB_TOOLS.filter(
  (t) => t.href !== '/hub' && t.href !== '/hub/simulator',
).map((t) => ({
  href: t.href,
  title: t.label,
  caption: TOOL_CAPTIONS[t.href] ?? '',
  meta: t.short,
}));

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const SAMPLE_MAINS = [
  120, 110, 105, 100, 98, 102, 130, 180, 220, 240, 250, 245,
  240, 235, 230, 225, 220, 215, 210, 200, 180, 160, 140, 125,
];
const SAMPLE_PV = [
  0, 0, 0, 0, 0, 5, 25, 60, 110, 160, 195, 215,
  220, 215, 195, 160, 110, 60, 25, 5, 0, 0, 0, 0,
];

export default function HubLandingPage() {
  return (
    <HubShell
      active="/hub"
      title="Solar & UPS Intelligence Hub"
      caption="All engineering tools in one workspace. Sizing, audit, product intelligence, diagnostics, solar/UPS and the case library."
    >
      {/* Flagship tool ─────────────────────────────────────── */}
      <section aria-labelledby="hub-flagship" className="mb-8">
        <SectionHeading
          eyebrow="Flagship tool"
          title="Start here"
          caption="Sizing is the upstream decision. Get the kVA, derate and battery picture right before quoting or auditing."
        />
        <Link
          href={FLAGSHIP_TOOL.href}
          className="group relative block overflow-hidden rounded-xl border bg-surface-base p-6 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 md:p-8"
          style={{
            borderColor: 'var(--color-border-subtle)',
            // @ts-expect-error custom prop fallback
            '--tw-ring-color': 'var(--color-brand-blue)',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1"
            style={{
              background:
                'linear-gradient(180deg, var(--color-brand-blue) 0%, var(--color-brand-gold-deep) 100%)',
            }}
          />
          <div className="grid items-stretch gap-6 md:grid-cols-[1fr_280px]">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                Step 1 · Sizing
                <span className="status-chip status-chip--info">Recommended start</span>
                <span
                  className="status-chip"
                  style={{
                    background: 'rgba(11,18,32,0.92)',
                    color: 'var(--lamp-info)',
                    borderColor: 'transparent',
                  }}
                >
                  Cockpit edition
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {FLAGSHIP_TOOL.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted md:text-[15px]">
                {FLAGSHIP_TOOL.caption}
              </p>
              <div className="mt-3 text-xs text-ink-muted">{FLAGSHIP_TOOL.meta}</div>
              <div className="mt-auto pt-4">
                <span
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform group-hover:translate-x-0.5"
                  style={{ background: 'var(--color-brand-blue)' }}
                >
                  Open Cockpit <span aria-hidden>→</span>
                </span>
              </div>
            </div>
            <CockpitTeaser />
          </div>
        </Link>
      </section>

      {/* Tools grid ───────────────────────────────────────── */}
      <section aria-labelledby="hub-tools" className="mb-12">
        <SectionHeading
          eyebrow="Workspace"
          title="Other tools"
          caption="Build order: sizing → audit → intelligence → diagnostics → solar/UPS → library."
        />
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TOOL_CARDS.map((t, i) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group relative block h-full overflow-hidden rounded-xl bg-surface-base p-5 transition-all hover:-translate-y-[2px] focus:outline-none"
                style={{
                  boxShadow:
                    '0 1px 0 0 rgba(255,255,255,0.6) inset,' +
                    ' 0 0 0 1px rgba(15,30,60,0.08),' +
                    ' 0 22px 45px -28px rgba(8,15,35,0.55)',
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-70 transition-opacity group-hover:opacity-100"
                  style={{ background: 'linear-gradient(90deg, #0071e3 0%, #4cd2ee 40%, #c9a64a 80%, transparent 100%)' }}
                />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    Step {i + 2}
                  </span>
                  <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: 'rgba(0,113,227,0.08)', color: '#0071e3' }}>{t.meta}</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{t.caption}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#0071e3' }}>
                  Open <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Sample dashboards ────────────────────────────────── */}
      <section aria-labelledby="hub-overview" className="mb-12 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading
              eyebrow="Live preview"
              title="Site load profile"
              caption="Mains vs. solar over 24 h"
            />
            <SampleBadge />
          </div>
          <LazyLockedChart
            type="line"
            title="Mains vs. PV generation"
            caption="Sample dataset · last 24 h"
            unit="kW"
            decimals={0}
            labels={HOURS}
            series={[
              { label: 'Mains demand', data: SAMPLE_MAINS },
              { label: 'PV generation', data: SAMPLE_PV },
            ]}
          />
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Status" title="Plant health" />
            <SampleBadge />
          </div>
          <div className="space-y-4">
            <StatusBar
              label="Generator load"
              value={68}
              max={100}
              unit="%"
              thresholds={{ warning: 80, danger: 95, invert: true }}
            />
            <StatusBar
              label="Battery state of charge"
              value={42}
              max={100}
              unit="%"
              thresholds={{ danger: 20, warning: 40, success: 80 }}
            />
            <StatusBar
              label="Fuel level"
              value={310}
              max={500}
              unit="L"
              thresholds={{ danger: 75, warning: 150, success: 250 }}
            />
            <StatusBar
              label="Coolant temperature"
              value={86}
              max={110}
              unit="°C"
              thresholds={{ warning: 95, danger: 105, invert: true }}
            />
          </div>
          <div
            className="mt-5 border-t pt-4"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Today&rsquo;s findings · sample
            </div>
            <ul className="space-y-1.5 text-xs text-ink-secondary">
              <li className="flex items-center gap-2">
                <span className="status-chip status-chip--warning">warn</span>
                Coolant temp trending up &mdash; check radiator airflow
              </li>
              <li className="flex items-center gap-2">
                <span className="status-chip status-chip--info">info</span>
                Battery SoC 42% &mdash; recharge cycle scheduled 18:00
              </li>
              <li className="flex items-center gap-2">
                <span className="status-chip status-chip--success">ok</span>
                Generator load within nominal envelope
              </li>
            </ul>
          </div>
        </Card>
      </section>
    </HubShell>
  );
}

function CockpitTeaser() {
  return (
    <div
      className="relative overflow-hidden rounded-lg border p-3"
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, rgba(60,90,160,0.18) 0%, transparent 55%), #0b1220',
        borderColor: '#2b3a5c',
        color: '#e6edf7',
        minHeight: 160,
      }}
      aria-hidden
    >
      <div
        className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: '#8a99b8' }}
      >
        <span>Cockpit · preview</span>
        <span style={{ color: '#c9a64a' }}>SU</span>
      </div>
      <div
        className="mt-2 rounded-md border px-3 py-2"
        style={{
          borderColor: '#1f2a44',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.02) 100%), #16203a',
        }}
      >
        <div
          className="text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: '#8a99b8' }}
        >
          Recommended
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            style={{
              color: '#e6edf7',
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1.1,
              textShadow: '0 0 10px rgba(76,210,238,0.35)',
              letterSpacing: '-0.01em',
            }}
          >
            250
          </span>
          <span style={{ color: '#6b7a99', fontSize: 11 }}>kVA</span>
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {(
          [
            { c: '#2cd07a', label: 'OK' },
            { c: '#ffb547', label: 'WARN' },
            { c: '#57a8ff', label: 'AC' },
          ] as const
        ).map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-1.5 rounded-sm border px-1.5 py-1 text-[9px] font-semibold"
            style={{ borderColor: '#1f2a44', background: '#16203a', color: '#e6edf7' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: l.c, boxShadow: `0 0 4px ${l.c}` }}
            />
            {l.label}
          </div>
        ))}
      </div>
      <div className="mt-2.5">
        <div
          className="mb-1 flex justify-between text-[9px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: '#8a99b8' }}
        >
          <span>Load</span>
          <span style={{ color: '#e6edf7', fontFamily: 'ui-monospace, monospace' }}>
            72<span style={{ color: '#6b7a99' }}>%</span>
          </span>
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-[1px]"
              style={{
                background: i < 11 ? '#2cd07a' : '#1f2a44',
                boxShadow: i < 11 ? '0 0 3px #2cd07a80' : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
