import Link from 'next/link';
import { SERVICE_DIVISIONS } from '@/lib/services/serviceDivisions';

/**
 * THE TWELVE DIVISIONS, RENDERED.
 *
 * SERVER-RENDERED ON PURPOSE. No 'use client', no dynamic import, no
 * LazyOnVisible wrapper. This is the section that tells a crawler what the
 * company does and hands link equity to 75 destinations; the nav mega-menu on
 * this same site renders client-side and is invisible to crawlers, which is
 * the mistake this must not repeat.
 *
 * EVERY LINK IS GUARDED. scripts/check-divisions.mjs runs in prebuild and
 * fails the build if any href here resolves to no route.
 *
 * CONTRAST. Body text is slate-300 and meta text slate-400 on slate-900/950.
 * The site has existing failures at text-white/45 and text-slate-500 — around
 * 3:1, under the 4.5:1 WCAG AA needs — so neither is used here. slate-400 on
 * slate-900 is ~7:1.
 *
 * TOUCH TARGETS. Every link is a block with py-2 (40px+ effective), not an
 * inline run of text. The 6px carousel dots elsewhere on this site are the
 * counter-example.
 */
export default function ServiceDivisions() {
  return (
    <section
      id="divisions"
      aria-labelledby="divisions-heading"
      className="px-4 py-16 scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
            Our services
          </p>
          <h2
            id="divisions-heading"
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          >
            Twelve engineering divisions, one accountable partner
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Power, water and building engineering under one contract — so a
            hot-water fault traced to a pump, or a rewind that turns out to be a
            supply problem, does not become two contractors blaming each other.
          </p>
        </header>

        {/* Jump index. Server-rendered anchors, so a crawler sees all twelve
            names in one block near the top of the section. */}
        <nav aria-label="Jump to a division" className="mb-12">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_DIVISIONS.map((d) => (
              <li key={d.id}>
                <a
                  href={`#division-${d.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3 transition-colors hover:border-cyan-500/60 hover:bg-slate-800/80"
                >
                  <span
                    className="font-mono text-sm font-semibold text-cyan-400"
                    aria-hidden="true"
                  >
                    {d.no}
                  </span>
                  <span className="text-xl leading-none" aria-hidden="true">
                    {d.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {d.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {SERVICE_DIVISIONS.map((d) => (
            <article
              key={d.id}
              id={`division-${d.id}`}
              aria-labelledby={`division-${d.id}-title`}
              className="scroll-mt-32 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/30"
            >
              <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10 lg:p-8">
                {/* ── Left: who this division is ── */}
                <div>
                  <div className="mb-3 flex items-baseline gap-3">
                    <span
                      className="font-mono text-2xl font-bold text-cyan-400"
                      aria-hidden="true"
                    >
                      {d.no}
                    </span>
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {d.icon}
                    </span>
                  </div>

                  <h3
                    id={`division-${d.id}-title`}
                    className="mb-3 text-xl font-bold leading-snug text-white sm:text-2xl"
                  >
                    {d.title}
                  </h3>

                  <ul className="mb-4 flex flex-wrap gap-1.5">
                    {d.strapline.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>

                  <p className="mb-5 text-sm leading-relaxed text-slate-400">
                    {d.blurb}
                  </p>

                  <Link
                    href={d.hub.href}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
                  >
                    {d.hub.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* ── Right: what is actually under it ── */}
                <div>
                  <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    What this covers
                  </h4>
                  <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    {d.items.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="block rounded py-2 text-sm leading-snug text-slate-300 transition-colors hover:text-cyan-400"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {d.serviced && d.serviced.length > 0 && (
                    <div className="mt-6 border-t border-slate-700/60 pt-5">
                      {/*
                        THE WORDING HERE IS LOAD-BEARING. VOLTKA is the only make
                        sold new; these are makes we service and hold parts for.
                        "We service and supply parts for" is the claim, and it is
                        one the brand pages, the workshop and the fault-code
                        database all evidence. It is not a dealership claim.
                      */}
                      <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                        Makes we service &amp; supply parts for
                      </h4>
                      <ul className="flex flex-wrap gap-2">
                        {d.serviced.map((b) => (
                          <li key={b.href}>
                            <Link
                              href={b.href}
                              prefetch={false}
                              className="inline-block rounded-lg border border-slate-600/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/60 hover:text-cyan-400"
                            >
                              {b.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs leading-relaxed text-slate-400">
                        VOLTKA is the make we sell new. We are not an authorised
                        dealer for the others — we service them, and we hold and
                        supply their parts.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing CTA. Three intents, because a visitor at the bottom of this
            list is either specifying, buying or already broken down. */}
        <div className="mt-10 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 p-6 sm:p-8">
          <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
            Not sure which division you need?
          </h3>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-300">
            Most sites that call us need two or three of the above. Tell us what
            the problem looks like and an engineer will scope it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              prefetch={false}
              className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Request a quote
            </Link>
            <Link
              href="/booking"
              prefetch={false}
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-400"
            >
              Book a site survey
            </Link>
            <Link
              href="/repair-centre"
              prefetch={false}
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-400"
            >
              Emergency &amp; breakdown
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
