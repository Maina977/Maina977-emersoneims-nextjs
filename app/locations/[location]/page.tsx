/**
 * Dynamic Location Page - County/Town/Constituency Landing
 *
 * Generates SEO-optimized pages for every location in Kenya.
 * Shows all services available in that location.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllLocations,
  getLocationBySlug,
  getCountyBySlug,
  SERVICES,
  COUNTIES
} from '@/lib/seo/kenyaLocations';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ location: string }>;
}

// Generate static paths for all locations
export async function generateStaticParams() {
  const locations = getAllLocations();
  return locations.map(loc => ({ location: loc.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  const county = COUNTIES.find(c =>
    c.slug === locationSlug ||
    c.constituencies.includes(locationSlug) ||
    c.majorTowns.includes(locationSlug)
  );

  if (!location) return { title: 'Location Not Found' };

  const locationName = location.name;
  const isCounty = location.type === 'county';
  const countyName = county?.name || '';

  return {
    title: `Generator & Solar Services in ${locationName}${!isCounty && countyName ? `, ${countyName}` : ''} | EmersonEIMS`,
    description: `Professional generator installation, solar power, UPS systems, and electrical services in ${locationName}, Kenya. 3-Year Warranty. 24/7 Emergency Service. Serving ${locationName} and surrounding areas. Call +254768860665.`,
    keywords: [
      `generator company ${locationName}`,
      `solar installation ${locationName}`,
      `generator repair ${locationName}`,
      `UPS systems ${locationName}`,
      `electrical services ${locationName}`,
      `power solutions ${locationName} Kenya`
    ],
    openGraph: {
      title: `EmersonEIMS - Power Solutions in ${locationName}`,
      description: `Kenya's #1 generator and solar company serving ${locationName}. 3-Year Warranty. 9 Services. Call +254768860665`,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.emersoneims.com/locations/${locationSlug}`,
    }
  };
}

export default async function LocationPage({ params }: Props) {
  const { location: locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  const county = getCountyBySlug(locationSlug) || COUNTIES.find(c =>
    c.constituencies.includes(locationSlug) ||
    c.majorTowns.includes(locationSlug)
  );

  if (!location) {
    notFound();
  }

  const isCounty = location.type === 'county';
  const locationName = location.name;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
              <li>/</li>
              <li><Link href="/locations" className="hover:text-cyan-400">Locations</Link></li>
              {!isCounty && county && (
                <>
                  <li>/</li>
                  <li><Link href={`/locations/${county.slug}`} className="hover:text-cyan-400">{county.name}</Link></li>
                </>
              )}
              <li>/</li>
              <li className="text-white">{locationName}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Generator & Solar Services in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {locationName}
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mb-8">
            EmersonEIMS provides professional power solutions in {locationName}{!isCounty && county ? `, ${county.name} County` : ''}.
            From generator installation and maintenance to solar power systems, we deliver reliable energy solutions with a 3-Year Warranty.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Call Now: +254 768 860 665
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

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our Services in {locationName}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <Link
                key={service.slug}
                href={`/locations/${locationSlug}/${service.slug}`}
                className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {service.shortName}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {service.description}
                </p>
                <span className="text-cyan-400 text-sm font-medium group-hover:underline">
                  Learn more about {service.shortName} in {locationName} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-locations (for counties) */}
      {isCounty && county && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              Areas We Serve in {locationName} County
            </h2>

            {/* Constituencies */}
            {county.constituencies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Constituencies</h3>
                <div className="flex flex-wrap gap-3">
                  {county.constituencies.map(constSlug => (
                    <Link
                      key={constSlug}
                      href={`/locations/${constSlug}`}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-cyan-500 hover:text-white transition-all"
                    >
                      {constSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Major Towns */}
            {county.majorTowns.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Major Towns & Areas</h3>
                <div className="flex flex-wrap gap-3">
                  {county.majorTowns.map(townSlug => (
                    <Link
                      key={townSlug}
                      href={`/locations/${townSlug}`}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-cyan-500 hover:text-white transition-all"
                    >
                      {townSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Why Choose EmersonEIMS in {locationName}?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">3-Year Warranty</h3>
              <p className="text-slate-400 text-sm">Industry-leading warranty on all our installations and services.</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Emergency</h3>
              <p className="text-slate-400 text-sm">Round-the-clock emergency support for {locationName} and surrounding areas.</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Technicians</h3>
              <p className="text-slate-400 text-sm">Certified professionals with years of experience in power solutions.</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Response</h3>
              <p className="text-slate-400 text-sm">Quick response times for all service calls in {locationName}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Reliable Power in {locationName}?
          </h2>
          <p className="text-slate-300 mb-8">
            Get a free consultation and quote for your generator, solar, or electrical needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
            >
              Request Free Quote
            </a>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
            >
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>About EmersonEIMS Services in {locationName}</h2>
          <p>
            EmersonEIMS is {locationName}'s trusted partner for all power generation and energy solutions.
            We specialize in diesel generator sales, installation, and maintenance, serving businesses,
            hospitals, hotels, schools, and residential properties throughout {locationName}
            {!isCounty && county ? ` and ${county.name} County` : ''}.
          </p>

          <h3>Generator Services in {locationName}</h3>
          <p>
            Our generator services in {locationName} include new generator sales (Cummins, Perkins, FG Wilson, Caterpillar),
            used/refurbished generators, professional installation, scheduled maintenance, emergency repairs,
            and 24/7 breakdown support. We provide generators ranging from 10kVA for small businesses to
            2000kVA for industrial applications.
          </p>

          <h3>Solar Power Solutions in {locationName}</h3>
          <p>
            Go green with our solar power systems in {locationName}. We design and install residential
            solar systems, commercial solar installations, off-grid solutions, and hybrid solar-generator
            systems. Reduce your electricity bills and enjoy reliable power with our solar solutions.
          </p>

          <h3>Serving All of {isCounty ? locationName : county?.name || locationName}</h3>
          <p>
            Our technicians are based strategically to ensure fast response times throughout {locationName}.
            Whether you need emergency generator repair, scheduled maintenance, or a new installation,
            we're ready to serve you. Contact us today at +254768860665 for professional power solutions
            in {locationName}.
          </p>
        </div>
      </section>
    </div>
  );
}
