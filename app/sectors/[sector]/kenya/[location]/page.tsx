import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  TARGET_SECTORS,
  getSectorBySlug,
  getAllSectorSlugs,
  generateSectorTitle,
  generateSectorDescription,
  generateSectorH1,
  generateSectorFAQs,
  generateSectorKeywords,
  getSectorsByCategory,
} from '@/lib/data/target-sectors';
import {
  KENYA_LOCATIONS,
  getCountyBySlug,
} from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';

type Props = {
  params: Promise<{ sector: string; location: string }>;
};

// Priority counties for static generation
const PRIORITY_COUNTIES = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu',
  'machakos', 'kajiado', 'nyeri', 'meru', 'uasin-gishu'
];

// Generate static params for sector + priority locations
export async function generateStaticParams() {
  const params: { sector: string; location: string }[] = [];

  for (const sectorSlug of getAllSectorSlugs()) {
    for (const countySlug of PRIORITY_COUNTIES) {
      params.push({
        sector: sectorSlug,
        location: countySlug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sector = getSectorBySlug(resolvedParams.sector);
  const county = getCountyBySlug(resolvedParams.location);

  if (!sector || !county) {
    return { title: 'Not Found' };
  }

  const title = generateSectorTitle(sector, county.name);
  const description = generateSectorDescription(sector, county.name);
  const keywords = generateSectorKeywords(sector, county.name);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
    },
    alternates: {
      canonical: `https://emersoneims.com/sectors/${sector.slug}/kenya/${county.slug}`,
    },
  };
}

// Enable ISR for non-priority pages
export const revalidate = 86400;
export const dynamicParams = true;

export default async function SectorLocationPage({ params }: Props) {
  const resolvedParams = await params;
  const sector = getSectorBySlug(resolvedParams.sector);
  const county = getCountyBySlug(resolvedParams.location);

  if (!sector || !county) {
    notFound();
  }

  const h1 = generateSectorH1(sector, county.name);
  const faqs = generateSectorFAQs(sector, county.name);

  // Get related services
  const generatorServices = SEO_SERVICES.filter(s => s.category === 'generators').slice(0, 6);

  // Get nearby counties
  const nearbyCounties = KENYA_LOCATIONS.filter(
    c => c.region === county.region && c.slug !== county.slug
  ).slice(0, 5);

  // Get related sectors
  const relatedSectors = getSectorsByCategory(sector.category).filter(s => s.slug !== sector.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <li>
            <Link href="/" className="hover:text-white">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/sectors" className="hover:text-white">Sectors</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/sectors/${sector.slug}`} className="hover:text-white">{sector.name}</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/kenya" className="hover:text-white">Kenya</Link>
          </li>
          <li>/</li>
          <li className="text-amber-400">{county.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex gap-2 mb-6">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm capitalize">
                {sector.category}
              </span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                {county.name} County
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {h1}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {sector.description}. Serving {sector.name.toLowerCase()} across {county.name} County.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Get Quote for {county.name}
              </Link>
              <a
                href="tel:+254768860665"
                className="px-8 py-3 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Power Needs & Solutions Grid */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Power Requirements</h2>
              <ul className="space-y-2">
                {sector.powerNeeds.map((need, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {need}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Our Solutions</h2>
              <ul className="space-y-2">
                {sector.solutions.map((solution, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Services */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Generator Services in {county.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generatorServices.map((service) => (
              <Link
                key={service.slug}
                href={`/kenya/${county.slug}/${service.slug}`}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center text-gray-300 hover:border-cyan-400/30 hover:text-cyan-400 transition-all text-sm"
              >
                {service.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            {sector.name} Power FAQs for {county.name}
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Counties */}
      {nearbyCounties.length > 0 && (
        <section className="py-12 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {sector.name} Solutions in Nearby Counties
            </h2>
            <div className="flex flex-wrap gap-3">
              {nearbyCounties.map((c) => (
                <Link
                  key={c.slug}
                  href={`/sectors/${sector.slug}/kenya/${c.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-amber-400/30 hover:text-amber-400 transition-all text-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Sectors */}
      {relatedSectors.length > 0 && (
        <section className="py-12 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Sectors in {county.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedSectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sectors/${s.slug}/kenya/${county.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-cyan-400/30 hover:text-cyan-400 transition-all text-sm"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Power Solutions for Your {sector.shortName} in {county.name}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contact us for professional generator installation, service, and maintenance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Request Quote
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
            >
              +254 768 860 665
            </a>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Generator Solutions for ${sector.name} in ${county.name}`,
            description: `${sector.description}. Serving ${county.name} County, Kenya.`,
            provider: {
              '@type': 'LocalBusiness',
              name: 'Emerson EIMS',
              telephone: '+254768860665',
              address: {
                '@type': 'PostalAddress',
                addressLocality: county.name,
                addressCountry: 'KE',
              },
            },
            areaServed: {
              '@type': 'City',
              name: county.name,
              containedInPlace: {
                '@type': 'Country',
                name: 'Kenya',
              },
            },
            serviceType: `Generator Solutions for ${sector.name}`,
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
