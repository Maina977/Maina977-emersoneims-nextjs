/**
 * ISIOLO COUNTY PAGE
 * SEO-optimized page for Isiolo County
 * Auto-generated for comprehensive Kenya coverage
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const COUNTY_DATA = {
  name: 'Isiolo',
  code: '011',
  region: 'Eastern',
  population: 268002,
  constituencies: ['Isiolo North', 'Isiolo South']
};

const SERVICES = [
  { id: 'generators', name: 'Generator Services', icon: '⚡', description: 'Installation, maintenance, and repair of generators' },
  { id: 'solar', name: 'Solar Energy', icon: '☀️', description: 'Complete solar power system installations' },
  { id: 'ups', name: 'UPS Systems', icon: '🔋', description: 'Uninterruptible power supply solutions' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️', description: 'HVAC installation and servicing' },
  { id: 'electrical', name: 'Electrical Services', icon: '💡', description: 'Complete electrical wiring and installations' },
  { id: 'motor', name: 'Motor Rewinding', icon: '🔄', description: 'Electric motor repair and rewinding' },
  { id: 'controls', name: 'Generator Controls', icon: '🎛️', description: 'Advanced control systems' },
  { id: 'automation', name: 'Automation', icon: '🤖', description: 'Industrial automation solutions' }
];

export const metadata: Metadata = {
  title: `Generator, Solar & Electrical Services in ${COUNTY_DATA.name} County | Emerson EiMS Kenya`,
  description: `Professional generator installation, solar power, UPS, and electrical services in ${COUNTY_DATA.name} County. Covering all ${COUNTY_DATA.constituencies.length} constituencies. 24/7 emergency service. Call +254768860665`,
  keywords: `generator ${COUNTY_DATA.name}, solar installation ${COUNTY_DATA.name}, generator repair ${COUNTY_DATA.name}, ups ${COUNTY_DATA.name}, electrician ${COUNTY_DATA.name}, generator service ${COUNTY_DATA.name} county, solar company ${COUNTY_DATA.name}, generator maintenance ${COUNTY_DATA.name}, power solutions ${COUNTY_DATA.name}, ${COUNTY_DATA.constituencies.join(', ')}, generator installation ${COUNTY_DATA.name} kenya, best generator company ${COUNTY_DATA.name}, emergency generator repair ${COUNTY_DATA.name}`,
  openGraph: {
    title: `Generator & Solar Services in ${COUNTY_DATA.name} County | Emerson EiMS`,
    description: `Professional power solutions in ${COUNTY_DATA.name} County. All ${COUNTY_DATA.constituencies.length} constituencies covered. 24/7 Emergency Service.`,
    url: `https://www.emersoneims.com/counties/isiolo`,
    siteName: 'Emerson EiMS',
    locale: 'en_KE',
    type: 'website'
  },
  alternates: {
    canonical: `https://www.emersoneims.com/counties/isiolo`
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function IsioloCountyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <OrganizationSchema />
      <LocalBusinessSchema county={COUNTY_DATA.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.emersoneims.com' },
        { name: 'Counties', url: 'https://www.emersoneims.com/counties' },
        { name: COUNTY_DATA.name, url: `https://www.emersoneims.com/counties/isiolo` }
      ]} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-6">
            <span className="text-brand-gold text-sm font-mono">📍 {COUNTY_DATA.region} Region • County #{COUNTY_DATA.code}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Generator & Solar Services in <span className="text-brand-gold">{COUNTY_DATA.name} County</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Professional power and energy solutions across all {COUNTY_DATA.constituencies.length} constituencies in {COUNTY_DATA.name} County. 
            Serving {COUNTY_DATA.population.toLocaleString()}+ residents with 24/7 emergency service.
          </p>

          {/* Emergency Alert Banner */}
          <section className="py-4 px-6 bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl animate-pulse">🚨</div>
                <div>
                  <div className="text-xl font-bold text-red-400">Emergency Generator Repair {COUNTY_DATA.name}</div>
                  <div className="text-sm text-gray-400">2-Hour Response Time • 24/7/365</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+254782914717" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all">
                  🔥 Emergency: +254782914717
                </a>
                <a href="tel:+254768860665" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-lg transition-all">
                  📞 General: +254768860665
                </a>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/contact?type=emergency"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              🔥 Request Emergency Service
            </Link>
            <Link
              href="/contact?type=quote"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all"
            >
              💰 Get Installation Quote
            </Link>
            <Link
              href="/diagnostic-suite"
              className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              🔧 Diagnose Generator Error
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12">
            Our Services in <span className="text-brand-gold">{COUNTY_DATA.name}</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-gold/50 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-gold transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-400">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Constituencies Coverage */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">
            All {COUNTY_DATA.constituencies.length} Constituencies Covered
          </h2>
          <p className="text-gray-400 mb-12">
            We provide generator, solar, and electrical services throughout {COUNTY_DATA.name} County:
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COUNTY_DATA.constituencies.map((constituency) => (
              <div
                key={constituency}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="font-semibold">{constituency}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Generator, Solar, UPS, Electrical
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-6">
            Power Solutions for {COUNTY_DATA.name} County
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>
              Looking for reliable generator services in {COUNTY_DATA.name} County? Emerson EiMS provides 
              comprehensive power solutions across all {COUNTY_DATA.constituencies.length} constituencies 
              including {COUNTY_DATA.constituencies.slice(0, 3).join(', ')}, and more.
            </p>

            <p>
              Our services include generator installation, repair, and maintenance for residential, commercial, 
              and industrial clients. We also specialize in solar power systems, UPS installations, electrical 
              wiring, motor rewinding, and automation solutions throughout {COUNTY_DATA.name}.
            </p>

            <p>
              With 24/7 emergency service and certified engineers, we guarantee reliable power solutions 
              for all {COUNTY_DATA.population.toLocaleString()}+ residents of {COUNTY_DATA.name} County.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Contact Us in {COUNTY_DATA.name} County
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="tel:+254768860665"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all"
            >
              📞 +254768860665
            </a>
            <a 
              href="tel:+254782914717"
              className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-gold/10 transition-all"
            >
              📞 +254782914717
            </a>
          </div>
          <p className="text-gray-400 mt-6">
            Email: <a href="mailto:info@emersoneims.com" className="text-brand-gold">info@emersoneims.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
