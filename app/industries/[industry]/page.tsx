/**
 * Dynamic Industry Page
 *
 * Individual landing page for each industry with:
 * - Industry-specific hero and messaging
 * - Pain points with cost of inaction
 * - Tailored solutions with pricing
 * - Testimonials from industry peers
 * - FAQs addressing industry concerns
 * - Strong CTAs with pre-filled WhatsApp messages
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllIndustries,
  getIndustryBySlug,
  getRelatedIndustries,
  generateIndustrySEO
} from '@/lib/seo/industryData';

interface Props {
  params: Promise<{ industry: string }>;
}

// Generate static paths for all industries
export async function generateStaticParams() {
  const industries = getAllIndustries();
  return industries.map(ind => ({ industry: ind.slug }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: industrySlug } = await params;
  const seo = generateIndustrySEO(industrySlug);

  if (!seo) {
    return { title: 'Industry Not Found' };
  }

  return {
    title: seo.title,
    description: seo.description,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    alternates: {
      canonical: `https://www.emersoneims.com/industries/${industrySlug}`,
    }
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);

  if (!industry) {
    notFound();
  }

  const relatedIndustries = getRelatedIndustries(industrySlug);
  const whatsappLink = `https://wa.me/254768860665?text=${encodeURIComponent(industry.whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/industries" className="hover:text-cyan-400 transition-colors">Industries</Link></li>
              <li>/</li>
              <li className="text-white">{industry.shortName}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{industry.icon}</span>
                <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium">
                  {industry.marketSize}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {industry.heroTitle}
              </h1>

              <p className="text-xl text-slate-300 mb-8">
                {industry.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="tel:+254768860665"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  Call: +254 768 860 665
                </a>
                <a
                  href={whatsappLink}
                  className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Quote
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industry.stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Placeholder / Market Info */}
            <div className="hidden lg:block">
              <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Market Opportunity</h3>
                <p className="text-slate-300 mb-6">{industry.marketDescription}</p>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-cyan-400 font-semibold">FREE Site Survey</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    We'll assess your facility and provide a detailed power analysis at no cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Real Cost of Power Outages
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Power failures in {industry.name.toLowerCase()} don't just cause inconvenience -
              they cost real money, damage reputations, and can even put lives at risk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.painPoints.map((painPoint, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-red-500/30 transition-colors"
              >
                <div className="text-4xl mb-4">{painPoint.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{painPoint.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{painPoint.description}</p>
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 text-sm font-medium">{painPoint.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Solutions for {industry.name}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tailored power solutions designed specifically for the challenges your industry faces.
              All backed by our 3-Year Warranty.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {industry.solutions.map((solution, index) => (
              <div
                key={index}
                className="relative p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors"
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{solution.description}</p>

                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {solution.price && (
                  <div className="pt-4 border-t border-slate-700">
                    <div className="text-2xl font-bold text-cyan-400">{solution.price}</div>
                    <div className="text-slate-500 text-xs">Installation included</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA after solutions */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Need a custom solution? We design systems for your exact requirements.</p>
            <a
              href={whatsappLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {industry.ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What {industry.name} Leaders Say
            </h2>
            <p className="text-slate-400">
              Real results from real customers in your industry.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {industry.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl"
              >
                {/* Quote icon */}
                <svg className="w-10 h-10 text-cyan-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.title}</div>
                    <div className="text-sm text-cyan-400">{testimonial.company}, {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Common questions from {industry.name.toLowerCase()} professionals like you.
            </p>
          </div>

          <div className="space-y-4">
            {industry.faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-300 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Related Industries
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {relatedIndustries.map((related) => (
                <Link
                  key={related.slug}
                  href={`/industries/${related.slug}`}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors"
                >
                  <span className="text-4xl">{related.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{related.name}</div>
                    <div className="text-sm text-slate-400">{related.marketSize}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Eliminate Power Problems?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Get a FREE power assessment for your {industry.name.toLowerCase()} facility.
            No obligation, no pressure - just expert advice.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-lg"
            >
              Call Now: +254 768 860 665
            </a>
            <a
              href={whatsappLink}
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp for Quote
            </a>
          </div>

          <p className="text-slate-400 text-sm">
            <strong className="text-white">3-Year Warranty</strong> on all installations |
            <strong className="text-white"> 24/7 Emergency Support</strong> |
            <strong className="text-white"> 47 Counties Covered</strong>
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>{industry.name} Power Solutions in Kenya</h2>
          <p>{industry.description}</p>

          <h3>Why {industry.name} Need Reliable Backup Power</h3>
          <p>
            With {industry.marketSize} across Kenya, the {industry.name.toLowerCase()} sector
            faces unique challenges when it comes to power reliability. Kenya Power's frequent
            outages can cause:
          </p>
          <ul>
            {industry.painPoints.slice(0, 3).map((pain, i) => (
              <li key={i}><strong>{pain.title}:</strong> {pain.description}</li>
            ))}
          </ul>

          <h3>EmersonEIMS: Your Trusted {industry.name} Power Partner</h3>
          <p>
            EmersonEIMS has served hundreds of {industry.name.toLowerCase()} facilities across
            Kenya's 47 counties. Our industry-specific expertise means we understand your unique
            requirements - from compliance needs to budget constraints.
          </p>

          <p>
            Call us today at <a href="tel:+254768860665">+254 768 860 665</a> or
            {' '}<a href={whatsappLink}>WhatsApp us</a> for a free consultation.
          </p>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `${industry.name} Power Solutions`,
            "provider": {
              "@type": "Organization",
              "name": "EmersonEIMS",
              "telephone": "+254768860665",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KE"
              }
            },
            "description": industry.description,
            "areaServed": {
              "@type": "Country",
              "name": "Kenya"
            },
            "serviceType": "Generator Installation and Maintenance",
            "offers": industry.solutions.map(solution => ({
              "@type": "Offer",
              "name": solution.title,
              "description": solution.description,
              "priceSpecification": solution.price ? {
                "@type": "PriceSpecification",
                "priceCurrency": "KES",
                "price": solution.price
              } : undefined
            }))
          })
        }}
      />
    </div>
  );
}
