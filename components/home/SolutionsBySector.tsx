import Link from 'next/link';

// "Solutions by Sector" — homepage band placed directly below the hero.
//
// PIVOT (2026): the live sector hub is /industries (powered by
// lib/seo/industryData.ts). This band is now the canonical homepage
// entry into that hub — it routes to /industries/<slug>, NOT to a
// duplicate /solutions/<sector> system. Static (no JS), no images,
// no animations → near-zero performance impact.
const SECTORS: { slug: string; label: string; pain: string; icon: string }[] = [
  {
    slug: 'hospitals-healthcare',
    label: 'Hospitals & Clinics',
    icon: '🏥',
    pain: 'Theatre, ICU and lab loads cannot wait for a generator that takes 30 seconds to start.',
  },
  {
    slug: 'hotels-hospitality',
    label: 'Hotels & Hospitality',
    icon: '🏨',
    pain: 'One outage during peak hours = 1-star reviews, spoiled stock and refunded conferences.',
  },
  {
    slug: 'schools-universities',
    label: 'Schools & Universities',
    icon: '🎓',
    pain: 'Exams, labs, kitchens and dorms — a dark campus is a parent complaint waiting to happen.',
  },
  {
    slug: 'manufacturing',
    label: 'Industries & Factories',
    icon: '🏭',
    pain: 'A 5-minute outage on a production line costs more than the generator service contract.',
  },
  {
    slug: 'flower-farms',
    label: 'Farms & Agro-processing',
    icon: '🌾',
    pain: 'Cold rooms, irrigation pumps and pack-house lines that simply must run, every shift.',
  },
  {
    slug: 'real-estate',
    label: 'Real Estate & Apartments',
    icon: '🏢',
    pain: 'Lifts, water pumps, common-area lighting — tenants notice within minutes.',
  },
];

export default function SolutionsBySector() {
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
            Solutions by <span className="text-amber-500">Industry</span>
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
          {SECTORS.map((s) => (
            <li
              key={s.slug}
              className="snap-start rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-500/30 transition-colors"
            >
              <div className="text-2xl mb-2" aria-hidden="true">{s.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {s.label}
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-5 line-clamp-3">
                {s.pain}
              </p>
              <Link
                href={`/industries/${s.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                See sector solutions <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-center mt-10">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/85 hover:text-white hover:border-amber-400/50 transition-colors text-sm font-semibold uppercase tracking-wide"
          >
            View All Industries <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
