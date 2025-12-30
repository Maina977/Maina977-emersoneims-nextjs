/**
 * COUNTIES INDEX PAGE
 * Hub page linking to all 47 county pages
 * SEO-optimized for "services in Kenya counties"
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { KENYA_COUNTIES } from '@/lib/seo/seoConfig';

export const metadata: Metadata = {
  title: 'Generator & Solar Services in All 47 Kenya Counties | Emerson EiMS',
  description: 'Professional generator, solar, UPS, and electrical services across all 47 counties in Kenya. Complete coverage from Nairobi to Turkana, Mombasa to Kakamega. 24/7 emergency service nationwide.',
  keywords: 'generator kenya, solar installation kenya, generator services all counties, power solutions kenya, generator nairobi, generator mombasa, generator kisumu, generator nakuru, 47 counties kenya, generator installation nationwide, solar power kenya counties',
  openGraph: {
    title: 'Services in All 47 Kenya Counties | Emerson EiMS',
    description: 'Complete power solutions coverage across all Kenyan counties. Generators, Solar, UPS, Electrical Services.',
    url: 'https://www.emersoneims.com/counties',
    type: 'website'
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/counties'
  }
};

export default function CountiesPage() {
  // Group counties by region
  const countiesByRegion = KENYA_COUNTIES.reduce((acc, county) => {
    if (!acc[county.region]) {
      acc[county.region] = [];
    }
    acc[county.region].push(county);
    return acc;
  }, {} as Record<string, typeof KENYA_COUNTIES>);

  const regions = Object.keys(countiesByRegion).sort();

  return (
    <main className="min-h-screen bg-black text-white">
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.emersoneims.com' },
        { name: 'Counties', url: 'https://www.emersoneims.com/counties' }
      ]} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-6">
            <span className="text-brand-gold text-sm font-mono">🇰🇪 Nationwide Coverage</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Services in All <span className="text-brand-gold">47 Kenya Counties</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Complete generator, solar, UPS, and electrical service coverage from Nairobi to Turkana, 
            Mombasa to Kakamega. Professional power solutions in every county, constituency, and village.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a 
              href="tel:+254768860655"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all"
            >
              📞 Call +254 768 860 655
            </a>
            <Link 
              href="/contact"
              className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-gold/10 transition-all"
            >
              Request Quote
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-gold mb-2">47</div>
              <div className="text-sm text-gray-400">Counties Covered</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-gold mb-2">400+</div>
              <div className="text-sm text-gray-400">Constituencies</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-gold mb-2">24/7</div>
              <div className="text-sm text-gray-400">Emergency Service</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-brand-gold mb-2">15+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Counties by Region */}
      {regions.map((region) => {
        const counties = countiesByRegion[region];
        const regionSlug = region.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <section key={region} className="py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  <span className="text-brand-gold">{region}</span> Region
                </h2>
                <p className="text-gray-400">
                  {counties.length} {counties.length === 1 ? 'county' : 'counties'} • 
                  {counties.reduce((sum, c) => sum + c.constituencies.length, 0)} constituencies • 
                  {counties.reduce((sum, c) => sum + c.population, 0).toLocaleString()} residents
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {counties.map((county) => {
                  const slug = county.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  
                  return (
                    <Link
                      key={county.code}
                      href={`/counties/${slug}`}
                      className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-gold/50 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-brand-gold transition-colors mb-1">
                            {county.name} County
                          </h3>
                          <div className="text-sm text-gray-500">
                            Code #{county.code} • {region}
                          </div>
                        </div>
                        <div className="text-2xl">📍</div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{county.population.toLocaleString()} residents</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🏛️</span>
                          <span>{county.constituencies.length} constituencies</span>
                        </div>
                      </div>

                      <div className="text-brand-gold text-sm font-mono">
                        View Services →
                      </div>

                      {/* Preview constituencies */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500 mb-2">Constituencies:</div>
                        <div className="flex flex-wrap gap-1">
                          {county.constituencies.slice(0, 3).map((constituency) => (
                            <span
                              key={constituency}
                              className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                            >
                              {constituency}
                            </span>
                          ))}
                          {county.constituencies.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{county.constituencies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* SEO Content */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-6">
            Comprehensive Power Solutions Across All Kenyan Counties
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>
              Emerson EiMS provides professional generator installation, solar power systems, UPS solutions, 
              and electrical services across all 47 counties in Kenya. From the bustling capital of Nairobi 
              to the remote regions of Turkana, we deliver reliable power solutions to every corner of the country.
            </p>

            <p>
              Our nationwide network covers all 400+ constituencies and thousands of villages, ensuring that 
              no location is too remote for our expert services. Whether you need a diesel generator installation 
              in Mombasa, solar panels in Kisumu, or UPS systems in Nakuru, our certified engineers are ready 
              to serve you with 24/7 emergency support.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Services Available in All Counties</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Generator Installation, Repair, and Maintenance</li>
              <li>Solar Power System Design and Installation</li>
              <li>UPS and Battery Backup Systems</li>
              <li>Air Conditioning Installation and Servicing</li>
              <li>Electrical Wiring and Rewiring</li>
              <li>Motor Rewinding and Repair</li>
              <li>Generator Controls (DeepSea, PowerWizard)</li>
              <li>Automation and SCADA Systems</li>
              <li>Generator Canopy Fabrication</li>
              <li>Water Pump Installation and Repair</li>
            </ul>

            <p className="mt-8">
              Every county page provides detailed information about our services in that specific region, 
              including coverage of all constituencies, local contact information, and emergency service availability.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Find Your County
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Click on any county above to see our full range of services in your area
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="tel:+254768860655"
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-all text-lg"
            >
              📞 Call: +254 768 860 655
            </a>
            <a 
              href="mailto:info@emersoneims.com"
              className="px-8 py-4 border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-gold/10 transition-all text-lg"
            >
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
