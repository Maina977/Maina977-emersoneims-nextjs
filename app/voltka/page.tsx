import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getEngineIndex } from '@/lib/parts/engineIndex';

/**
 * VOLTKA — the only generator brand EmersonEIMS actually sells.
 *
 * WHY THIS PAGE EXISTS
 * Seventeen brand pages existed for makes we do not sell, and none for the one
 * we do. VOLTKA appears in 44 source files, has twenty product photographs in
 * public/images/voltka, and is called "OUR OWN BRAND, BEST VALUE" on
 * /generators — with no page of its own anywhere on the site. Someone
 * searching "VOLTKA generator Kenya" had nowhere to land. After the 2026-09-21
 * repositioning, every brand page now says "the generators we sell are our own
 * VOLTKA brand" while pointing at nothing.
 *
 * WHAT MAY BE STATED HERE, AND WHY THAT LIST IS SHORT
 * Three facts are owner-confirmed (2026-09-21): VOLTKA is our own brand, it is
 * Cummins-powered, and it starts at KES 500,000. The model names are read from
 * captions and image assets already published on this site. The parts figures
 * are counted at build time from the same catalogue that builds
 * /generators/spare-parts, so they cannot drift from it.
 *
 * NO kVA RATING APPEARS ON THIS PAGE, DELIBERATELY.
 * lib/products/generatorSizes.ts states the rule plainly: "VKS44 and VKS165
 * are VOLTKA model names, not kVA ratings, and treating them as ratings would
 * be a fabricated specification." The homepage was breaking that rule until
 * 2026-09-21, where it read "New VOLTKA VKS44 (44 kVA)". The gap beside each
 * model name below is deliberate. Fill it from the owner, not by inference.
 *
 * SUPPLIED BY THE OWNER 2026-09-21: VOLTKA covers 10 kVA to 2000 kVA and
 * carries a two-year warranty. The warranty figure is consistent with the rest
 * of the site, where "2-year warranty" already appears 55 times and the brand
 * comparison table on /generators lists two years across the board.
 *
 * STILL MISSING, AND STILL NOT TO BE GUESSED AT:
 *   - the kVA rating of each individual model. The range above is for the
 *     brand, not a key to the model numbers. VKS44 is not 44 kVA.
 */

export const metadata: Metadata = {
  title: 'VOLTKA Generators Kenya — 10 to 2000 kVA, Cummins-Powered | EmersonEIMS',
  description:
    'VOLTKA is the generator brand EmersonEIMS builds and sells: Cummins-powered diesel sets from 10 kVA to 2000 kVA, from KES 500,000, with a two-year warranty. Supplied, installed and commissioned across all 47 counties.',
  keywords: [
    'VOLTKA generators',
    'VOLTKA generator Kenya',
    'VOLTKA Cummins generator',
    'VOLTKA VKS44',
    'VOLTKA VKS165',
    'Cummins powered generator Kenya',
    'diesel generator price Kenya',
  ],
  alternates: { canonical: 'https://www.emersoneims.com/voltka' },
  openGraph: {
    title: 'VOLTKA Generators — Cummins-Powered, Built and Sold by EmersonEIMS',
    description:
      'Our own generator brand: Cummins-powered diesel sets from KES 500,000, delivered and commissioned across Kenya.',
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.emersoneims.com/voltka',
  },
};

/** Photographs already published on this site, with the captions they shipped with. */
const GALLERY = [
  {
    src: '/images/voltka/voltka-vks44-hero-profile.webp',
    alt: 'VOLTKA VKS44 Cummins-powered generator in its canopy',
    caption: 'VOLTKA VKS44 — Cummins powered, from our Nairobi fleet',
  },
  {
    src: '/images/voltka/voltka-vks165-stock-forklift.webp',
    alt: 'VOLTKA VKS165 generator in stock, moved by forklift',
    caption: 'Ready stock, Nairobi — VOLTKA VKS165',
  },
  {
    src: '/images/voltka/voltka-vks44-crane-side.webp',
    alt: 'VOLTKA generator being offloaded by a crane truck',
    caption: 'Delivered nationwide — crane dispatch and offloading',
  },
  {
    src: '/images/voltka/voltka-warehouse-fleet.webp',
    alt: 'VOLTKA generator fleet in the EmersonEIMS Nairobi warehouse',
    caption: 'Generator fleet — Nairobi warehouse',
  },
  {
    src: '/images/voltka/voltka-cummins-engine-open-canopy.webp',
    alt: 'Cummins engine visible inside an opened VOLTKA canopy',
    caption: 'The Cummins engine inside a VOLTKA canopy',
  },
  {
    src: '/images/voltka/voltka-vks44-night-delivery.webp',
    alt: 'VOLTKA generator being delivered at night',
    caption: 'Night delivery — sets move when the site needs them',
  },
];

/**
 * Model names taken from published captions and image assets. Names only —
 * see the note at the head of this file about why no rating sits beside them.
 */
const MODELS = ['VKS10', 'VKS20', 'VKS22', 'VKS40', 'VKS44', 'VKS165', 'VKS188'];

export default function VoltkaPage() {
  /*
   * VOLTKA sets run Cummins engines, so the Cummins catalogue is the parts
   * position behind the machine we sell rather than a general claim about
   * stock. Counted from the same index /generators/spare-parts is built from.
   */
  const cumminsEngines = getEngineIndex()
    .filter((e) => e.make === 'Cummins')
    .sort((a, b) => b.parts.length - a.parts.length);
  const cumminsParts = cumminsEngines.reduce((n, e) => n + e.parts.length, 0);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': 'https://www.emersoneims.com/voltka#product',
        name: 'VOLTKA Diesel Generators',
        brand: { '@type': 'Brand', name: 'VOLTKA' },
        manufacturer: { '@type': 'Organization', name: 'EmersonEIMS' },
        description:
          'VOLTKA is the generator brand EmersonEIMS builds and sells: Cummins-powered diesel generating sets from 10 kVA to 2000 kVA, supplied, installed and commissioned across Kenya with a two-year warranty.',
        /*
         * warranty is a real Offer property, but schema.org types it as a
         * WarrantyPromise rather than free text. Stating the term in the
         * description keeps the markup valid instead of stuffing a string into
         * a field that expects an object.
         */
        image:
          'https://www.emersoneims.com/images/voltka/voltka-vks44-hero-profile.webp',
        /*
         * lowPrice only. An AggregateOffer highPrice would need a top-of-range
         * figure nobody has confirmed, and inventing one to complete the shape
         * of the markup is the same error as inventing a kVA rating.
         */
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'KES',
          lowPrice: 500000,
          seller: { '@id': 'https://www.emersoneims.com/#organization' },
          areaServed: { '@type': 'Country', name: 'Kenya' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Generators',
            item: 'https://www.emersoneims.com/generators',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'VOLTKA',
            item: 'https://www.emersoneims.com/voltka',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        id="voltka-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
                Our own brand
              </span>
              <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  VOLTKA
                </span>{' '}
                Generators
              </h1>
              <p className="mx-auto mb-4 max-w-2xl text-xl leading-relaxed text-gray-300">
                Cummins-powered diesel generating sets from 10 kVA to 2000 kVA, starting at KES
                500,000, with a two-year warranty. VOLTKA is the brand EmersonEIMS sells. Every
                other make on this site we maintain, repair and stock parts for.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-bold text-black transition-all hover:shadow-lg hover:shadow-amber-500/30"
                >
                  Get a quotation
                </Link>
                <Link
                  href="/generators"
                  className="rounded-lg border border-cyan-400/30 px-8 py-3 text-cyan-400 transition-all hover:bg-cyan-400/10"
                >
                  Generator sizing guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-7">
                <h2 className="mb-3 text-lg font-semibold text-amber-400">Cummins inside</h2>
                <p className="leading-relaxed text-gray-400">
                  Every VOLTKA set is Cummins-powered. That is why the parts position below
                  matters: the engine in the machine we sell is the engine we hold the deepest
                  catalogue for.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-7">
                <h2 className="mb-3 text-lg font-semibold text-amber-400">
                  10 kVA to 2000 kVA, from KES 500,000
                </h2>
                <p className="leading-relaxed text-gray-400">
                  A shop standby set through to prime power for a factory or a mine. What your own
                  set costs depends on the size your load needs, the enclosure and the controller,
                  all of which go in a written quotation.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-7">
                <h2 className="mb-3 text-lg font-semibold text-amber-400">
                  Two-year warranty
                </h2>
                <p className="leading-relaxed text-gray-400">
                  Every VOLTKA set carries a two-year warranty. Supplied from our Nairobi
                  warehouse, transported, installed and commissioned with its changeover panel,
                  anywhere across the 47 counties.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-3 text-center text-3xl font-bold text-white">
              The VOLTKA range — 10 kVA to 2000 kVA
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
              Model names, smallest to largest. The range runs from 10 kVA up to 2000 kVA, but the
              model number is not the rating — ask us which set matches your load. Sizing is done
              against the kW your site actually draws, plus the surge your largest motor pulls when
              it starts.
            </p>
            <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {MODELS.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3 text-base font-semibold text-gray-200"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {cumminsEngines.length > 0 && (
          <section className="border-t border-white/5 py-16">
            <div className="container mx-auto px-4">
              <h2 className="mb-3 text-center text-3xl font-bold text-white">
                The parts position behind the machine
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
                {cumminsParts.toLocaleString('en-KE')} catalogued parts across{' '}
                {cumminsEngines.length} Cummins engine families, each listed with its manufacturer
                part number and the engines it fits. A generator is a fifteen-year purchase, and
                the question that usually decides it is whether parts will still be there in year
                eight.
              </p>
              <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cumminsEngines.slice(0, 6).map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={'/generators/spare-parts/engine/' + e.slug}
                      className="flex h-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 px-5 py-4 transition-colors hover:border-amber-400/40"
                    >
                      <span className="font-semibold text-white">{e.model}</span>
                      <span className="whitespace-nowrap text-sm text-gray-500">
                        {e.parts.length} parts
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center">
                <Link
                  href="/generators/spare-parts"
                  className="font-semibold text-amber-400 hover:underline"
                >
                  Browse the full parts catalogue
                </Link>
              </p>
            </div>
          </section>
        )}

        <section className="border-t border-white/5 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">VOLTKA in the field</h2>
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY.map((p) => (
                <figure
                  key={p.src}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-gray-950"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-5 py-4 text-sm text-gray-400">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                We sell one brand. We service every brand.
              </h2>
              <p className="mb-8 leading-relaxed text-gray-400">
                VOLTKA is what we build and sell. For Cummins, Perkins, Caterpillar, Volvo, Doosan,
                SDMO, Himoinsa and the rest, we do maintenance, repairs and spare parts, with a
                mobile workshop reaching all 47 counties.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/repair-centre"
                  className="rounded-lg border border-cyan-400/30 px-8 py-3 text-cyan-400 transition-all hover:bg-cyan-400/10"
                >
                  Repair centre
                </Link>
                <Link
                  href="/brands"
                  className="rounded-lg border border-white/15 px-8 py-3 text-gray-300 transition-all hover:bg-white/5"
                >
                  Brands we service
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
