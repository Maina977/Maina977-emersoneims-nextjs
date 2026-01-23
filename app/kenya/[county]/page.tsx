import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KENYA_LOCATIONS, getCountyBySlug } from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';

type Props = {
  params: Promise<{ county: string }>;
};

// Generate static params for all counties
export async function generateStaticParams() {
  return KENYA_LOCATIONS.map((county) => ({
    county: county.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const county = getCountyBySlug(resolvedParams.county);

  if (!county) {
    return { title: 'County Not Found' };
  }

  const title = `Generator Services in ${county.name} County | All ${county.constituencies.length} Constituencies | Emerson EiMS`;
  const description = `Professional generator installation, repair, maintenance & rental in ${county.name} County, Kenya. Serving ${county.constituencies.length} constituencies including ${county.constituencies.slice(0, 3).map(c => c.name).join(', ')}. Population: ${county.population.toLocaleString()}+. 24/7 emergency support. Call +254768860665`;

  return {
    title,
    description,
    keywords: [
      `generators ${county.name}`,
      `generator companies ${county.name}`,
      `generator repair ${county.name}`,
      `generator maintenance ${county.name}`,
      `generator rental ${county.name}`,
      `diesel generators ${county.name}`,
      `power solutions ${county.name}`,
      `solar installation ${county.name}`,
      `${county.name} county generators`,
      ...county.constituencies.slice(0, 5).map(c => `generators ${c.name}`),
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
      url: `https://www.emersoneims.com/kenya/${county.slug}`,
      siteName: 'Emerson EiMS',
    },
    alternates: {
      canonical: `https://www.emersoneims.com/kenya/${county.slug}`,
    },
  };
}

export default async function CountyPage({ params }: Props) {
  const resolvedParams = await params;
  const county = getCountyBySlug(resolvedParams.county);

  if (!county) {
    notFound();
  }

  // Get neighboring counties (same region)
  const neighboringCounties = KENYA_LOCATIONS
    .filter(c => c.region === county.region && c.slug !== county.slug)
    .slice(0, 4);

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `Emerson EiMS - ${county.name} County`,
            description: `Generator services in ${county.name} County, Kenya`,
            url: `https://www.emersoneims.com/kenya/${county.slug}`,
            telephone: '+254768860665',
            email: 'info@emersoneims.com',
            areaServed: {
              '@type': 'AdministrativeArea',
              name: `${county.name} County`,
              containedInPlace: { '@type': 'Country', name: 'Kenya' }
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Generator Services',
              itemListElement: SEO_SERVICES.map((service, i) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: `${service.name} in ${county.name}`,
                  url: `https://www.emersoneims.com/kenya/${county.slug}/${service.slug}`
                },
                position: i + 1
              }))
            }
          })
        }}
      />

      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li className="text-white">{county.name} County</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-400/10 text-amber-400 text-sm mb-4">
            {county.region} Region
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Generator Services in {county.name} County
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-4">
            Professional generator installation, repair, maintenance, and rental services
            across all <span className="text-cyan-400 font-bold">{county.constituencies.length} constituencies</span> in {county.name} County.
          </p>
          <p className="text-gray-500 mb-8">
            Serving {county.population.toLocaleString()}+ residents with 24/7 emergency support
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-amber-500 text-black px-8 py-4 rounded-full font-bold hover:bg-amber-400 transition-colors"
            >
              Get a Free Quote in {county.name}
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
            Our Services in {county.name} County
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SEO_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`/kenya/${county.slug}/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all group"
              >
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors text-center">
                  {service.shortName}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  in {county.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Constituencies */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Service Areas in {county.name} County
          </h2>
          <p className="text-gray-400 text-center mb-8">
            We provide generator services in all {county.constituencies.length} constituencies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {county.constituencies.map((constituency) => (
              <Link
                key={constituency.slug}
                href={`/kenya/${county.slug}/${constituency.slug}`}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group text-center"
              >
                <span className="text-white group-hover:text-cyan-400 transition-colors text-sm">
                  {constituency.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Services in This County */}
        <div className="mb-16 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Popular Generator Services in {county.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { service: 'generator-companies', label: `Generator Companies in ${county.name}` },
              { service: 'generator-repairs', label: `Generator Repairs in ${county.name}` },
              { service: 'generator-maintenance', label: `Generator Maintenance in ${county.name}` },
              { service: 'generator-lease', label: `Generator Rental in ${county.name}` },
              { service: 'diesel-generators', label: `Diesel Generators in ${county.name}` },
              { service: 'generator-spare-parts', label: `Generator Parts in ${county.name}` },
            ].map((item) => (
              <Link
                key={item.service}
                href={`/kenya/${county.slug}/${item.service}`}
                className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-amber-400/50 hover:bg-white/5 transition-all flex items-center justify-between"
              >
                <span className="text-white">{item.label}</span>
                <span className="text-amber-400">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Why Choose Emerson EiMS in {county.name}?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">24/7</div>
              <div className="text-gray-400">Emergency Support</div>
              <p className="text-xs text-gray-500 mt-2">Available across {county.name}</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15+</div>
              <div className="text-gray-400">Years Experience</div>
              <p className="text-xs text-gray-500 mt-2">Trusted in Kenya</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">{county.constituencies.length}</div>
              <div className="text-gray-400">Areas Covered</div>
              <p className="text-xs text-gray-500 mt-2">In {county.name} County</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-gray-400">Happy Clients</div>
              <p className="text-xs text-gray-500 mt-2">Nationwide</p>
            </div>
          </div>
        </div>

        {/* Nearby Counties */}
        {neighboringCounties.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Generator Services in Nearby Counties
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {neighboringCounties.map((nearbyCounty) => (
                <Link
                  key={nearbyCounty.slug}
                  href={`/kenya/${nearbyCounty.slug}`}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all text-center"
                >
                  <div className="text-white font-medium">{nearbyCounty.name}</div>
                  <div className="text-xs text-gray-500">{nearbyCounty.constituencies.length} constituencies</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need Generator Services in {county.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact our team for professional generator installation, repair, and maintenance
            anywhere in {county.name} County. Free site surveys and competitive quotes.
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

export const revalidate = 86400;
