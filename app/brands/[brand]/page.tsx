import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  GENERATOR_BRANDS,
  getBrandBySlug,
  getAllBrandSlugs,
  generateBrandFAQs,
} from '@/lib/data/generator-brands';
import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';

type Props = {
  params: Promise<{ brand: string }>;
};

// Generate static params for all brands
export async function generateStaticParams() {
  return getAllBrandSlugs().map((slug) => ({
    brand: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = getBrandBySlug(resolvedParams.brand);

  if (!brand) {
    return { title: 'Brand Not Found' };
  }

  return {
    title: `${brand.name} Generators Kenya | ${brand.name} Dealer & Service`,
    description: `${brand.name} generators in Kenya. Authorized ${brand.name} dealer offering sales, installation, service & genuine spare parts. ${brand.powerRange}. Call +254768860665`,
    keywords: [
      ...brand.keywords,
      `${brand.name} kenya`,
      `${brand.name} generator dealer`,
      `${brand.name} service kenya`,
      `buy ${brand.name} generator`,
    ],
    openGraph: {
      title: `${brand.name} Generators Kenya | Official Dealer`,
      description: brand.description,
      type: 'website',
      locale: 'en_KE',
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const resolvedParams = await params;
  const brand = getBrandBySlug(resolvedParams.brand);

  if (!brand) {
    notFound();
  }

  const faqs = generateBrandFAQs(brand, 'Kenya');

  // Get priority counties for location links
  const priorityCounties = KENYA_LOCATIONS.filter(
    (c) =>
      ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu', 'machakos', 'kajiado', 'nyeri', 'meru', 'eldoret'].includes(
        c.slug
      )
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-sm font-medium">{brand.country} Brand</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {brand.name}
              </span>{' '}
              Generators
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{brand.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Get Quote
              </Link>
              <Link
                href={`/brands/${brand.slug}/kenya/nairobi`}
                className="px-8 py-3 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
              >
                Find in Nairobi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Power Range & Applications */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Power Range</h2>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8">
                <div className="text-4xl font-bold text-amber-400 mb-4">{brand.powerRange}</div>
                <p className="text-gray-400">
                  {brand.name} offers generators across this power range, suitable for residential, commercial, and
                  industrial applications.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Applications</h2>
              <div className="flex flex-wrap gap-3">
                {brand.applications.map((app, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {brand.features.map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6 hover:border-cyan-400/30 transition-colors"
              >
                <div className="w-12 h-12 bg-cyan-400/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find in Your Location */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Find {brand.name} Generators in Kenya
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {priorityCounties.map((county) => (
              <Link
                key={county.slug}
                href={`/brands/${brand.slug}/kenya/${county.slug}`}
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

      {/* Other Brands */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Other Generator Brands</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {GENERATOR_BRANDS.filter((b) => b.slug !== brand.slug)
              .slice(0, 8)
              .map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-cyan-400/30 hover:text-cyan-400 transition-all text-sm"
                >
                  {b.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a {brand.name} Generator?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contact us for sales, installation, service, and genuine spare parts for {brand.name} generators.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Contact Us Today
          </Link>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${brand.name} Generators`,
            description: brand.description,
            brand: {
              '@type': 'Brand',
              name: brand.name,
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'KES',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'Emerson EIMS',
                telephone: '+254768860665',
              },
            },
          }),
        }}
      />
    </div>
  );
}
