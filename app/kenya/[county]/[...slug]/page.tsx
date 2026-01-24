import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  KENYA_LOCATIONS,
  getCountyBySlug,
  getConstituencyBySlug,
  getVillageBySlug,
} from '@/lib/data/kenya-locations';
import {
  SEO_SERVICES,
  getServiceBySlug,
  generateServiceFAQs,
  SEOService,
} from '@/lib/data/seo-services';
import {
  generateLocationServiceMetadata,
  generateConstituencyMetadata,
  generateVillageMetadata,
} from '@/lib/seo/location-service-metadata';
import LocationServiceSchema from '@/components/seo/LocationServiceSchema';

type Props = {
  params: Promise<{ county: string; slug: string[] }>;
};

// Types for page resolution
type PageType =
  | 'county-service'
  | 'constituency'
  | 'constituency-service'
  | 'village'
  | 'village-service';

interface ResolvedPage {
  type: PageType;
  county: (typeof KENYA_LOCATIONS)[0];
  constituency?: (typeof KENYA_LOCATIONS)[0]['constituencies'][0];
  village?: (typeof KENYA_LOCATIONS)[0]['constituencies'][0]['villages'][0];
  service?: SEOService;
}

// Resolve the page type from slug
function resolvePage(
  countySlug: string,
  slugParts: string[]
): ResolvedPage | null {
  const county = getCountyBySlug(countySlug);
  if (!county) return null;

  // Single segment: could be service or constituency
  if (slugParts.length === 1) {
    const service = getServiceBySlug(slugParts[0]);
    if (service) {
      return { type: 'county-service', county, service };
    }

    const constituency = getConstituencyBySlug(countySlug, slugParts[0]);
    if (constituency) {
      return { type: 'constituency', county, constituency };
    }

    return null;
  }

  // Two segments: could be constituency/service or constituency/village
  if (slugParts.length === 2) {
    const constituency = getConstituencyBySlug(countySlug, slugParts[0]);
    if (!constituency) return null;

    const service = getServiceBySlug(slugParts[1]);
    if (service) {
      return { type: 'constituency-service', county, constituency, service };
    }

    const village = getVillageBySlug(countySlug, slugParts[0], slugParts[1]);
    if (village) {
      return { type: 'village', county, constituency, village };
    }

    return null;
  }

  // Three segments: village/service
  if (slugParts.length === 3) {
    const constituency = getConstituencyBySlug(countySlug, slugParts[0]);
    if (!constituency) return null;

    const village = getVillageBySlug(countySlug, slugParts[0], slugParts[1]);
    if (!village) return null;

    const service = getServiceBySlug(slugParts[2]);
    if (!service) return null;

    return { type: 'village-service', county, constituency, village, service };
  }

  return null;
}

// Priority counties for full static generation (major cities)
const PRIORITY_COUNTIES = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret',
  'kiambu', 'machakos', 'kajiado', 'nyeri', 'meru'
];

// Generate static params for key pages only (reduced for deployment size)
// Other pages generated on-demand with ISR
export async function generateStaticParams() {
  const params: { county: string; slug: string[] }[] = [];

  for (const county of KENYA_LOCATIONS) {
    const isPriority = PRIORITY_COUNTIES.includes(county.slug);

    // County + Service pages for ALL counties (~705 combinations)
    for (const service of SEO_SERVICES) {
      params.push({
        county: county.slug,
        slug: [service.slug],
      });
    }

    // Only pre-generate constituency pages for priority counties
    // Other constituencies generated on-demand via ISR
    if (isPriority) {
      for (const constituency of county.constituencies) {
        params.push({
          county: county.slug,
          slug: [constituency.slug],
        });
      }
    }

    // Constituency + Service pages generated on-demand via ISR
    // Village pages generated on-demand via ISR
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const page = resolvePage(resolvedParams.county, resolvedParams.slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  switch (page.type) {
    case 'county-service':
      return generateLocationServiceMetadata(
        { name: page.county.name, slug: page.county.slug, type: 'county' },
        page.service!,
        { county: { name: page.county.name, slug: page.county.slug } }
      );

    case 'constituency':
      return generateConstituencyMetadata(
        page.constituency!.name,
        page.constituency!.slug,
        page.county.name,
        page.county.slug
      );

    case 'constituency-service':
      return generateLocationServiceMetadata(
        {
          name: page.constituency!.name,
          slug: page.constituency!.slug,
          type: 'constituency',
        },
        page.service!,
        {
          county: { name: page.county.name, slug: page.county.slug },
          constituency: {
            name: page.constituency!.name,
            slug: page.constituency!.slug,
          },
        }
      );

    case 'village':
      return generateVillageMetadata(
        page.village!.name,
        page.village!.slug,
        page.constituency!.name,
        page.constituency!.slug,
        page.county.name,
        page.county.slug
      );

    case 'village-service':
      return generateLocationServiceMetadata(
        { name: page.village!.name, slug: page.village!.slug, type: 'village' },
        page.service!,
        {
          county: { name: page.county.name, slug: page.county.slug },
          constituency: {
            name: page.constituency!.name,
            slug: page.constituency!.slug,
          },
        }
      );

    default:
      return { title: 'Not Found' };
  }
}

export default async function DynamicLocationPage({ params }: Props) {
  const resolvedParams = await params;
  const page = resolvePage(resolvedParams.county, resolvedParams.slug);

  if (!page) {
    notFound();
  }

  switch (page.type) {
    case 'county-service':
      return (
        <CountyServicePage county={page.county} service={page.service!} />
      );

    case 'constituency':
      return (
        <ConstituencyPage county={page.county} constituency={page.constituency!} />
      );

    case 'constituency-service':
      return (
        <ConstituencyServicePage
          county={page.county}
          constituency={page.constituency!}
          service={page.service!}
        />
      );

    case 'village':
      return (
        <VillagePage
          county={page.county}
          constituency={page.constituency!}
          village={page.village!}
        />
      );

    case 'village-service':
      return (
        <VillageServicePage
          county={page.county}
          constituency={page.constituency!}
          village={page.village!}
          service={page.service!}
        />
      );

    default:
      notFound();
  }
}

// ============================================================================
// COUNTY + SERVICE PAGE COMPONENT
// ============================================================================
function CountyServicePage({
  county,
  service,
}: {
  county: (typeof KENYA_LOCATIONS)[0];
  service: SEOService;
}) {
  const faqs = generateServiceFAQs(service, county.name);
  const h1 = service.metaTemplate.h1.replace(/{location}/g, county.name);
  const relatedServices = SEO_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);
  const nearbyConstituencies = county.constituencies.slice(0, 6);

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <LocationServiceSchema
        location={county.name}
        locationType="county"
        service={service}
        county={county.name}
        url={`/kenya/${county.slug}/${service.slug}`}
      />

      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}`} className="hover:text-white">{county.name}</Link></li>
            <li>/</li>
            <li className="text-white">{service.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {h1}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            {service.metaTemplate.description.replace(/{location}/g, county.name)}
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

        {/* Service Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our {service.shortName} Services in {county.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mb-4">
                  <span className="text-amber-400 text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
                <p className="text-gray-400 text-sm">
                  Professional {feature.toLowerCase()} services available in {county.name}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Why Choose Emerson EiMS for {service.shortName} in {county.name}?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">24/7</div>
              <div className="text-gray-400">Emergency Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">47</div>
              <div className="text-gray-400">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-amber-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {service.shortName} Service Areas in {county.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nearbyConstituencies.map((constituency) => (
              <Link
                key={constituency.slug}
                href={`/kenya/${county.slug}/${constituency.slug}/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-center"
              >
                <span className="text-white font-medium">{constituency.name}</span>
              </Link>
            ))}
          </div>
          {county.constituencies.length > 6 && (
            <div className="text-center mt-6">
              <Link href={`/kenya/${county.slug}`} className="text-amber-400 hover:text-amber-300">
                View all {county.constituencies.length} constituencies &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Related Services */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Other Services in {county.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                href={`/kenya/${county.slug}/${relatedService.slug}`}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {relatedService.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {relatedService.description} in {county.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need {service.shortName} in {county.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact our team for professional {service.name.toLowerCase()} services in {county.name} County.
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

// ============================================================================
// CONSTITUENCY PAGE COMPONENT
// ============================================================================
function ConstituencyPage({
  county,
  constituency,
}: {
  county: (typeof KENYA_LOCATIONS)[0];
  constituency: (typeof KENYA_LOCATIONS)[0]['constituencies'][0];
}) {
  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}`} className="hover:text-white">{county.name}</Link></li>
            <li>/</li>
            <li className="text-white">{constituency.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Generator Services in {constituency.name}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Professional generator installation, repair, and maintenance services in {constituency.name}, {county.name} County.
            24/7 emergency support for homes and businesses.
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
            Our Services in {constituency.name}
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SEO_SERVICES.slice(0, 10).map((service) => (
              <Link
                key={service.id}
                href={`/kenya/${county.slug}/${constituency.slug}/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-center group"
              >
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                  {service.shortName}
                </h3>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {SEO_SERVICES.slice(10).map((service) => (
              <Link
                key={service.id}
                href={`/kenya/${county.slug}/${constituency.slug}/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all text-center group"
              >
                <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                  {service.shortName}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Villages */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Areas We Serve in {constituency.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {constituency.villages.slice(0, 15).map((village) => (
              <Link
                key={village.slug}
                href={`/kenya/${county.slug}/${constituency.slug}/${village.slug}`}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all text-center text-sm"
              >
                <span className="text-gray-300 hover:text-white">{village.name}</span>
              </Link>
            ))}
          </div>
          {constituency.villages.length > 15 && (
            <p className="text-center mt-4 text-gray-400">
              And {constituency.villages.length - 15} more villages in {constituency.name}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need Power Solutions in {constituency.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our team provides generator and power services throughout {constituency.name}, {county.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Contact Us
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

// ============================================================================
// CONSTITUENCY + SERVICE PAGE COMPONENT
// ============================================================================
function ConstituencyServicePage({
  county,
  constituency,
  service,
}: {
  county: (typeof KENYA_LOCATIONS)[0];
  constituency: (typeof KENYA_LOCATIONS)[0]['constituencies'][0];
  service: SEOService;
}) {
  const faqs = generateServiceFAQs(service, constituency.name);
  const h1 = service.metaTemplate.h1.replace(/{location}/g, constituency.name);
  const relatedServices = SEO_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <LocationServiceSchema
        location={constituency.name}
        locationType="constituency"
        service={service}
        county={county.name}
        constituency={constituency.name}
        url={`/kenya/${county.slug}/${constituency.slug}/${service.slug}`}
      />

      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}`} className="hover:text-white">{county.name}</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}/${constituency.slug}`} className="hover:text-white">{constituency.name}</Link></li>
            <li>/</li>
            <li className="text-white">{service.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {h1}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            {service.metaTemplate.description.replace(/{location}/g, constituency.name)}
          </p>
          <p className="text-gray-500 mb-8">
            Serving {constituency.name} and surrounding areas in {county.name} County
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

        {/* Service Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our {service.shortName} Services in {constituency.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mb-4">
                  <span className="text-amber-400 text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-amber-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Villages */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {service.shortName} in {constituency.name} Villages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {constituency.villages.slice(0, 10).map((village) => (
              <Link
                key={village.slug}
                href={`/kenya/${county.slug}/${constituency.slug}/${village.slug}/${service.slug}`}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-center text-sm"
              >
                <span className="text-gray-300 hover:text-white">{village.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Related Services */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Other Services in {constituency.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                href={`/kenya/${county.slug}/${constituency.slug}/${relatedService.slug}`}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {relatedService.name}
                </h3>
                <p className="text-gray-400 text-sm">{relatedService.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need {service.shortName} in {constituency.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us for professional services in {constituency.name}, {county.name} County.
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

// ============================================================================
// VILLAGE PAGE COMPONENT
// ============================================================================
function VillagePage({
  county,
  constituency,
  village,
}: {
  county: (typeof KENYA_LOCATIONS)[0];
  constituency: (typeof KENYA_LOCATIONS)[0]['constituencies'][0];
  village: (typeof KENYA_LOCATIONS)[0]['constituencies'][0]['villages'][0];
}) {
  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}`} className="hover:text-white">{county.name}</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}/${constituency.slug}`} className="hover:text-white">{constituency.name}</Link></li>
            <li>/</li>
            <li className="text-white">{village.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Generator Services in {village.name}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            Professional generator installation, repair, and maintenance services in {village.name}.
          </p>
          <p className="text-gray-500 mb-8">
            {constituency.name}, {county.name} County, Kenya
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
            Available Services in {village.name}
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SEO_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`/kenya/${county.slug}/${constituency.slug}/${village.slug}/${service.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-center group"
              >
                <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                  {service.shortName}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need Power Solutions in {village.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact our team for professional generator and power services in {village.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Contact Us
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

// ============================================================================
// VILLAGE + SERVICE PAGE COMPONENT
// ============================================================================
function VillageServicePage({
  county,
  constituency,
  village,
  service,
}: {
  county: (typeof KENYA_LOCATIONS)[0];
  constituency: (typeof KENYA_LOCATIONS)[0]['constituencies'][0];
  village: (typeof KENYA_LOCATIONS)[0]['constituencies'][0]['villages'][0];
  service: SEOService;
}) {
  const faqs = generateServiceFAQs(service, village.name);
  const h1 = service.metaTemplate.h1.replace(/{location}/g, village.name);
  const relatedServices = SEO_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <LocationServiceSchema
        location={village.name}
        locationType="village"
        service={service}
        county={county.name}
        constituency={constituency.name}
        url={`/kenya/${county.slug}/${constituency.slug}/${village.slug}/${service.slug}`}
      />

      <div className="eims-shell py-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/kenya" className="hover:text-white">Kenya</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}`} className="hover:text-white">{county.name}</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}/${constituency.slug}`} className="hover:text-white">{constituency.name}</Link></li>
            <li>/</li>
            <li><Link href={`/kenya/${county.slug}/${constituency.slug}/${village.slug}`} className="hover:text-white">{village.name}</Link></li>
            <li>/</li>
            <li className="text-white">{service.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {h1}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            {service.metaTemplate.description.replace(/{location}/g, village.name)}
          </p>
          <p className="text-gray-500 mb-8">
            {constituency.name}, {county.name} County
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

        {/* Service Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our {service.shortName} Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-amber-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Services */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Other Services in {village.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                href={`/kenya/${county.slug}/${constituency.slug}/${village.slug}/${relatedService.slug}`}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {relatedService.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            Need {service.shortName} in {village.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us for professional services in {village.name}.
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

// Enable ISR for better build performance
export const revalidate = 86400; // Revalidate every 24 hours
export const dynamicParams = true; // Allow unlisted params to be generated on-demand
