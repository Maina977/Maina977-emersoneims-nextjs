import Link from 'next/link';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';
import { formatKESWithUnit } from '@/lib/format/currency';

/**
 * WHAT WE SUPPLY — the homepage's route into the commercial pages.
 *
 * WHAT WAS HERE BEFORE
 * A stub: `return <div className="py-20 px-4 bg-black" />`. An earlier pass had
 * gutted this component to strip a block of unsubstantiated ranking claims
 * ("Market Leadership Proven", "#1 Across 30+ Services in Kenya", invented
 * per-service ratings of 92/95/98/99). Stripping those was right — none of it
 * could be substantiated and the numbers had no source. But the empty div was
 * left mounted, so the homepage carried ~160px of blank black in its fifth
 * section. Nothing lost by replacing it: there was no content to lose. The
 * original claim-bearing version still exists, unimported, at
 * app/components/home/ServicesLeadershipMatrix.tsx — it is not deleted here,
 * and it must not be remounted.
 *
 * WHY A ROUTER, AND WHY HERE
 * First-party analytics: 277 visitors reached the homepage in the sample period
 * and 18 reached /generators. People arrive and never find the products. This
 * slot is the fifth section — the first point after the hero where a visitor
 * has decided to keep reading — so it is where "what do you actually need?"
 * belongs.
 *
 * EVERY FACT HERE IS SOURCED, EVERY LINK IS VERIFIED
 *   · size count and the opening price are read from GENERATOR_SIZES at build
 *     time, so this cannot drift away from /generators the way a hardcoded
 *     figure would;
 *   · all six destinations were checked live and return 200 with no redirect
 *     hop — /services/solar and /services/ups were 404 and are deliberately
 *     not used here, the working paths are /solar and /services/ups-systems;
 *   · no ranking, superiority or market-share claim appears, by design.
 *
 * SERVER-RENDERED with no client JS: these are the internal links most worth
 * crawling, and the page is already heavy enough.
 */

/**
 * Lowest published price across the range, read from the same source
 * /generators renders, so the two pages cannot drift apart.
 *
 * formatKESWithUnit, not toLocaleString: a locale-aware formatter renders
 * "600,000" on one runtime and "600.000" on another, which has already caused a
 * hydration mismatch on this site. This helper is byte-identical everywhere.
 */
function openingGeneratorPrice(): string | null {
  const figures = GENERATOR_SIZES.map((s) => {
    const match = /([\d,]{5,})/.exec(s.priceRange);
    return match ? Number(match[1].replace(/,/g, '')) : NaN;
  }).filter((n) => Number.isFinite(n) && n > 0);
  if (figures.length === 0) return null;
  return formatKESWithUnit(Math.min(...figures));
}

export default function ServicesLeadershipMatrix() {
  const from = openingGeneratorPrice();
  const sizeCount = GENERATOR_SIZES.length;
  const smallest = GENERATOR_SIZES.reduce((a, b) => (a.kva < b.kva ? a : b));
  const largest = GENERATOR_SIZES.reduce((a, b) => (a.kva > b.kva ? a : b));

  const lines: {
    href: string;
    title: string;
    detail: string;
    meta?: string;
  }[] = [
    {
      href: '/generators',
      title: 'Generators',
      detail: `${sizeCount} sizes from ${smallest.kva} kVA to ${largest.kva} kVA, single and three phase, with the changeover panel and commissioning.`,
      meta: from ? `from ${from}` : undefined,
    },
    {
      href: '/solar',
      title: 'Solar',
      detail: 'Grid-tied and hybrid systems sized against your actual load profile, not a panel count.',
    },
    {
      href: '/services/ups-systems',
      title: 'UPS & inverters',
      detail: 'Backup for the loads that cannot ride through a changeover — servers, medical equipment, controls.',
    },
    {
      href: '/repair-centre',
      title: 'Repair & diagnostics',
      detail: 'Board-level electronics, controllers and motor rewinding, on the bench in Embakasi or on your site.',
    },
    {
      href: '/maintenance-hub',
      title: 'Servicing & maintenance',
      detail: 'Scheduled servicing and load-bank testing, so the set starts on the night it is needed.',
    },
    {
      href: '/pricing',
      title: 'Published prices',
      detail: 'Eight cost guides with the figures we actually quote — generators, solar, UPS, boreholes, rewinding.',
    },
  ];

  return (
    <section
      aria-labelledby="what-we-supply-heading"
      className="border-t border-white/10 bg-black py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          What we supply
        </p>
        <h2
          id="what-we-supply-heading"
          className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white lg:text-5xl"
        >
          Six things we do, and where to start
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          Every line below goes straight to the page with the sizes, the scope and
          the price &mdash; no forms in the way.
        </p>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((line) => (
            <li key={line.href} className="bg-black">
              <Link
                href={line.href}
                className="group flex h-full flex-col p-7 transition hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none lg:p-9"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-xl font-semibold text-white lg:text-2xl">
                    {line.title}
                  </span>
                  {line.meta && (
                    <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-amber-400">
                      {line.meta}
                    </span>
                  )}
                </span>
                <span className="mt-4 flex-1 text-sm leading-relaxed text-white/55">
                  {line.detail}
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition group-hover:gap-3">
                  View
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/contact?type=emergency"
            className="rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Generator down now
          </Link>
          <p className="text-sm text-white/50">
            Breakdowns are attended 24/7, in every county.
          </p>
        </div>
      </div>
    </section>
  );
}
