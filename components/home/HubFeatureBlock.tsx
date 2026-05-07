import * as React from 'react';
import Link from 'next/link';
import { HUB_TOOLS } from '@/components/hub/hub-tools';

/**
 * Homepage Feature Block — Solar & UPS Intelligence Hub.
 *
 * Restyled to match the dark, glass-card design language of the
 * surrounding homepage sections (AITechnologyShowcase, AquaScan Pro card).
 * Uses bg-white/5 backdrop blur, amber/cyan accents, and a compact
 * footprint that blends with the EmersonEIMS family of cards.
 *
 * No charts/gauges here — keeps homepage LCP fast.
 */

const TOOLS = HUB_TOOLS.filter((t) => t.href !== '/hub');

const HIGHLIGHT_HREFS = [
  '/hub/simulator',
  '/hub/ups-lab',
  '/hub/product-intelligence',
  '/hub/verifier',
  '/hub/quote-audit',
  '/hub/diagnostics',
];

const HIGHLIGHT_TOOLS = HIGHLIGHT_HREFS
  .map((href) => TOOLS.find((t) => t.href === href))
  .filter((t): t is (typeof TOOLS)[number] => Boolean(t));

export function HubFeatureBlock() {
  return (
    <section
      aria-labelledby="hub-feature-heading"
      className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 20%, rgba(245,158,11,0.08), transparent 60%), radial-gradient(50% 40% at 80% 80%, rgba(56,189,248,0.07), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow + title — same rhythm as AITechnologyShowcase */}
        <div className="mb-10 sm:mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 px-4 py-2 text-sm font-medium text-amber-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Solar &amp; UPS Intelligence Hub
          </span>
          <h2
            id="hub-feature-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Size, audit and diagnose
            <span className="block bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Solar &amp; UPS — in one workspace
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            One consistent design and data-visualisation system across sizing,
            quote audit, product intelligence, UPS cockpit, diagnostics and the
            case library. Every value carries its unit.
          </p>
        </div>

        {/* Compact promo card — single rectangle, dark-glass family */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-500 hover:border-amber-500/40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100"
          />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:p-10">
            {/* Left — pitch + CTAs */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Resources · Hub
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Premium engineering, on every screen
              </h3>
              <p className="mt-3 text-sm text-gray-300 sm:text-base">
                {TOOLS.length} integrated tools — sizing, audit, intelligence,
                UPS cockpit, diagnostics and the case library — sharing the same
                status colours, units and design tokens. No drift.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/hub"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-black shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Open the Hub
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/hub/simulator"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-cyan-400/40 hover:bg-white/10"
                >
                  Try Smart Sizing
                </Link>
                <Link
                  href="/hub/ups-lab"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-amber-400/40 hover:bg-white/10"
                >
                  UPS Live Lab
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                <span>
                  <span className="font-bold tabular-nums text-amber-400">
                    {TOOLS.length}
                  </span>{' '}
                  integrated tools
                </span>
                <span>
                  <span className="font-bold text-cyan-300">A–G</span> internal
                  suitability grading
                </span>
                <span>
                  <span className="font-bold text-white">Units on every value</span>
                </span>
              </div>
            </div>

            {/* Right — compact tool grid */}
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {HIGHLIGHT_TOOLS.map((t, i) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="group/tile flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:border-amber-400/40 hover:bg-white/[0.07]"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[11px] font-bold tabular-nums text-black"
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">
                        {t.label}
                      </span>
                      <span className="block text-[11px] text-gray-400">
                        {t.short}
                      </span>
                    </span>
                    <span className="text-gray-500 transition-transform group-hover/tile:translate-x-0.5 group-hover/tile:text-amber-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HubFeatureBlock;
