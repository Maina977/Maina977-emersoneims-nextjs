'use client';

import * as React from 'react';
import Link from 'next/link';

/**
 * SolarGeniusGlobalBand — positioning band that frames SolarGeniusPro as a
 * professional engineering toolkit aimed at the wider African market and
 * globally relevant solar workflows. Sits at the very top of the page so
 * the first paint clearly communicates category, audience, and credible
 * supporting routes (calculator, design studio, fault codes, dashboard).
 */
export default function SolarGeniusGlobalBand() {
  return (
    <section
      aria-label="SolarGeniusPro positioning"
      className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
            <span aria-hidden className="text-lg font-bold tracking-tight">SG</span>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              Free solar sizing and engineering tools · built for Kenya
            </div>
            <div className="truncate text-sm font-semibold text-white">
              SolarGeniusPro — sizing, roof layout, wiring checks and inverter fault codes in one place
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-[12px]" aria-label="SolarGeniusPro modules">
          <NavChip href="/solar-genius-pro/calculator-advanced" label="Calculator" />
          <NavChip href="/solar-genius-pro/design-studio" label="Design studio" />
          <NavChip href="/solar-genius-pro/fault-codes" label="Fault codes" />
          <NavChip href="/solar-genius-pro/solar-dashboard" label="Dashboard" />
          <NavChip href="/hub/simulator" label="Hub simulator" external />
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-4 text-xs text-amber-100/70 md:grid-cols-3 md:px-6">
        <Pillar
          eyebrow="For"
          body="Homeowners, farms and businesses planning solar, and the installers and engineers who build it."
        />
        <Pillar
          eyebrow="Solves"
          body="Sizing from NASA sun-hours, battery sized to the backup you want, inverter loading, cable and string checks, and inverter fault-code triage."
        />
        <Pillar
          eyebrow="Trust"
          body="Transparent assumptions, sample data clearly badged, deterministic calculations, hardware-grade fault-code library, no fabricated confidence."
        />
      </div>
    </section>
  );
}

function NavChip({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 font-semibold text-amber-200 transition-colors hover:border-amber-400/50 hover:bg-amber-500/10"
    >
      {label}
      {external ? <span aria-hidden className="ml-1 opacity-60">↗</span> : null}
    </Link>
  );
}

function Pillar({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="rounded-lg border border-amber-500/15 bg-slate-900/40 px-3 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-300/70">
        {eyebrow}
      </div>
      <div className="mt-1 leading-snug">{body}</div>
    </div>
  );
}
