/**
 * Locations Index Page - All Service Areas
 *
 * Shows all counties we serve with links to location-specific pages.
 * Excellent for SEO and user navigation.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { COUNTIES, SERVICES, TOTAL_LOCATIONS, TOTAL_SERVICE_PAGES } from '@/lib/seo/kenyaLocations';

export const metadata: Metadata = {
  title: 'Service Locations | Generator & Solar Services Across Kenya | EmersonEIMS',
  description: 'EmersonEIMS provides generator, solar, UPS, and electrical services across all 47 counties in Kenya. Find our services in Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and more. 24/7 support. 3-Year Warranty.',
  keywords: [
    'generator company Kenya',
    'solar installation Kenya',
    'power solutions all counties Kenya',
    'generator service locations',
    'EmersonEIMS service areas'
  ],
  openGraph: {
    title: 'EmersonEIMS Service Locations - All 47 Counties',
    description: 'Professional power solutions across Kenya. Generators, Solar, UPS & Electrical services.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/locations',
  }
};

export default function LocationsPage() {
  // Group counties by region
  const regions = {
    'Nairobi Metropolitan': ['nairobi', 'kiambu', 'machakos', 'kajiado'],
    'Coast': ['mombasa', 'kilifi', 'kwale', 'taita-taveta', 'lamu', 'tana-river'],
    'Central': ['nyeri', 'muranga', 'kirinyaga', 'nyandarua'],
    'Rift Valley': ['nakuru', 'uasin-gishu', 'kericho', 'bomet', 'narok', 'baringo', 'laikipia', 'trans-nzoia', 'nandi', 'elgeyo-marakwet', 'west-pokot', 'turkana', 'samburu'],
    'Western': ['kakamega', 'bungoma', 'busia', 'vihiga'],
    'Nyanza': ['kisumu', 'kisii', 'nyamira', 'homa-bay', 'migori', 'siaya'],
    'Eastern': ['meru', 'tharaka-nithi', 'embu', 'kitui', 'makueni', 'isiolo', 'marsabit'],
    'North Eastern': ['garissa', 'wajir', 'mandera']
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Serving All{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              47 Counties
            </span>
            {' '}in Kenya
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            EmersonEIMS provides professional generator, solar, UPS, and electrical services
            across Kenya. With technicians strategically located nationwide, we deliver fast,
            reliable service wherever you are.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400">47</div>
              <div className="text-slate-400 text-sm">Counties Served</div>
            </div>
            <div className="px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400">290+</div>
              <div className="text-slate-400 text-sm">Constituencies</div>
            </div>
            <div className="px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400">{SERVICES.length}</div>
              <div className="text-slate-400 text-sm">Services</div>
            </div>
            <div className="px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-slate-400 text-sm">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-12 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICES.map(service => (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className="px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-900/50 hover:border-cyan-500 transition-all"
              >
                {service.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Counties by Region */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Find Our Services in Your Area
          </h2>

          <div className="space-y-12">
            {Object.entries(regions).map(([regionName, countySlugs]) => (
              <div key={regionName}>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 pb-2 border-b border-slate-700">
                  {regionName}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {countySlugs.map(slug => {
                    const county = COUNTIES.find(c => c.slug === slug);
                    if (!county) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/locations/${slug}`}
                        className="group p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                      >
                        <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {county.name}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1">
                          Capital: {county.capital}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {county.constituencies.length} constituencies • {county.majorTowns.length} major towns
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Can't Find Your Location?
          </h2>
          <p className="text-slate-300 mb-6">
            We serve all areas across Kenya. Contact us directly and we'll help you find
            the nearest service point or dispatch a technician to your location.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* All Counties List */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">All Counties We Serve</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/locations/${county.slug}`}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500 hover:text-white transition-all"
              >
                {county.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Footer Content */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>Generator and Solar Services Across Kenya</h2>
          <p>
            EmersonEIMS is Kenya's leading provider of power solutions, serving businesses and
            homes across all 47 counties. Whether you're in Nairobi, Mombasa, Kisumu, Nakuru,
            Eldoret, or any other part of Kenya, we're ready to serve you with professional
            generator installation, solar power systems, UPS solutions, and electrical services.
          </p>
          <p>
            Our strategically located teams ensure fast response times for emergency repairs
            and scheduled maintenance. We understand that power reliability is critical for
            your business, which is why we offer 24/7 emergency support and back all our work
            with a comprehensive 3-Year Warranty.
          </p>
          <p>
            Contact us today to discuss your power needs. Our experts will assess your requirements
            and recommend the best solution for your location and budget.
          </p>
        </div>
      </section>
    </div>
  );
}
