/**
 * MobileWorkshopBand — the nationwide mobile workshop, stated once, reusably.
 *
 * WHY IT EXISTS
 * EmersonEIMS runs a mobile workshop team covering all 47 counties (owner
 * confirmed 2026-07-20). It answers the objection every up-country buyer has —
 * "who fixes this when it fails in Kitale?" — and most competitors cannot
 * match it. Before this component the phrase "mobile workshop" appeared
 * exactly ONCE across the entire website, buried in a list item on
 * /generators/maintenance.
 *
 * WHAT IT MUST NOT SAY
 * The owner confirmed the capability, not its details. So there is deliberately
 * NO count of mobile units, NO hours-to-site or response-time promise, and NO
 * claim of resident staff in any named town. None of those are measured or
 * stated, and the audit brief forbids publishing unverified specifics. If the
 * owner later supplies real figures, add them HERE so every page updates at
 * once rather than drifting apart.
 *
 * Server component: pure markup, no client JS, no image weight.
 */
import Link from 'next/link';

const POINTS = [
  {
    title: 'We come to your site',
    body: 'A fully-equipped unit carries the tooling, spares and test equipment the job needs, so diagnosis and repair happen where your plant is.',
  },
  {
    title: 'All 47 counties',
    body: 'Nationwide coverage from our Embakasi, Nairobi headquarters — distance from the capital does not put a site out of reach.',
  },
  {
    title: 'Less downtime, less hauling',
    body: 'Working on site avoids stripping plant out and freighting it to Nairobi and back, which is usually the slowest part of any repair.',
  },
];

export default function MobileWorkshopBand({
  className = '',
  heading = 'Our mobile workshop comes to you — anywhere in Kenya',
}: {
  className?: string;
  heading?: string;
}) {
  return (
    <section
      aria-labelledby="mobile-workshop-heading"
      className={`relative overflow-hidden border-y border-amber-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-14 md:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
          Nationwide Service
        </span>
        <h2
          id="mobile-workshop-heading"
          className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl"
        >
          {heading}
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-6 transition-colors hover:border-amber-500/40"
            >
              <h3 className="text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="tel:+254768860665"
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Call +254 768 860 665
          </a>
          <Link
            href="/locations"
            className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-amber-500 hover:text-amber-400"
          >
            See the areas we cover
          </Link>
        </div>
      </div>
    </section>
  );
}
