import { Metadata } from 'next';
import Link from 'next/link';
import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';

export const metadata: Metadata = {
  title: 'Generator Services Across Kenya | All 47 Counties | Emerson EiMS',
  description: 'Professional generator installation, repair, maintenance, and rental services across all 47 counties in Kenya. Find generator companies, diesel generators, spare parts, and 24/7 emergency support in your area. Call +254768860665',
  keywords: [
    'generator services kenya',
    'generator companies kenya',
    'generator repair kenya',
    'generator maintenance kenya',
    'generator rental kenya',
    'diesel generators kenya',
    'generator installation kenya',
    'power solutions kenya',
    'backup power kenya',
    'generator spare parts kenya',
    ...KENYA_LOCATIONS.map(c => `generators ${c.name}`),
    ...KENYA_LOCATIONS.map(c => `generator repair ${c.name}`),
  ].join(', '),
  openGraph: {
    title: 'Generator Services Across All 47 Kenya Counties | Emerson EiMS',
    description: 'Find professional generator services in your county. Installation, repair, maintenance, rentals across Kenya.',
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.emersoneims.com/kenya',
    siteName: 'Emerson EiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/kenya',
  },
};

// Group counties by region
const REGIONS = {
  'Nairobi Metropolitan': ['nairobi', 'kiambu', 'machakos', 'kajiado'],
  'Coast': ['mombasa', 'kilifi', 'kwale', 'taita-taveta', 'tana-river', 'lamu'],
  'Central': ['muranga', 'nyeri', 'kirinyaga', 'nyandarua'],
  'Eastern': ['makueni', 'kitui', 'embu', 'tharaka-nithi', 'meru', 'isiolo'],
  'Nyanza': ['kisumu', 'siaya', 'homa-bay', 'kisii', 'nyamira', 'migori'],
  'Rift Valley': ['nakuru', 'narok', 'kericho', 'bomet', 'uasin-gishu', 'elgeyo-marakwet', 'nandi', 'baringo', 'laikipia', 'samburu', 'trans-nzoia', 'turkana', 'west-pokot'],
  'Western': ['kakamega', 'bungoma', 'busia', 'vihiga'],
  'North Eastern': ['garissa', 'wajir', 'mandera', 'marsabit'],
};

export default function KenyaPage() {
  const totalPopulation = KENYA_LOCATIONS.reduce((sum, c) => sum + c.population, 0);
  const totalConstituencies = KENYA_LOCATIONS.reduce((sum, c) => sum + c.constituencies.length, 0);

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Emerson EiMS Kenya',
            description: 'Generator services across all 47 counties in Kenya',
            url: 'https://www.emersoneims.com/kenya',
            areaServed: KENYA_LOCATIONS.map(county => ({
              '@type': 'AdministrativeArea',
              name: `${county.name} County`,
              containedInPlace: { '@type': 'Country', name: 'Kenya' }
            })),
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Generator Services',
              itemListElement: SEO_SERVICES.map((service, i) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: service.name },
                position: i + 1
              }))
            }
          })
        }}
      />

      <div className="eims-shell py-0">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Generator Services Across Kenya
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-4">
            Professional generator installation, repair, maintenance, and rental services
            in all <span className="text-amber-400 font-bold">47 counties</span> and{' '}
            <span className="text-cyan-400 font-bold">{totalConstituencies}+ constituencies</span>.
          </p>
          <p className="text-gray-500 mb-8">
            Serving {(totalPopulation / 1000000).toFixed(1)}+ million Kenyans with reliable power solutions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-amber-500 text-black px-8 py-4 rounded-full font-bold hover:bg-amber-400 transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+254768860665"
              className="inline-block bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              Call +254 768 860 665
            </a>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our Services Available Nationwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SEO_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`/kenya/nairobi/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-center group"
              >
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors text-sm md:text-base">
                  {service.shortName}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Counties by Region */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Find Generator Services in Your County
          </h2>

          {Object.entries(REGIONS).map(([region, countySlugs]) => {
            const regionCounties = KENYA_LOCATIONS.filter(c => countySlugs.includes(c.slug));
            return (
              <div key={region} className="mb-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4 border-b border-white/10 pb-2">
                  {region} Region
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {regionCounties.map((county) => (
                    <Link
                      key={county.slug}
                      href={`/kenya/${county.slug}`}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group"
                    >
                      <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {county.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {county.constituencies.length} areas
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Searches */}
        <div className="mb-16 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Popular Generator Services by Location
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { county: 'nairobi', service: 'generator-companies', label: 'Generator Companies in Nairobi' },
              { county: 'mombasa', service: 'generator-repairs', label: 'Generator Repairs in Mombasa' },
              { county: 'kisumu', service: 'generator-maintenance', label: 'Generator Maintenance in Kisumu' },
              { county: 'nakuru', service: 'generator-lease', label: 'Generator Rental in Nakuru' },
              { county: 'kiambu', service: 'generators', label: 'Generators in Kiambu' },
              { county: 'machakos', service: 'diesel-generators', label: 'Diesel Generators in Machakos' },
              { county: 'kajiado', service: 'generator-spare-parts', label: 'Generator Parts in Kajiado' },
              { county: 'kilifi', service: 'generator-not-starting', label: 'Generator Troubleshooting in Kilifi' },
              { county: 'uasin-gishu', service: 'solar-installation', label: 'Solar Installation in Eldoret' },
            ].map((item) => (
              <Link
                key={`${item.county}-${item.service}`}
                href={`/kenya/${item.county}/${item.service}`}
                className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-amber-400/50 hover:bg-white/5 transition-all"
              >
                <span className="text-white hover:text-amber-400">{item.label}</span>
                <span className="text-amber-400 ml-2">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">47</div>
              <div className="text-gray-400">Counties Covered</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-cyan-400 mb-2">{totalConstituencies}+</div>
              <div className="text-gray-400">Constituencies</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-gray-400">Service Types</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Emergency Support</div>
            </div>
          </div>
        </div>

        {/* All Counties List for SEO */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            All 47 Kenya Counties We Serve
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 text-sm">
            {KENYA_LOCATIONS.map((county) => (
              <Link
                key={county.slug}
                href={`/kenya/${county.slug}`}
                className="p-2 text-center text-gray-400 hover:text-amber-400 transition-colors"
              >
                {county.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need Generator Services in Kenya?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re in Nairobi, Mombasa, Kisumu, or any of the 47 counties,
            we provide professional generator solutions with 24/7 support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Request a Quote
            </Link>
            <a
              href="https://wa.me/254768860665"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-500 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
