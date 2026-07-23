import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manufacturing Power Solutions | Industrial Generators | EmersonEIMS Kenya',
  description: 'Reliable industrial power for factories and manufacturing plants across Kenya. Generator sizing, load analysis, preventive maintenance, emergency backup. 60% cost savings typical.',
  alternates: {
    canonical: 'https://www.emersoneims.com/industries/manufacturing',
  },
};

export default function ManufacturingIndustriesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Manufacturing Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Zero Downtime Production
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Factories depend on uninterrupted power. We design systems that don't just backup — they optimize your energy efficiency,
            reduce costs by 40-60%, and keep production running 24/7/365.
          </p>
        </div>
      </section>

      {/* Core Challenge */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">The Manufacturing Power Challenge</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">❌ The Problem</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Grid power is unreliable (20+ outages/month typical)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Each 1-hour outage = KES 100K-500K production loss
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Oversized generators waste fuel (50-70% inefficient)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Generic "backup" doesn't optimize energy costs
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Reactive maintenance = surprise failures + downtime
                </li>
              </ul>
            </div>

            <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-4">✓ The EmersonEIMS Solution</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Right-sized generators (AI load analysis prevents overspending)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Smart load management (20-40% fuel savings)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Solar + battery hybrid (reduce grid dependency)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Predictive maintenance (catch issues before failure)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> 99.5% uptime guarantee (SLA-backed)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Factory Type */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Power Solutions by Production Type</h2>

          <div className="space-y-6">
            {[
              {
                name: 'Light Manufacturing (Textiles, Electronics Assembly)',
                power: '50-150 kVA',
                features: '2-phase generator + ATS + preventive maintenance SLA',
                cost: 'KES 400K - 1.2M',
                savings: '20-30% fuel savings typical',
                timeline: '1-2 weeks',
              },
              {
                name: 'Heavy Manufacturing (Steel, Metalworking)',
                power: '200-500 kVA',
                features: '3-phase industrial generator + load sharing + harmonic filtering',
                cost: 'KES 2M - 6M',
                savings: '40-50% fuel savings typical',
                timeline: '3-4 weeks',
              },
              {
                name: 'Process Industries (Beverage, Chemicals, Pharmaceuticals)',
                power: '300-1000 kVA',
                features: 'Redundant generators + UPS for sensitive processes + real-time monitoring',
                cost: 'KES 4M - 12M',
                savings: '60% fuel + downtime prevention worth 2-5x investment',
                timeline: '4-6 weeks',
              },
              {
                name: 'Food & Beverage Production',
                power: '150-400 kVA',
                features: 'Temperature-controlled refrigeration UPS + backup power + cold-chain monitoring',
                cost: 'KES 1.5M - 4M',
                savings: 'Equipment preservation = KES 500K-2M per incident prevented',
                timeline: '2-3 weeks',
              },
            ].map((type, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">{type.name}</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">Power Range</p>
                        <p className="font-bold text-white">{type.power}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Features</p>
                        <p className="text-sm text-gray-300">{type.features}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Typical Investment</p>
                      <p className="text-lg font-bold text-yellow-400">{type.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Implementation</p>
                      <p className="text-sm text-gray-300">{type.timeline}</p>
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                    <p className="text-xs text-green-400 font-bold mb-2">TYPICAL SAVINGS</p>
                    <p className="text-lg font-bold text-green-300">{type.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Factory Success Stories</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                factory: 'Nairobi Steel Works',
                issue: 'Grid outages causing production stops (KES 200K/hour loss), monthly equipment damage',
                solution: '250 kVA generator + solar canopy + predictive maintenance SLA',
                result: '99.7% uptime, KES 60M annual production protected, 50% fuel savings',
                investment: 'KES 3.2M',
              },
              {
                factory: 'East African Beverages',
                issue: 'Refrigeration failures destroying product batches (KES 500K-1M per incident)',
                solution: 'Dedicated UPS for cold-chain + 150 kVA backup + temperature monitoring',
                result: 'Zero product loss in 18 months, KES 12M+ damage prevention',
                investment: 'KES 1.8M',
              },
              {
                factory: 'Textiles manufacturer (Kisumu)',
                issue: 'Expensive diesel consumption (KES 800K/month), inefficient oversized generator',
                solution: 'Right-sized 80 kVA + smart load management + preventive maintenance',
                result: '45% fuel cost reduction (KES 360K/month savings), 36-month ROI',
                investment: 'KES 900K',
              },
              {
                factory: 'Pharmaceutical manufacturer',
                issue: 'Production compliance risk: uninterrupted cold chain required for ISO 13485',
                solution: 'Redundant UPS + generator backup + real-time monitoring + SLA guarantee',
                result: '99.95% uptime verified, audit compliance maintained, zero production delays',
                investment: 'KES 2.5M',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-6 bg-slate-900/50 border border-yellow-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-4">{study.factory}</h3>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">Problem</p>
                    <p className="text-sm text-gray-300">{study.issue}</p>
                  </div>

                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">Solution</p>
                    <p className="text-sm text-gray-300">{study.solution}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                    <p className="text-xs text-green-400 font-bold mb-1">Result</p>
                    <p className="text-sm text-green-300">{study.result}</p>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-gray-400">Investment</p>
                    <p className="text-lg font-bold text-yellow-400">{study.investment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Keep Your Factory Running</h2>
          <p className="text-lg text-gray-300 mb-10">
            Every hour of downtime is money lost. Schedule a free load analysis to see how much you could save with optimized power infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=manufacturing"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              Get Factory Power Assessment
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-bold rounded-lg hover:bg-yellow-500/10 transition-all"
            >
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
