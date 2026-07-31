import Link from 'next/link';
import { getCountryBySlug } from '@/lib/data/east-africa-locations';

/**
 * City links for an East Africa country page.
 *
 * The three country pages under /east-africa each named their cities in prose
 * ("Serving: Kampala · Jinja · Entebbe …") while linking to none of them. The
 * city pages at /<country>/<city> were published, in the sitemap, and reachable
 * from nothing — a live crawl on 2026-07-31 found all 36 orphaned.
 *
 * Rendered from lib/data/east-africa-locations.ts, which is the same source
 * app/sitemap.ts uses to emit those URLs, so a city can never be listed here
 * without a page behind it or published without appearing here.
 *
 * Server component, no JavaScript — the links are in the initial HTML, which is
 * the entire point.
 */
export default function EastAfricaCityLinks({ country }: { country: string }) {
  const c = getCountryBySlug(country);
  if (!c || c.cities.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-slate-900/30 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
          Where we work in {c.name}
        </h2>
        <p className="text-gray-400 mb-8">
          {c.cities.length} locations — each with local service details, response times and contact
          routes.
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {c.cities.map(city => (
            <li key={city.slug}>
              <Link
                href={`/${c.slug}/${city.slug}`}
                className="block p-4 rounded-lg bg-slate-800/40 border border-blue-500/20 hover:border-blue-400/60 transition-colors"
              >
                <span className="font-semibold text-white">{city.name}</span>
                {city.isCapital && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-blue-300">
                    Capital
                  </span>
                )}
                {city.region && !city.isCapital && (
                  <span className="block text-xs text-gray-400 mt-0.5">{city.region}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
