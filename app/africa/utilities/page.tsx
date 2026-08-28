import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Utilities Power Infrastructure | Water Treatment • Substations • Renewable Integration',
  description: 'Government utility power systems across Africa. Water treatment plants, grid substations, renewable energy integration. 99.5% SLA for essential services. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/utilities',
  },
};

export default function UtilitiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Powering Africa's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              Essential Services
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Water, electricity, wastewater — essential services that 1.4 billion Africans depend on every day. Utilities require backup power infrastructure that's reliable, scalable, and integrated with renewable energy systems.
          </p>
        </div>
      </section>

      {/* Utility Crisis */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Utility Infrastructure Crisis</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">600M</div>
              <p className="text-sm text-gray-300 mb-4">Without access to reliable electricity</p>
              <p className="text-xs text-gray-400">Only 45% of sub-Saharan Africa has 24/7 power</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">KES 50B+</div>
              <p className="text-sm text-gray-300 mb-4">Annual economic loss to power outages</p>
              <p className="text-xs text-gray-400">Water loss, healthcare disruption, business impact</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">KES 1T+</div>
              <p className="text-sm text-gray-300 mb-4">Annual government utility infrastructure spend</p>
              <p className="text-xs text-gray-400">Water, electricity, wastewater systems</p>
            </div>
          </div>

          <p className="text-center text-gray-300 text-lg">
            Utilities are where backup power infrastructure has the highest ROI and most strategic importance for African governments.
          </p>
        </div>
      </section>

      {/* Utility Types */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Utility Power Systems Across Africa</h2>

          <div className="space-y-8">
            {[
              {
                type: 'Water Treatment Plants',
                importance: 'Critical infrastructure (public health)',
                locations: 'Every African city (50-100+ installations per country)',
                powerNeeds: '100-500 kVA (continuous operation)',
                challenge: 'Grid outages = no clean water = public health crisis, water loss, disease risk',
                solution: 'Generator + UPS for control systems + solar integration for cost reduction',
                impact: 'Continuous water supply even during grid failures, cost reduction 30-50%',
              },
              {
                type: 'Electrical Grid Substations',
                importance: 'National infrastructure backbone',
                locations: 'National transmission networks (1000+ substations per country)',
                powerNeeds: '50-300 kVA (substation control systems)',
                challenge: 'Substation power loss = cascading blackouts affecting thousands',
                solution: 'Backup generator + UPS for relay systems + automatic failover',
                impact: 'Grid stability enhanced, outage duration reduced from hours to minutes',
              },
              {
                type: 'Renewable Energy Integration',
                importance: 'Government sustainability goals',
                locations: 'Solar farms, wind projects, hydroelectric facilities',
                powerNeeds: '500-5000 kVA (integration facilities)',
                challenge: 'Solar/wind variability requires storage + grid backup for stability',
                solution: 'Solar+generator+battery hybrid systems + grid synchronization',
                impact: '30-70% renewable penetration possible vs 5-10% today',
              },
              {
                type: 'Wastewater Treatment',
                importance: 'Environmental & public health',
                locations: 'Major cities and industrial areas',
                powerNeeds: '50-200 kVA (continuous operation)',
                challenge: 'Treatment stops during outages = environmental disaster + disease',
                solution: 'Dedicated backup generator + treatment process protection',
                impact: 'Environmental compliance maintained, treatment never interrupted',
              },
            ].map((util, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-4">{util.type}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Importance</p>
                        <p className="text-sm text-red-300 font-semibold">{util.importance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Locations</p>
                        <p className="text-sm text-gray-300">{util.locations}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Power Requirement</p>
                        <p className="text-sm text-blue-300 font-semibold">{util.powerNeeds}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded">
                      <p className="text-xs text-red-400 font-bold mb-2">RISK IF POWER FAILS</p>
                      <p className="text-sm text-red-300">{util.challenge}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-2">SOLUTION</p>
                      <p className="text-sm text-gray-300">{util.solution}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                      <p className="text-xs text-green-400 font-bold mb-1">IMPACT</p>
                      <p className="text-sm text-green-300">{util.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Utility Projects Across Africa</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Nairobi Water Supply Crisis Resolution',
                location: 'Nairobi Water & Sewerage Co, Kenya',
                issue: '2-3 daily outages = KES 50M/day water loss, 1M people without supply',
                solution: '5-site generator network for water treatment plants + solar backup + real-time monitoring',
                result: '99.5% uptime restored, water supply guaranteed, KES 1B+ in saved water annually',
                investment: 'KES 120M',
                roi: '1-month ROI via prevented water loss',
              },
              {
                title: 'Tanzania National Grid Stability',
                location: 'Tanzania Electricity Supply Company (TANESCO)',
                issue: 'Cascading blackouts affecting entire regions due to substation control failures',
                solution: 'Backup generators for 50+ key substations nationwide + automated failover',
                result: '99.7% grid stability achieved, outage duration reduced from 8hrs to 30 mins',
                investment: 'KES 500M',
                roi: '6-month ROI via reduced losses, industrial competitiveness improved',
              },
              {
                title: 'Uganda Renewable Energy Integration',
                location: 'Kampala Solar Farm + Grid Connection',
                issue: 'Solar farm installation blocked by grid instability concerns, variability management',
                solution: '2000 kVA hybrid system (solar+battery+generator) with grid synchronization',
                result: '60% renewable penetration achieved, grid stability maintained, backup for cloudy days',
                investment: 'KES 180M',
                roi: '40% KPLC bill reduction + renewable credit incentives = 18-month ROI',
              },
              {
                title: 'Rwanda Environmental Compliance',
                location: 'Kigali Wastewater Treatment Plant',
                issue: 'Environmental violations from treatment stoppages during grid outages',
                solution: 'Dedicated 150 kVA generator + process protection systems',
                result: '99.9% treatment uptime, environmental compliance maintained, zero violations',
                investment: 'KES 35M',
                roi: 'Avoided compliance fines + maintained operational license',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-blue-400 mb-2">{study.title}</h3>
                <p className="text-xs text-gray-400 mb-4">📍 {study.location}</p>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">ISSUE</p>
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
                      <p className="font-bold text-blue-400">{study.investment}</p>
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

      {/* Government Buyer Services */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Utilities-Specific Solutions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Infrastructure & Integration</h3>
              <ul className="space-y-3">
                {[
                  'Multi-site generator networks (50+ installation coordination)',
                  'Grid synchronization for reliable solar/wind integration',
                  'Substation control system backup power',
                  'Water treatment plant emergency protocols',
                  'Renewable energy hybrid systems (solar+battery+generator)',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Government Services</h3>
              <ul className="space-y-3">
                {[
                  'AGPO/Procurement compliance (all documentation)',
                  '99.5% SLA with performance guarantees',
                  'Multi-country government deployments',
                  'National scale project management',
                  'Environmental & regulatory compliance',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Africa's Essential Services</h2>
          <p className="text-lg text-gray-300 mb-10">
            Water, electricity, wastewater — Africa's citizens depend on utilities. We keep them running with 99.5% SLA backup power.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20work%20for%20a%20utility%20and%20need%20power%20infrastructure%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Water Treatment • Grid Substations • Renewable Integration • Wastewater • All African Utilities
          </p>
        </div>
      </section>
    </div>
  );
}
