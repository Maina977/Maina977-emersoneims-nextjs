import Link from 'next/link';
import { Metadata } from 'next';
import EastAfricaCityLinks from '@/components/east-africa/EastAfricaCityLinks';

export const metadata: Metadata = {
  title: 'Power Solutions Tanzania | Dar es Salaam • Arusha • Mbeya | EmersonEIMS',
  description: 'Reliable generator and power solutions across Tanzania. Dar es Salaam industrial parks, Arusha hospitals, Mbeya mining operations. 24/7 support in TZS. Call +255754411722.',
  alternates: {
    canonical: 'https://www.emersoneims.com/east-africa/tanzania',
  },
};

export default function TanzaniaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Power Solutions</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Across Tanzania
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From Dar es Salaam's bustling industrial parks to Arusha's growing business hub, from Mbeya's mining operations to Dodoma's government offices — EmersonEIMS delivers reliable power across all 31 regions of Tanzania.
          </p>
        </div>
      </section>

      {/* Tanzania Coverage */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Presence in Tanzania</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                region: 'Dar es Salaam',
                description: 'Industrial hub, port operations, commercial centers',
                coverage: 'Premium — Same-day delivery & 8-hour response',
                icon: '🏭',
              },
              {
                region: 'Arusha',
                description: 'Regional business center, healthcare, tourism',
                coverage: 'Premium — 12-hour response',
                icon: '🏢',
              },
              {
                region: 'Mbeya',
                description: 'Mining operations, processing facilities',
                coverage: 'Premium — 24-hour response',
                icon: '⛏️',
              },
              {
                region: 'Dodoma',
                description: 'Government services, administrative hub',
                coverage: 'Standard — 48-hour response',
                icon: '🏛️',
              },
              {
                region: 'Zanzibar',
                description: 'Tourism, hospitality, island operations',
                coverage: 'Standard — 2-3 day response',
                icon: '🏝️',
              },
              {
                region: 'Other Regions',
                description: 'Complete nationwide coverage (26 more regions)',
                coverage: 'Emerging — Scheduled service & remote support',
                icon: '🗺️',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-green-400 mb-2">{item.region}</h3>
                <p className="text-sm text-gray-300 mb-4">{item.description}</p>
                <p className="text-xs text-green-300 font-semibold">{item.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries in Tanzania */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Industries We Serve in Tanzania</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                industry: '⛏️ Mining & Extraction',
                details: 'Gold, tanzanite, gemstones, copper operations',
                locations: 'Mbeya, Iringa, Shinyanga, Kagera',
                link: '/east-africa/tanzania/mining',
              },
              {
                industry: '🌾 Agriculture & Processing',
                details: 'Coffee mills, tea factories, sisal processing, grain storage',
                locations: 'Morogoro, Iringa, Kigali Region',
                link: '/east-africa/tanzania/agriculture',
              },
              {
                industry: '📡 Telecommunications',
                details: 'Tower backup, data centers, carrier operations',
                locations: 'Dar es Salaam, Arusha, nationwide',
                link: '/east-africa/tanzania/telecom',
              },
              {
                industry: '🏥 Healthcare',
                details: 'Hospitals, clinics, diagnostic centers',
                locations: 'Dar es Salaam, Arusha, Mbeya, Dodoma',
                link: '/services/healthcare',
              },
              {
                industry: '🏢 Commercial Real Estate',
                details: 'Office towers, shopping centers, residential',
                locations: 'Dar es Salaam, Arusha, Mbeya CBD',
                link: '/industries/commercial-property',
              },
              {
                industry: '🏭 Manufacturing',
                details: 'Textile mills, food processing, industrial',
                locations: 'Dar es Salaam Region, Tanga, Morogoro',
                link: '/industries/manufacturing',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg hover:border-green-400/50 transition-all hover:bg-slate-800/70"
              >
                <h3 className="text-xl font-bold text-white mb-3">{item.industry}</h3>
                <p className="text-sm text-gray-300 mb-3">{item.details}</p>
                <p className="text-xs text-green-400">📍 {item.locations}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tanzania Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Success Stories Across Tanzania</h2>

          <div className="space-y-8">
            {[
              {
                title: 'Dar es Salaam Industrial Park Factory',
                location: 'Dar es Salaam',
                issue: 'Food processing plant experiencing 4-6 hour outages daily, spoiling KES 800K+ per incident',
                solution: '250 kVA generator + solar canopy + predictive maintenance',
                result: '99.7% uptime, zero spoilage incidents, KES 150M+ product protected annually',
                investment: 'TZS 45M (~KES 3.2M)',
              },
              {
                title: 'Arusha Regional Hospital',
                location: 'Arusha',
                issue: 'ICU equipment vulnerable to 30+ outages/year, patient safety at risk',
                solution: 'Medical-grade UPS + 200 kVA generator + 24/7 emergency support',
                result: '99.8% uptime, zero power-related incidents, TANZREC compliance achieved',
                investment: 'TZS 32M (~KES 2.3M)',
              },
              {
                title: 'Mbeya Mining Operation',
                location: 'Mbeya',
                issue: 'Gold extraction site losing TZS 2M/hour per outage, fuel costs KES 800K/month',
                solution: 'Dual 300 kVA generators + smart load management + fuel optimization',
                result: '99.5% uptime, 45% fuel cost reduction, 2-year ROI achieved',
                investment: 'TZS 85M (~KES 6M)',
              },
              {
                title: 'Dar es Salaam Shopping Mall',
                location: 'Dar es Salaam',
                issue: 'Power cuts causing retail closures, spoiled cold-chain, KES 500K per incident',
                solution: '800 kVA redundant generators + smart load management + 24/7 support',
                result: '99.8% uptime, zero retail disruptions, 40% energy savings',
                investment: 'TZS 120M (~KES 8.6M)',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">{study.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">📍 {study.location}</p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">THE CHALLENGE</p>
                        <p className="text-sm text-gray-300">{study.issue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">OUR SOLUTION</p>
                        <p className="text-sm text-gray-300">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                      <p className="text-xs text-green-400 font-bold mb-2">RESULT</p>
                      <p className="text-sm text-green-300">{study.result}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-1">Investment (TZS)</p>
                      <p className="text-lg font-bold text-green-400">{study.investment}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services in Tanzania */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What We Offer in Tanzania</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                service: 'Generator Sales & Installation',
                details: 'Cummins, Perkins, FG Wilson — 20 kVA to 2000 kVA. Same-day delivery in Dar. Professional installation with 3-year warranty.',
              },
              {
                service: 'UPS & Battery Backup Systems',
                details: 'Medical-grade, enterprise-grade, or industrial-grade UPS. Zero-transfer protection for critical equipment.',
              },
              {
                service: 'Solar & Hybrid Systems',
                details: 'Reduce grid dependency by 50-80% with solar. Perfect for mining, farms, and remote locations.',
              },
              {
                service: 'ATS/Changeover Panels',
                details: 'Automatic Transfer Switches. Seamless changeover from grid to generator. No operator intervention needed.',
              },
              {
                service: 'Maintenance & Service Contracts',
                details: 'Preventive maintenance, emergency response, genuine parts. 24/7 support in Dar es Salaam and Arusha.',
              },
              {
                service: 'Remote Monitoring',
                details: 'Real-time fuel level, generator runtime, temperature alerts via SMS or mobile app.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-green-400 mb-3">{item.service}</h3>
                <p className="text-gray-300">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Solutions Across Tanzania</h2>
          <p className="text-lg text-gray-300 mb-10">
            Whether you're in Dar, Arusha, Mbeya, or anywhere in Tanzania — we deliver reliable power with local support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+255754411722"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +255 754 411 722
            </a>
            <a
              href="https://wa.me/255754411722?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20in%20Tanzania.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Available in: Dar es Salaam • Arusha • Mbeya • Dodoma • Moshi • Iringa • Morogoro • Zanzibar • All 31 Regions
          </p>
        </div>
      </section>

      <EastAfricaCityLinks country="tanzania" />
    </main>
  );
}
