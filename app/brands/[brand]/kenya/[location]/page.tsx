import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  GENERATOR_BRANDS,
  getBrandBySlug,
  getAllBrandSlugs,
  generateBrandTitle,
  generateBrandDescription,
  generateBrandH1,
  generateBrandFAQs,
  generateBrandKeywords,
} from '@/lib/data/generator-brands';
import {
  KENYA_LOCATIONS,
  getCountyBySlug,
} from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';

type Props = {
  params: Promise<{ brand: string; location: string }>;
};

// Priority counties for static generation
const PRIORITY_COUNTIES = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu',
  'machakos', 'kajiado', 'nyeri', 'meru', 'uasin-gishu'
];

// Generate static params for brand + priority locations
export async function generateStaticParams() {
  const params: { brand: string; location: string }[] = [];

  for (const brand of getAllBrandSlugs()) {
    for (const countySlug of PRIORITY_COUNTIES) {
      params.push({
        brand,
        location: countySlug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = getBrandBySlug(resolvedParams.brand);
  const county = getCountyBySlug(resolvedParams.location);

  if (!brand || !county) {
    return { title: 'Not Found' };
  }

  const title = generateBrandTitle(brand, county.name);
  const description = generateBrandDescription(brand, county.name);
  const keywords = generateBrandKeywords(brand, county.name);

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
      canonical: `https://emersoneims.com/brands/${brand.slug}/kenya/${county.slug}`,
    },
  };
}

// Enable ISR for non-priority pages
export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

export default async function BrandLocationPage({ params }: Props) {
  const resolvedParams = await params;
  const brand = getBrandBySlug(resolvedParams.brand);
  const county = getCountyBySlug(resolvedParams.location);

  if (!brand || !county) {
    notFound();
  }

  const h1 = generateBrandH1(brand, county.name);
  const faqs = generateBrandFAQs(brand, county.name);

  // Get related services
  const generatorServices = SEO_SERVICES.filter(s => s.category === 'generators').slice(0, 6);

  // Get nearby counties
  const nearbyCounties = KENYA_LOCATIONS.filter(
    c => c.region === county.region && c.slug !== county.slug
  ).slice(0, 5);

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
            <Link href="/brands" className="hover:text-white">Brands</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/brands/${brand.slug}`} className="hover:text-white">{brand.name}</Link>
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
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm">
                {brand.country}
              </span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                {county.name} County
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {h1}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {brand.description}. Available for sale, installation, and service in {county.name}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Get Quote in {county.name}
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

      {/* Brand Info Grid */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Power Range</h3>
              <p className="text-2xl font-bold text-amber-400">{brand.powerRange}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Origin</h3>
              <p className="text-2xl font-bold text-cyan-400">{brand.country}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
              <p className="text-2xl font-bold text-white">{county.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why Choose {brand.name} in {county.name}?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brand.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
              >
                <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Applications in {county.name}
          </h2>
          <div className="flex flex-wrap gap-3">
            {brand.applications.map((app, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
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
            {brand.name} FAQs for {county.name}
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
              {brand.name} in Nearby Counties
            </h2>
            <div className="flex flex-wrap gap-3">
              {nearbyCounties.map((c) => (
                <Link
                  key={c.slug}
                  href={`/brands/${brand.slug}/kenya/${c.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-amber-400/30 hover:text-amber-400 transition-all text-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Brands */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            Other Brands in {county.name}
          </h2>
          <div className="flex flex-wrap gap-3">
            {GENERATOR_BRANDS.filter(b => b.slug !== brand.slug).slice(0, 8).map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}/kenya/${county.slug}`}
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
            Get {brand.name} Generator in {county.name}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contact us for sales, installation, service, and genuine spare parts.
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

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${brand.name} Generators in ${county.name}`,
            description: `${brand.description}. Available in ${county.name}, Kenya.`,
            brand: {
              '@type': 'Brand',
              name: brand.name,
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'KES',
              availability: 'https://schema.org/InStock',
              areaServed: {
                '@type': 'City',
                name: county.name,
                containedInPlace: {
                  '@type': 'Country',
                  name: 'Kenya',
                },
              },
              seller: {
                '@type': 'LocalBusiness',
                name: 'Emerson EIMS',
                telephone: '+254768860665',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: county.name,
                  addressCountry: 'KE',
                },
              },
            },
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
