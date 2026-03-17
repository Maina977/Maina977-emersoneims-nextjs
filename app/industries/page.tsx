/**
 * Industries Hub Page
 *
 * Landing page listing all industries we serve with compelling copy
 * that drives visitors to industry-specific pages.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllIndustries, INDUSTRY_STATS } from '@/lib/seo/industryData';

export const metadata: Metadata = {
  title: 'Industries We Serve | Generator & Power Solutions for Every Sector | EmersonEIMS',
  description: 'Specialized generator and power solutions for hotels, hospitals, schools, banks, factories, flower farms, real estate, churches, and government. Serving 16,245+ hotels, 9,458+ hospitals, 93,988+ schools across Kenya. Call +254768860665.',
  openGraph: {
    title: 'Industries We Serve | EmersonEIMS Kenya',
    description: 'Specialized power solutions for every industry in Kenya. Hotels, hospitals, schools, banks, manufacturing, and more.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/industries',
  }
};

export default function IndustriesPage() {
  const industries = getAllIndustries();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Industries</li>
            </ol>
          </nav>

          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
              Trusted by Kenya's Leading Organizations
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Power Solutions for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Every Industry
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              We don't believe in one-size-fits-all. Every industry has unique power challenges.
              That's why we've developed specialized solutions for each sector - from hospital ICUs
              to flower farm cold rooms.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href="tel:+254768860665"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Call: +254 768 860 665
              </a>
              <a
                href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20for%20my%20business.%20Please%20contact%20me."
                className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{INDUSTRY_STATS.totalHotelsTarget}</div>
              <div className="text-slate-400 text-sm">Hotels in Kenya</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{INDUSTRY_STATS.totalHospitalsTarget}</div>
              <div className="text-slate-400 text-sm">Hospitals & Clinics</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{INDUSTRY_STATS.totalSchoolsTarget}</div>
              <div className="text-slate-400 text-sm">Schools & Universities</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{INDUSTRY_STATS.totalCountiesCovered}</div>
              <div className="text-slate-400 text-sm">Counties Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Choose Your Industry
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Click on your industry to see tailored solutions, case studies, and pricing specific to your sector.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group relative p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="text-5xl mb-4">{industry.icon}</div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {industry.name}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {industry.heroSubtitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                      {industry.marketSize}
                    </span>
                    <span className="text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Industry-Specific */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why Industry-Specific Solutions Matter
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Right-Sized Solutions</h3>
              <p className="text-slate-400">
                A hospital needs different power specs than a hotel. We understand the critical loads,
                response times, and redundancy requirements for each industry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Budget-Appropriate</h3>
              <p className="text-slate-400">
                Schools and churches operate on different budgets than banks and factories.
                We offer financing options and refurbished units to match your financial reality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Compliance Ready</h3>
              <p className="text-slate-400">
                Healthcare regulations, CBK requirements, export certifications - we provide
                documentation that satisfies industry-specific compliance needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            Trusted Across All Sectors
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400 mb-1">3</div>
              <div className="text-slate-400 text-sm">Year Warranty</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400 mb-1">1,500+</div>
              <div className="text-slate-400 text-sm">Installations</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400 mb-1">47</div>
              <div className="text-slate-400 text-sm">Counties</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-cyan-400 mb-1">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Solution Fits?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our power experts will assess your specific needs and recommend the perfect solution.
            Free consultation, free site survey, no obligation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20help%20choosing%20the%20right%20power%20solution%20for%20my%20business.%20Please%20advise."
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>Industry-Specific Generator Solutions in Kenya</h2>
          <p>
            EmersonEIMS provides specialized power solutions for every major industry in Kenya.
            Unlike generic generator suppliers, we understand that each sector has unique requirements:
          </p>

          <ul>
            <li><strong>Hotels and hospitality</strong> need silent operation and seamless changeover to avoid disturbing guests</li>
            <li><strong>Hospitals</strong> require zero-transfer-time UPS systems for life-critical equipment</li>
            <li><strong>Schools</strong> need budget-friendly options with payment plans that match fee collection cycles</li>
            <li><strong>Banks</strong> demand enterprise-grade reliability with CBK compliance documentation</li>
            <li><strong>Factories</strong> require heavy-duty industrial generators that handle high starting currents</li>
            <li><strong>Flower farms</strong> need cold room protection and solar-hybrid irrigation systems</li>
            <li><strong>Real estate</strong> requires construction site rentals and permanent building backup systems</li>
            <li><strong>Churches</strong> benefit from affordable solutions and flexible payment options</li>
            <li><strong>Government offices</strong> need AGPO-compliant vendors with proper documentation</li>
          </ul>

          <h3>Why Choose EmersonEIMS for Your Industry?</h3>
          <p>
            With over 1,500 installations across Kenya's 47 counties, we've developed deep expertise
            in every major industry. Our technicians understand your specific challenges, our sales
            team speaks your language, and our support staff knows exactly how critical your power
            needs are.
          </p>

          <p>
            Call us today at <a href="tel:+254768860665">+254 768 860 665</a> for a free consultation
            tailored to your industry's unique requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
