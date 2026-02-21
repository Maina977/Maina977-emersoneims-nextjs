import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  TARGET_SECTORS,
  getSectorBySlug,
  getAllSectorSlugs,
  generateSectorFAQs,
  getSectorsByCategory,
} from '@/lib/data/target-sectors';
import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';

type Props = {
  params: Promise<{ sector: string }>;
};

// Generate static params for all sectors
export async function generateStaticParams() {
  return getAllSectorSlugs().map((slug) => ({
    sector: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sector = getSectorBySlug(resolvedParams.sector);

  if (!sector) {
    return { title: 'Sector Not Found' };
  }

  return {
    title: `Generators for ${sector.name} Kenya | ${sector.name} Power Solutions`,
    description: `${sector.description}. Professional generator installation, service & maintenance for ${sector.name.toLowerCase()} across Kenya. Call +254768860665`,
    keywords: [
      ...sector.keywords,
      `${sector.name.toLowerCase()} generators kenya`,
      `${sector.name.toLowerCase()} backup power`,
    ],
    openGraph: {
      title: `Generators for ${sector.name} in Kenya`,
      description: sector.description,
      type: 'website',
      locale: 'en_KE',
    },
  };
}

export default async function SectorPage({ params }: Props) {
  const resolvedParams = await params;
  const sector = getSectorBySlug(resolvedParams.sector);

  if (!sector) {
    notFound();
  }

  const faqs = generateSectorFAQs(sector, 'Kenya');

  // Get priority counties
  const priorityCounties = KENYA_LOCATIONS.filter(
    (c) =>
      ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu', 'machakos', 'kajiado', 'nyeri', 'meru', 'eldoret'].includes(
        c.slug
      )
  ).slice(0, 10);

  // Get related sectors in same category
  const relatedSectors = getSectorsByCategory(sector.category).filter((s) => s.slug !== sector.slug).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-sm font-medium capitalize">{sector.category} Sector</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generators for{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {sector.name}
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{sector.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Get Quote
              </Link>
              <Link
                href={`/sectors/${sector.slug}/kenya/nairobi`}
                className="px-8 py-3 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
              >
                Find in Nairobi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Power Needs */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Power Requirements for {sector.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sector.powerNeeds.map((need, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 rounded-lg p-4"
              >
                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-300">{need}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Challenges</h2>
              <div className="space-y-3">
                {sector.challenges.map((challenge, i) => (
                  <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-gray-300">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Solutions</h2>
              <div className="space-y-3">
                {sector.solutions.map((solution, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find in Your Location */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Find {sector.name} Power Solutions in Kenya
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {priorityCounties.map((county) => (
              <Link
                key={county.slug}
                href={`/sectors/${sector.slug}/kenya/${county.slug}`}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center text-gray-300 hover:border-amber-400/30 hover:text-amber-400 transition-all text-sm"
              >
                {county.name}
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/counties" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all counties →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Sectors */}
      {relatedSectors.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Related Sectors</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedSectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sectors/${s.slug}`}
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
            Need Power Solutions for Your {sector.shortName}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contact us for professional generator installation, service, and maintenance tailored for {sector.name.toLowerCase()}.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Get a Quote Today
          </Link>
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Generator Solutions for ${sector.name}`,
            description: sector.description,
            provider: {
              '@type': 'Organization',
              name: 'Emerson EIMS',
              telephone: '+254768860665',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Kenya',
            },
            serviceType: 'Generator Installation and Maintenance',
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
