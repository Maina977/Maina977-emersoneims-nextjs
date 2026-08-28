import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mining Power Solutions Africa | Gold • Diamonds • Cobalt | 99.5% Uptime SLA',
  description: 'Industrial power for African mining operations. Gold, diamonds, cobalt, lithium extraction. Generators, UPS, solar, remote monitoring. 99.5% SLA. KES 50M-500M per site. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/mining',
  },
};

export default function MiningPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Mining Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
              99.5% Uptime Guarantee
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            African mining operations generate KES 5 trillion annually. Every minute of downtime costs millions in lost extraction, processing delays, and export deadlines missed. We keep mines running through any power challenge.
          </p>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Mining Powerhouse</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm text-gray-400 font-bold mb-2">GLOBAL SHARE</p>
              <p className="text-2xl font-bold text-yellow-400">30%</p>
              <p className="text-xs text-gray-300">of world's minerals mined in Africa</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm text-gray-400 font-bold mb-2">ANNUAL VALUE</p>
              <p className="text-2xl font-bold text-yellow-400">KES 5T+</p>
              <p className="text-xs text-gray-300">total mining sector revenue</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm text-gray-400 font-bold mb-2">PER-SITE OPPORTUNITY</p>
              <p className="text-2xl font-bold text-yellow-400">KES 50M-500M</p>
              <p className="text-xs text-gray-300">single mine power infrastructure</p>
            </div>
          </div>

          <p className="text-center text-gray-300 text-lg">
            Every African country with mineral wealth is desperately seeking reliable power solutions. The opportunity is continent-wide and enormous.
          </p>
        </div>
      </section>

      {/* Mining Types & Power Needs */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Mining Operations Across Africa</h2>

          <div className="space-y-8">
            {[
              {
                type: 'Gold Mining',
                locations: 'South Africa, Ghana, Mali, Tanzania, Zimbabwe',
                power: '500-2000 kVA (24/7 continuous)',
                challenges: '20+ outages/month typical in rural areas, processing halts cost KES 500K/hour',
                solution: 'Dual 1000 kVA generators + solar canopy + remote monitoring',
                roi: '60-70% fuel savings + downtime prevention = 18-24 month ROI',
              },
              {
                type: 'Diamond Mining',
                locations: 'Botswana, DRC, South Africa',
                power: '300-1500 kVA (variable shift operations)',
                challenges: 'Processing equipment requires stable power, surge damage = KES 5M+ per incident',
                solution: 'UPS + stabilized generator + harmonic filtering',
                roi: '40% energy optimization + equipment protection = 2-year ROI',
              },
              {
                type: 'Cobalt & Copper',
                locations: 'DRC (world\'s largest), Zambia, Zimbabwe',
                power: '1000-3000 kVA (intensive refining)',
                challenges: 'Refining requires uninterrupted power, cold chain for ore preservation',
                solution: 'Tri-redundant generator system + solar hybrid + predictive maintenance',
                roi: '55% fuel cost reduction + KES 100M+ production protection = 3-4 month ROI',
              },
              {
                type: 'Lithium & Rare Earths',
                locations: 'DRC, Zimbabwe (emerging deposits)',
                power: '200-1000 kVA (specialized extraction)',
                challenges: 'New technologies require precision power, no room for fluctuations',
                solution: 'Industrial-grade UPS + generator + AI monitoring',
                roi: '50% energy savings + zero-loss guarantee = 6-9 month ROI',
              },
            ].map((mine, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">{mine.type}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">Locations</p>
                        <p className="text-sm text-gray-300">{mine.locations}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">Power Requirement</p>
                        <p className="text-sm text-yellow-300 font-semibold">{mine.power}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">Challenge</p>
                        <p className="text-sm text-gray-300">{mine.challenges}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-2">SOLUTION</p>
                      <p className="text-sm text-gray-300">{mine.solution}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                      <p className="text-xs text-green-400 font-bold mb-1">ROI PROJECTION</p>
                      <p className="text-sm text-green-300">{mine.roi}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Continental Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Mining Operations Powered by EmersonEIMS</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'South African Gold Mine',
                location: 'Witwatersrand Basin',
                issue: 'Gold extraction processing losing KES 800K/hour per outage, 30+ annual incidents',
                solution: '1500 kVA dual generators + UPS for all control systems + 24/7 remote monitoring',
                result: '99.5% uptime achieved, KES 300M annual production protected, zero extraction delays',
                investment: 'KES 85M',
                roi: '3-month ROI via downtime prevention',
              },
              {
                title: 'DRC Cobalt Refinery',
                location: 'Katanga Province',
                issue: 'Refining operations requiring 99.5% uptime, power fluctuations damaging equipment',
                solution: 'Industrial UPS + tri-redundant 2000 kVA generators + voltage stabilization',
                result: '99.95% uptime verified, zero production incidents, equipment lifespan extended',
                investment: 'KES 120M',
                roi: 'Equipment protection + uptime = 18-month ROI',
              },
              {
                title: 'Ghana Gold Mining Complex',
                location: 'Ashanti Region',
                issue: 'Processing plant losing KES 600K/hour, grid unreliable, backup system failed',
                solution: '800 kVA generator + solar canopy (30% energy reduction) + ATS automation',
                result: '99.7% uptime restored, 35% fuel cost reduction, processing resumed within 4 hours',
                investment: 'KES 55M',
                roi: '2-month ROI, then pure profit',
              },
              {
                title: 'Zambian Copper Mining',
                location: 'Copper Belt',
                issue: 'Multiple pit operations, KES 2M/hour revenue loss during outages',
                solution: 'Distributed 5-site 300 kVA generator network + centralized monitoring + fuel logistics',
                investment: 'KES 180M',
                result: '99.6% uptime, coordinated operations across all pits, 50% fuel cost optimization',
                roi: 'Break-even in 8-10 months of prevented downtime',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{study.title}</h3>
                <p className="text-xs text-gray-400 mb-4">📍 {study.location}</p>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">PROBLEM</p>
                    <p className="text-sm text-gray-300">{study.issue}</p>
                  </div>

                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">SOLUTION</p>
                    <p className="text-sm text-gray-300">{study.solution}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                    <p className="text-xs text-green-400 font-bold mb-1">RESULT</p>
                    <p className="text-sm text-green-300">{study.result}</p>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">Investment</p>
                      <p className="font-bold text-yellow-400">{study.investment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold">ROI</p>
                      <p className="font-bold text-green-400">{study.roi}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services for Mining */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Mining-Specific Power Solutions</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                service: 'Heavy-Duty Generators',
                features: '500-3000 kVA, 24/7 continuous rated, mining-grade construction',
              },
              {
                service: 'Industrial UPS Systems',
                features: 'Multi-megawatt capacity, zero-transfer protection, mining-grade isolation',
              },
              {
                service: 'Solar Hybrid Systems',
                features: '30-60% energy cost reduction, renewable integration, battery storage',
              },
              {
                service: 'Remote Monitoring',
                features: 'Real-time fuel, generator hours, temperature, predictive alerts via satellite',
              },
              {
                service: 'Fuel Logistics',
                features: 'Bulk tank management, auto-delivery, consumption tracking, cost optimization',
              },
              {
                service: '99.5% SLA Support',
                features: '24/7 emergency response, mobile workshop, genuine parts, predictive maintenance',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">{item.service}</h3>
                <p className="text-sm text-gray-300">{item.features}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Your Mining Operation</h2>
          <p className="text-lg text-gray-300 mb-10">
            From exploration to processing to export — every stage of mining depends on reliable power. We keep your operation running, profitable, and on schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20operate%20a%20mining%20site%20and%20need%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-bold rounded-lg hover:bg-yellow-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Gold • Diamonds • Cobalt • Copper • Lithium • All Mining Operations • All African Countries
          </p>
        </div>
      </section>
    </div>
  );
}
