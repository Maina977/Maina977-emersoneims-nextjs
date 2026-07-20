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
import {
  getLocationFacts,
  serviceModelSentence,
  OPERATING_BASE,
} from '@/lib/seo/locationFacts';
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
      // Credibility audit 2026-07-18: replaced the unsubstantiated "Kenya's #1"
      // superiority claim (it appeared on ~190 indexed location pages and in
      // Google results). Kept only verifiable facts: services, warranty, phone.
      description: `Generator, solar, UPS and electrical engineering services in ${locationName}. 3-year installation warranty. 24/7 emergency response. Call +254768860665`,
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

  // Real, per-location facts (distance from base, census population,
  // administrative hierarchy, sibling areas). Null only if the slug is
  // unknown, which notFound() above has already excluded.
  const facts = getLocationFacts(locationSlug)!;

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

      {/* REMOVED 2026-07-20 — the "Why Choose EmersonEIMS in {location}?" block.
          Four cards that were byte-identical on all ~190 location pages apart
          from the substituted town name, contributing directly to the measured
          82% body-text duplication that makes this set look like doorway pages.

          It also carried three claims already removed elsewhere in this audit:
            - "Industry-leading warranty"  — unsupported superlative
            - "Certified professionals"    — certification unverified
            - "Quick response times"       — no measured response time exists

          Nothing factual was lost: the 3-year warranty and 24/7 emergency
          cover are both stated in this page's hero, and the genuine
          differentiator (the nationwide mobile workshop) is covered in the
          prose below with per-location facts. */}

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
          {/* CREDIBILITY + DUPLICATE-CONTENT FIX (audit 2026-07-20).
              This block previously ran the SAME sentences on ~190 pages with
              only the town name swapped — measured at 84% identical body text
              across different towns, the signature of scaled content abuse.
              It also claimed "EmersonEIMS is {location}'s trusted partner"
              (unverifiable) and resident local technicians (untrue — we work
              from one Embakasi base).

              Every number below is real: census population, official
              coordinates and administrative hierarchy already held in
              kenyaLocations, or arithmetic on them. Nothing is invented, and
              where a fact is unknown the sentence is simply omitted. */}
          <h2>EmersonEIMS Services in {locationName}</h2>
          <p>{serviceModelSentence(facts)}</p>
          {(facts.countyName || facts.population) && (
            <p>
              {facts.countyName && !isCounty
                ? `${locationName} falls within ${facts.countyName} County${facts.countyCapital ? `, whose administrative centre is ${facts.countyCapital}` : ''}. `
                : ''}
              {isCounty && facts.constituencyCount
                ? `${locationName} County comprises ${facts.constituencyCount} constituencies. `
                : ''}
              {facts.population
                ? `It has a recorded population of about ${facts.population.toLocaleString('en-KE')}, which shapes the scale of standby power, solar and UPS systems most sites here require.`
                : ''}
            </p>
          )}
          <p>
            We specialise in diesel generator sales, installation and maintenance for
            businesses, hospitals, hotels, schools and residential properties in{' '}
            {locationName}
            {!isCounty && county ? ` and across ${county.name} County` : ''}.
          </p>

          {/* CONDENSED 2026-07-20. Two paragraphs ("Generator Services in X",
              "Solar Power Solutions in X") ran here verbatim on all ~190 pages
              with only the town name swapped, and they restated what
              /generators and /solar already say in full. Thin copies of a
              canonical page compete with it rather than support it, so this is
              now one paragraph that LINKS to those pages — the same topical
              relevance, less duplicate text, and internal link equity pointed
              at the pages that should actually rank. */}
          <h3>What we install and maintain in {locationName}</h3>
          <p>
            Sites in {locationName} are served with the same range we run nationwide:{' '}
            <Link href="/generators">diesel generators</Link> from 10 kVA to 2000 kVA
            (Cummins, Perkins, FG Wilson, Caterpillar), including used and refurbished
            sets, installation, scheduled maintenance and emergency repair;{' '}
            <Link href="/solar">solar power</Link> for homes, commercial rooftops,
            off-grid sites and solar-generator hybrids; plus{' '}
            <Link href="/services">UPS, electrical and controls work</Link>. Which
            option suits a given site depends on its load profile and how often
            grid power fails there — that is what the site survey establishes.
          </p>

          <h3>Serving All of {isCounty ? locationName : county?.name || locationName}</h3>
          {/* The original sentence claimed resident technicians in ~190 towns.
              The first correction then over-swung and implied we only work out
              of Embakasi, which understates the business. Owner correction
              2026-07-20: a MOBILE WORKSHOP TEAM covers the whole country, with
              Embakasi as HQ. That is what is stated below. Still no
              hours-to-site promise — no measured figure exists. */}
          <p>
            Whether you need emergency generator repair, scheduled maintenance or a
            new installation, our mobile workshop team covers {locationName}
            {!isCounty && county ? ` and the wider ${county.name} County` : ''} as part
            of our nationwide service, backed by our {OPERATING_BASE.label} headquarters.
            Call +254 768 860 665 to discuss the site and we will confirm scheduling and
            what the visit involves before anyone travels.
          </p>
          {facts.nearby.length > 0 && (
            <>
              <h3>Nearby areas we also cover</h3>
              <p>
                {facts.nearby.map((n, i) => (
                  <span key={n.slug}>
                    {i > 0 ? ', ' : ''}
                    <Link href={`/locations/${n.slug}`}>{n.name}</Link>
                  </span>
                ))}
                .
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
