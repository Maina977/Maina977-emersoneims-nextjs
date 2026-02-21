import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  EAST_AFRICA_COUNTRIES,
  getCountryBySlug,
  getCityBySlug,
  getAllCountrySlugs,
  getCitySlugsForCountry,
  generateCityTitle,
  generateCityDescription,
  generateCityH1,
  generateCityKeywords,
} from '@/lib/data/east-africa-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

type Props = {
  params: Promise<{ country: string; city: string }>;
};

// Generate static params for all country/city combinations
export async function generateStaticParams() {
  const params: { country: string; city: string }[] = [];

  for (const countrySlug of getAllCountrySlugs()) {
    for (const citySlug of getCitySlugsForCountry(countrySlug)) {
      params.push({
        country: countrySlug,
        city: citySlug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const country = getCountryBySlug(resolvedParams.country);
  const city = country ? getCityBySlug(resolvedParams.country, resolvedParams.city) : undefined;

  if (!country || !city) {
    // Fallback for unknown locations
    const countryName = resolvedParams.country.charAt(0).toUpperCase() + resolvedParams.country.slice(1);
    const cityName = resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1).replace(/-/g, ' ');

    return {
      title: `Energy Solutions in ${cityName}, ${countryName} | EmersonEIMS`,
      description: `Leading provider of generators, solar power, and energy infrastructure in ${cityName}, ${countryName}. Serving East Africa with premium power engineering.`,
    };
  }

  const title = generateCityTitle(country, city);
  const description = generateCityDescription(country, city);
  const keywords = generateCityKeywords(country, city);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en',
    },
    alternates: {
      canonical: `https://emersoneims.com/${country.slug}/${city.slug}`,
    },
  };
}

// Enable ISR
export const revalidate = 86400;
export const dynamicParams = true;

export default async function InternationalCityPage({ params }: Props) {
  const resolvedParams = await params;
  const country = getCountryBySlug(resolvedParams.country);
  const city = country ? getCityBySlug(resolvedParams.country, resolvedParams.city) : undefined;

  // Handle known countries with unknown cities - use fallback
  if (!country) {
    // Unknown country - use generic page
    const countryName = resolvedParams.country.charAt(0).toUpperCase() + resolvedParams.country.slice(1);
    const cityName = resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1).replace(/-/g, ' ');

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Energy Solutions in {cityName}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              EmersonEIMS provides generator and power solutions across East Africa, including {countryName}.
            </p>
          </div>
          <div className="text-center">
            <Link href="/contact" className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    notFound();
  }

  const h1 = generateCityH1(country, city);

  // Get generator services for links
  const generatorServices = SEO_SERVICES.filter(s => s.category === 'generators').slice(0, 6);

  // Get other cities in the same country
  const otherCities = country.cities.filter(c => c.slug !== city.slug).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <LocalBusinessSchema
        name={`EmersonEIMS ${city.name}`}
        description={`Leading provider of generators and power solutions in ${city.name}, ${country.name}.`}
        url={`https://emersoneims.com/${country.slug}/${city.slug}`}
        address={{
          addressLocality: city.name,
          addressCountry: country.name
        }}
      />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <li>
            <Link href="/" className="hover:text-white">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/${country.slug}`} className="hover:text-white">{country.name}</Link>
          </li>
          <li>/</li>
          <li className="text-amber-400">{city.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex gap-2 mb-6">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm">
                {country.name}
              </span>
              {city.isCapital && (
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                  Capital City
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {h1}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {country.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Get Quote in {city.name}
              </Link>
              <a
                href={`tel:${country.dialCode.replace('+', '')}000000000`}
                className="px-8 py-3 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
              >
                Call {country.dialCode}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Country Info */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-sm text-gray-400 mb-2">Capital</h3>
              <p className="text-xl font-bold text-white">{country.capital}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-sm text-gray-400 mb-2">Currency</h3>
              <p className="text-xl font-bold text-amber-400">{country.currency}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-sm text-gray-400 mb-2">Timezone</h3>
              <p className="text-xl font-bold text-cyan-400">{country.timezone}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-sm text-gray-400 mb-2">Language</h3>
              <p className="text-xl font-bold text-white">{country.language[0]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our Services in {city.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Industrial Power</h3>
              <p className="text-gray-400 mb-6">
                We supply and install heavy-duty generators for factories, hospitals, and data centers in {city.name}.
              </p>
              <ul className="space-y-2 text-gray-500 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Diesel Generators (10kVA - 2500kVA)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gas Generators
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Synchronization Panels
                </li>
              </ul>
              <Link href="/generators" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Explore Generators →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Renewable Energy</h3>
              <p className="text-gray-400 mb-6">
                Transition your business in {city.name} to sustainable power with our advanced solar and battery storage solutions.
              </p>
              <ul className="space-y-2 text-gray-500 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Commercial Solar PV
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hybrid Systems
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Energy Storage
                </li>
              </ul>
              <Link href="/solution/solar" className="text-amber-400 hover:text-amber-300 transition-colors">
                Explore Solar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Services */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Generator Services Available
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generatorServices.map((service) => (
              <div
                key={service.slug}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center text-gray-300 text-sm"
              >
                {service.shortName}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      {otherCities.length > 0 && (
        <section className="py-12 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Other Cities in {country.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${country.slug}/${c.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-amber-400/30 hover:text-amber-400 transition-all text-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Countries */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            We Also Serve
          </h2>
          <div className="flex flex-wrap gap-3">
            {EAST_AFRICA_COUNTRIES.filter(c => c.slug !== country.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/${c.cities[0].slug}`}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-cyan-400/30 hover:text-cyan-400 transition-all text-sm"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Power Solutions in {city.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contact our {country.name} team for generator sales, installation, service, and spare parts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Request Quote
            </Link>
            <Link
              href="/generators"
              className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
            >
              View Generators
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `EmersonEIMS ${city.name}`,
            description: `Generator supplier and power solutions provider in ${city.name}, ${country.name}.`,
            url: `https://emersoneims.com/${country.slug}/${city.slug}`,
            telephone: '+254768860665',
            address: {
              '@type': 'PostalAddress',
              addressLocality: city.name,
              addressCountry: country.code,
            },
            areaServed: {
              '@type': 'City',
              name: city.name,
              containedInPlace: {
                '@type': 'Country',
                name: country.name,
              },
            },
            priceRange: '$$$',
            openingHours: 'Mo-Fr 08:00-18:00',
          }),
        }}
      />
    </div>
  );
}
