/**
 * NAIROBI COUNTY PAGE
 * SEO-optimized page for Nairobi County
 * Auto-generated for comprehensive Kenya coverage
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const COUNTY_DATA = {
  name: 'Nairobi',
  code: '047',
  region: 'Central',
  population: 4397073,
  constituencies: ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare']
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
  description: `Professional generator installation, solar power, UPS, and electrical services in ${COUNTY_DATA.name} County. Covering all ${COUNTY_DATA.constituencies.length} constituencies. 24/7 emergency service. Call +254 768 860 655`,
  keywords: `generator ${COUNTY_DATA.name}, solar installation ${COUNTY_DATA.name}, generator repair ${COUNTY_DATA.name}, ups ${COUNTY_DATA.name}, electrician ${COUNTY_DATA.name}, generator service ${COUNTY_DATA.name} county, solar company ${COUNTY_DATA.name}, generator maintenance ${COUNTY_DATA.name}, power solutions ${COUNTY_DATA.name}, ${COUNTY_DATA.constituencies.join(', ')}, generator installation ${COUNTY_DATA.name} kenya, best generator company ${COUNTY_DATA.name}, emergency generator repair ${COUNTY_DATA.name}`,
  openGraph: {
    title: `Generator & Solar Services in ${COUNTY_DATA.name} County | Emerson EiMS`,
    description: `Professional power solutions in ${COUNTY_DATA.name} County. All ${COUNTY_DATA.constituencies.length} constituencies covered. 24/7 Emergency Service.`,
    url: `https://www.emersoneims.com/counties/nairobi`,
    siteName: 'Emerson EiMS',
    locale: 'en_KE',
    type: 'website'
  },
  alternates: {
    canonical: `https://www.emersoneims.com/counties/nairobi`
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

export default function NairobiCountyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <OrganizationSchema />
      <LocalBusinessSchema county={COUNTY_DATA.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.emersoneims.com' },
        { name: 'Counties', url: 'https://www.emersoneims.com/counties' },
        { name: COUNTY_DATA.name, url: `https://www.emersoneims.com/counties/nairobi` }
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

          {/* Emergency CTAs - Search Intent Optimized */}
          <div className="bg-gradient-to-r from-red-600/20 via-orange-600/20 to-amber-600/20 border-2 border-amber-400/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl animate-pulse">⚡</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Emergency Generator Repair {COUNTY_DATA.name}</h3>
                <p className="text-amber-300 font-semibold">2-Hour Response Time • 24/7/365 Availability</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="tel:+254782914717"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg hover:scale-105 transition-all shadow-lg"
              >
                🚨 Emergency: +254 782 914 717
              </a>
              <a 
                href="tel:+254768860655"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
              >
                📞 General: +254 768 860 655
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link 
              href="/contact?service=emergency&location=nairobi"
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-all shadow-xl"
            >
              🔥 Request Emergency Service
            </Link>
            <Link 
              href="/contact?service=quote&location=nairobi"
              className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-gold/10 transition-all"
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

      {/* Emergency Search Intent Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Common Emergency Searches in <span className="text-brand-gold">{COUNTY_DATA.name}</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/contact?service=emergency&location=nairobi&issue=breakdown"
              className="group bg-red-900/20 border border-red-500/30 rounded-xl p-6 hover:border-red-400 hover:bg-red-900/30 transition-all"
            >
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="text-lg font-bold mb-2 text-red-400">Generator Breakdown {COUNTY_DATA.name}</h3>
              <p className="text-sm text-gray-400 mb-3">Generator stopped working? Emergency repair in 2 hours</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Get Emergency Help →
              </div>
            </Link>

            <Link
              href="/diagnostic-suite"
              className="group bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 hover:border-orange-400 hover:bg-orange-900/30 transition-all"
            >
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold mb-2 text-orange-400">Generator Error Codes</h3>
              <p className="text-sm text-gray-400 mb-3">DSE 7320, PowerWizard, Cummins fault codes</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Diagnose Error →
              </div>
            </Link>

            <Link
              href="/contact?service=repair&location=nairobi"
              className="group bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400 hover:bg-yellow-900/30 transition-all"
            >
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="text-lg font-bold mb-2 text-yellow-400">Generator Not Starting</h3>
              <p className="text-sm text-gray-400 mb-3">Battery, starter, fuel system diagnosis & repair</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Request Repair →
              </div>
            </Link>

            <Link
              href="/solar?location=nairobi"
              className="group bg-green-900/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400 hover:bg-green-900/30 transition-all"
            >
              <div className="text-3xl mb-3">☀️</div>
              <h3 className="text-lg font-bold mb-2 text-green-400">Solar Installation {COUNTY_DATA.name}</h3>
              <p className="text-sm text-gray-400 mb-3">Rooftop solar, solar farms, hybrid systems</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Calculate ROI →
              </div>
            </Link>

            <Link
              href="/contact?service=maintenance&location=nairobi"
              className="group bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-900/30 transition-all"
            >
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="text-lg font-bold mb-2 text-blue-400">Generator Maintenance Contract</h3>
              <p className="text-sm text-gray-400 mb-3">Scheduled service, oil changes, load testing</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Get AMC Quote →
              </div>
            </Link>

            <Link
              href="/contact?service=spare-parts&location=nairobi"
              className="group bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 hover:bg-purple-900/30 transition-all"
            >
              <div className="text-3xl mb-3">🔩</div>
              <h3 className="text-lg font-bold mb-2 text-purple-400">Generator Spare Parts</h3>
              <p className="text-sm text-gray-400 mb-3">Cummins, Perkins, CAT parts in {COUNTY_DATA.name}</p>
              <div className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Order Parts →
              </div>
            </Link>
          </div>

          {/* Why Choose Us */}
          <div className="mt-16 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Why {COUNTY_DATA.name} Businesses Choose EmersonEIMS</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-brand-gold mb-2">2 Hours</div>
                <div className="text-sm text-gray-400">Emergency Response</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-gold mb-2">15+</div>
                <div className="text-sm text-gray-400">Cummins/CAT Certified Technicians</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-gold mb-2">98.7%</div>
                <div className="text-sm text-gray-400">First-Time Fix Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-gold mb-2">24/7/365</div>
                <div className="text-sm text-gray-400">Availability</div>
              </div>
            </div>
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
              href="tel:+254768860655"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all"
            >
              📞 +254 768 860 655
            </a>
            <a 
              href="tel:+254782914717"
              className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-gold/10 transition-all"
            >
              📞 +254 782 914 717
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
