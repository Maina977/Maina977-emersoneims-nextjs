import Link from 'next/link';
import { SECTOR_LIST } from '@/lib/sectors/config';

// "Solutions by Sector" — homepage band placed directly below the hero.
// Static (no JS), no images, no animations → near-zero performance impact.
// Feature-flagged via NEXT_PUBLIC_ENABLE_SECTOR_SOLUTIONS.
export default function SolutionsBySector() {
  if (process.env.NEXT_PUBLIC_ENABLE_SECTOR_SOLUTIONS !== 'true') return null;

  return (
    <section
      id="solutions-by-sector"
      aria-labelledby="solutions-by-sector-heading"
      className="py-16 sm:py-20 lg:py-24 bg-black content-auto"
    >
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <p className="apple-caption text-amber-500 mb-3 sm:mb-4">Built for your sector</p>
          <h2
            id="solutions-by-sector-heading"
            className="apple-headline text-white"
          >
            Solutions by <span className="text-amber-500">Sector</span>
          </h2>
          <p className="apple-body text-gray-300 max-w-2xl mx-auto mt-4">
            Hospital theatres, school exams, hotel guests, factory lines, farm pumps,
            apartment lifts — every sector fails for a different reason. We build for
            yours.
          </p>
        </div>

        {/* Desktop: 3 cols · Tablet: 2 cols · Mobile: horizontal scroll */}
        <ul
          className="
            grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto snap-x snap-mandatory pb-4
            sm:grid-flow-row sm:auto-cols-auto sm:overflow-visible sm:pb-0 sm:grid-cols-2 sm:gap-5
            lg:grid-cols-3 lg:gap-6
          "
        >
          {SECTOR_LIST.map((s) => (
            <li
              key={s.slug}
              className="snap-start rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-500/30 transition-colors"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white capitalize mb-2">
                {s.slug.replace('-', ' ')}
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-5 line-clamp-3">
                {s.painStatement}
              </p>
              <Link
                href={`/solutions/${s.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                See Solutions <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-center mt-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/85 hover:text-white hover:border-amber-400/50 transition-colors text-sm font-semibold uppercase tracking-wide"
          >
            View All Sectors <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
