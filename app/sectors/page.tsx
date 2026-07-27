import type { Metadata } from 'next';
import Link from 'next/link';
import { TARGET_SECTORS, getSectorCategories } from '@/lib/data/target-sectors';

/**
 * /sectors index.
 *
 * This page did not exist: app/sectors/ contained only [sector], so /sectors
 * returned a hard 404 while the breadcrumb on every sector page linked to it
 * (app/sectors/[sector]/kenya/[location]/page.tsx). Found during the 2026-07-27
 * route audit. Server-rendered so the whole list is in the initial HTML and the
 * 27 sector pages gain a real internal-linking hub.
 */

const BASE = 'https://www.emersoneims.com';

const CATEGORY_LABELS: Record<string, string> = {
  educational: 'Education',
  healthcare: 'Healthcare',
  financial: 'Financial',
  commercial: 'Commercial',
  institutional: 'Institutional',
  industrial: 'Industrial',
  residential: 'Residential',
  religious: 'Religious',
  tourism: 'Tourism & Hospitality',
};

export const metadata: Metadata = {
  title: 'Sectors We Power | Generator & Backup Power Solutions by Industry | EmersonEIMS',
  description:
    'Backup power, solar and electrical engineering for hospitals, schools, banks, hotels, factories, farms and more across Kenya. Sector-specific load profiles, constraints and solutions.',
  alternates: { canonical: `${BASE}/sectors` },
  openGraph: {
    title: 'Sectors We Power | EmersonEIMS',
    description:
      'Backup power and electrical engineering by sector — hospitals, schools, banks, hotels, factories, farms and more across Kenya.',
    url: `${BASE}/sectors`,
    type: 'website',
  },
};

export default function SectorsIndexPage() {
  const categories = getSectorCategories();

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE}/sectors#collection`,
        name: 'Sectors We Power',
        description:
          'Generator, solar and electrical engineering solutions organised by the sector being served, across Kenya.',
        url: `${BASE}/sectors`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Sectors', item: `${BASE}/sectors` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        id="sectors-index-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <main className="min-h-screen bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300" aria-current="page">Sectors</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Sectors We Power
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed max-w-3xl">
            What a site actually needs from a power system depends far more on what happens inside it than on its
            floor area. A theatre that cannot lose power mid-procedure, a cold store where a long outage is a
            written-off stock take, and a school hall that simply needs lights and sockets are three different
            engineering problems. These pages set out the load profile, the real constraints and the solutions that
            suit each sector.
          </p>

          {categories.map(category => {
            const sectors = TARGET_SECTORS.filter(s => s.category === category);
            if (sectors.length === 0) return null;

            return (
              <section key={category} className="mt-12">
                <h2 className="text-xl font-bold text-white mb-4">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {sectors.map(sector => (
                    <li key={sector.slug}>
                      <Link
                        href={`/sectors/${sector.slug}`}
                        className="block h-full rounded-xl border border-slate-700 bg-slate-900/50 p-5 hover:border-cyan-500/60 transition-colors"
                      >
                        <h3 className="text-lg font-bold text-white mb-1">{sector.name}</h3>
                        <p className="text-sm text-slate-400">{sector.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <section className="mt-14 rounded-xl border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-xl font-bold text-white mb-3">Not sure which applies to your site?</h2>
            <p className="text-slate-300 leading-relaxed">
              Most sites are a mix — a hospital has offices, a factory has a canteen, a hotel has a laundry. Sizing
              follows the load that must survive an outage, not the total connected load, so the right starting point
              is usually a site survey rather than a category.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
            >
              Talk to an engineer
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
