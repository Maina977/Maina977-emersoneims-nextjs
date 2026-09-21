import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PLUMBING_REPAIR_MANUALS,
  PLUMBING_MATERIALS,
  PLUMBING_MAINTENANCE_SCHEDULE,
  PLUMBING_COMPLIANCE_NOTE,
  PLUMBING_BIBLE_DATA,
} from '@/lib/maintenance-hub/plumbing-bible';

/**
 * /maintenance-hub/plumbing — the eleventh maintenance guide, which was linked
 * from the hub and never existed.
 *
 * It returned 404 from the day the card was written. Google crawled it on
 * 2026-07-31 and it surfaced in the Search Console coverage export on
 * 2026-09-21. Ten of the eleven hub children resolved; this was the gap.
 *
 * SERVER COMPONENT, DELIBERATELY. Every other hub child is 'use client' and
 * carries an interactive shell. The content here is reference material that a
 * person needs to read, and /generators/spare-parts has already shown on this
 * site what a client-rendered reference page costs: 109 words of server HTML
 * and no crawlable links. There is nothing here that needs client state, so
 * nothing here is deferred behind it.
 *
 * WHAT IS CLAIMED. Plumbing diagnosis and reference. Not that EmersonEIMS
 * installs domestic plumbing — that was not among the services the owner
 * listed on 2026-09-21. Boreholes, pumps and pressure systems were, and the
 * pump procedure routes there because that is real work we do.
 */

export const metadata: Metadata = {
  /*
   * 38 characters, becoming 58 once app/layout.tsx appends its
   * "%s | EmersonEIMS Kenya" template.
   *
   * The first version here was 62 characters and shipped at 82 — the same
   * mistake made on /voltka earlier the same day and fixed an hour before this
   * page was written. Anything outside /brands inherits the root template, and
   * a title written as though it were complete arrives with twenty characters
   * bolted on. Worth checking the rendered <title>, not the source string.
   */
  title: 'Plumbing Maintenance & Fault Diagnosis',
  description:
    'Diagnosis procedures for low water pressure, concealed leaks, water hammer, blocked drains, booster pumps, storage tanks and water heaters, with pipe materials and a maintenance schedule.',
  alternates: { canonical: 'https://www.emersoneims.com/maintenance-hub/plumbing' },
  keywords: [
    'plumbing maintenance Kenya',
    'low water pressure diagnosis',
    'concealed leak detection',
    'water hammer fix',
    'blocked drain clearing',
    'booster pump pressure vessel',
    'water heater no hot water',
  ],
};

export default function PlumbingBiblePage() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': 'https://www.emersoneims.com/maintenance-hub/plumbing#article',
        headline: 'Plumbing Maintenance Guide — Pressure, Leaks, Drainage and Pumps',
        description:
          'Diagnosis procedures for water supply pressure, concealed leaks, water hammer, drainage blockages, booster pump and pressure vessel faults, storage tanks and water heaters.',
        author: { '@id': 'https://www.emersoneims.com/#organization' },
        publisher: { '@id': 'https://www.emersoneims.com/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Maintenance Hub',
            item: 'https://www.emersoneims.com/maintenance-hub',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Plumbing',
            item: 'https://www.emersoneims.com/maintenance-hub/plumbing',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        id="plumbing-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
        <section className="border-b border-white/5 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <nav className="mb-6 text-sm text-gray-500">
              <Link href="/maintenance-hub" className="hover:text-cyan-400">
                Maintenance Hub
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-300">Plumbing</span>
            </nav>
            <h1 className="mb-5 text-4xl font-bold text-white md:text-5xl">
              Plumbing Maintenance Guide
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
              {PLUMBING_BIBLE_DATA.repairProcedures} diagnosis procedures covering water supply
              pressure, concealed leaks, water hammer, drainage, booster pumps, storage and hot
              water — written as a sequence to work through rather than a list of symptoms.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {PLUMBING_BIBLE_DATA.categories.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-xs text-cyan-300"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/5 py-8">
          <div className="container mx-auto px-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
                Before work on the incoming main
              </h2>
              <p className="leading-relaxed text-gray-300">{PLUMBING_COMPLIANCE_NOTE}</p>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold text-white">Diagnosis procedures</h2>
            <div className="space-y-10">
              {PLUMBING_REPAIR_MANUALS.map((m) => (
                <article
                  key={m.id}
                  id={m.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-7"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                      {m.category}
                    </span>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-gray-400">
                      {m.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{m.timeRequired}</span>
                  </div>

                  <h3 className="mb-5 text-2xl font-bold text-white">{m.title}</h3>

                  <div className="mb-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Tools
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        {m.tools.map((t) => (
                          <li key={t}>· {t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                        Safety
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        {m.safetyWarnings.map((w) => (
                          <li key={w}>· {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ol className="space-y-4">
                    {m.steps.map((s) => (
                      <li key={s.step} className="border-l-2 border-cyan-500/30 pl-5">
                        <p className="font-semibold text-white">
                          {s.step}. {s.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-300">{s.description}</p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-400">{s.details}</p>
                        {s.caution && (
                          <p className="mt-2 text-sm text-amber-400">Caution: {s.caution}</p>
                        )}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 border-t border-white/5 pt-5">
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                      Verify before closing up
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-400">
                      {m.verification.map((v) => (
                        <li key={v}>· {v}</li>
                      ))}
                    </ul>
                    {m.callAProfessional && (
                      <p className="mt-4 text-sm leading-relaxed text-cyan-300">
                        {m.callAProfessional}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-3 text-3xl font-bold text-white">Pipe materials</h2>
            <p className="mb-8 max-w-3xl text-gray-400">
              The jointing method belongs to the material. Most repeat leaks come from a fitting
              matched to the wrong pipe, or two metals joined directly that should not be.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {PLUMBING_MATERIALS.map((m) => (
                <div
                  key={m.material}
                  className="rounded-xl border border-white/10 bg-gray-900/50 p-6"
                >
                  <h3 className="font-bold text-white">{m.material}</h3>
                  <p className="mt-2 text-sm text-cyan-300">Jointing: {m.jointing}</p>
                  <p className="text-sm text-gray-500">Typical use: {m.typicalUse}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{m.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold text-white">Maintenance schedule</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {(
                [
                  ['Monthly', PLUMBING_MAINTENANCE_SCHEDULE.monthly],
                  ['Quarterly', PLUMBING_MAINTENANCE_SCHEDULE.quarterly],
                  ['Annually', PLUMBING_MAINTENANCE_SCHEDULE.annually],
                ] as const
              ).map(([label, items]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
                >
                  <h3 className="mb-4 text-lg font-semibold text-amber-400">{label}</h3>
                  <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
                    {items.map((i) => (
                      <li key={i}>· {i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Pumps, boreholes and pressure systems
              </h2>
              <p className="mb-8 leading-relaxed text-gray-400">
                Where a plumbing fault turns out to be the pump, the pressure vessel or the
                borehole feeding it, that is work EmersonEIMS does.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/maintenance-hub/borehole"
                  className="rounded-lg border border-cyan-400/30 px-6 py-3 text-cyan-400 transition-all hover:bg-cyan-400/10"
                >
                  Borehole &amp; water systems
                </Link>
                <Link
                  href="/services/borehole-pumps"
                  className="rounded-lg border border-cyan-400/30 px-6 py-3 text-cyan-400 transition-all hover:bg-cyan-400/10"
                >
                  Borehole pumps
                </Link>
                <Link
                  href="/repair-centre/pumps"
                  className="rounded-lg border border-white/15 px-6 py-3 text-gray-300 transition-all hover:bg-white/5"
                >
                  Pump repair centre
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-black transition-all hover:shadow-lg hover:shadow-amber-500/30"
                >
                  Talk to an engineer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
