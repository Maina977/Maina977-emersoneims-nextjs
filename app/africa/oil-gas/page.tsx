import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oil & Gas Power Infrastructure',
  description: 'Enterprise power solutions for African oil & gas operations. Exploration rigs, production platforms, processing plants, export terminals. KES 100M-1B per project. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/oil-gas',
  },
};

export default function OilGasPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Oil & Gas Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
              Mission-Critical Infrastructure
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Africa's oil & gas boom is transforming economies. Kenya, Mozambique, Tanzania, Angola, Nigeria — new fields, new discoveries, new opportunities. Every operation depends on power infrastructure that cannot fail.
          </p>
        </div>
      </section>

      {/* The Boom */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Oil & Gas Transformation</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg">
              <div className="text-4xl font-bold text-red-400 mb-2">KES 2T+</div>
              <p className="text-sm text-gray-300 mb-4">New discoveries since 2020</p>
              <p className="text-xs text-gray-400">Kenya, Tanzania, Mozambique, Angola, Senegal</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg">
              <div className="text-4xl font-bold text-red-400 mb-2">100M</div>
              <p className="text-sm text-gray-300 mb-4">Barrels of new capacity</p>
              <p className="text-xs text-gray-400">Production ramping 2024-2030</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg">
              <div className="text-4xl font-bold text-red-400 mb-2">KES 50B+</div>
              <p className="text-sm text-gray-300 mb-4">Annual infrastructure spend</p>
              <p className="text-xs text-gray-400">Exploration → production → export</p>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg">
            <h3 className="text-2xl font-bold text-red-400 mb-4">The Power Challenge</h3>
            <p className="text-gray-300 mb-4">
              Oil & gas operations require power for 24/7 operations with ZERO tolerance for downtime:
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                '🛢️ Drilling rigs need stable power for precision operations (rig downtime = KES 10M/day)',
                '🔧 Processing plants require uninterrupted power for temperature control & pressure maintenance',
                '📦 Export terminals depend on power for loading, compression, shipping coordination',
                '💻 Control systems monitoring safety, production, environmental compliance',
                '❄️ Cooling systems for pipelines, storage tanks, equipment protection',
                '📡 Communications & monitoring 24/7 (even during grid outages)',
              ].map((item, idx) => (
                <li key={idx} className="text-gray-300 flex gap-3">
                  <span>{item.split(' ')[0]}</span>
                  <span>{item.substring(item.indexOf(' ') + 1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Operational Stages */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Power Across O&G Operations</h2>

          <div className="space-y-8">
            {[
              {
                stage: 'Exploration Phase',
                duration: '2-5 years',
                operations: 'Seismic surveys, drilling exploration wells, core testing',
                powerNeeds: '50-200 kVA (mobile, temporary)',
                criticality: 'High — drilling operations sensitive to power fluctuations',
                solution: 'Mobile generator units + UPS for equipment, portable fuel storage',
                example: 'Kenya Turkana Basin exploration rig requiring 24/7 power for drilling precision',
              },
              {
                stage: 'Development Phase',
                duration: '2-3 years',
                operations: 'Production well drilling, infrastructure installation, field testing',
                powerNeeds: '200-500 kVA (semi-permanent)',
                criticality: 'Critical — parallel operations requiring coordinated power',
                solution: 'Multi-unit generator network, UPS backup, centralized monitoring',
                example: 'Mozambique FLNG development requiring integrated power across multiple sites',
              },
              {
                stage: 'Production Phase',
                duration: '20-30 years',
                operations: '24/7 extraction, processing, compression, export',
                powerNeeds: '1000-5000 kVA (permanent, continuous)',
                criticality: 'Mission-critical — zero downtime tolerance, revenue sensitive',
                solution: 'Industrial tri-redundant systems, UPS + multiple generators, real-time monitoring',
                example: 'Angola production platform: 99.7% uptime SLA, KES 100M+ revenue protection per day',
              },
              {
                stage: 'Export Terminal',
                duration: 'Entire operation',
                operations: 'Loading, compression, shipping coordination, export management',
                powerNeeds: '500-2000 kVA (continuous, coordinated)',
                criticality: 'Critical — export deadlines non-negotiable, penalties for delays',
                solution: 'Enterprise backup power with export facility integration, emergency protocols',
                example: 'Nigerian LNG terminal: power failure costs KES 500M per day in lost exports',
              },
            ].map((stage, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-4">{stage.stage}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Duration</p>
                        <p className="text-sm text-gray-300">{stage.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Operations</p>
                        <p className="text-sm text-gray-300">{stage.operations}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Power Requirement</p>
                        <p className="text-sm text-red-300 font-semibold">{stage.powerNeeds}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">Criticality</p>
                      <p className="text-sm text-gray-300">{stage.criticality}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-2">SOLUTION</p>
                      <p className="text-sm text-gray-300">{stage.solution}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-1">REAL EXAMPLE</p>
                      <p className="text-sm text-gray-300">{stage.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Services */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">O&G-Specific Power Solutions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Equipment & Systems</h3>
              <ul className="space-y-3">
                {[
                  'Generators: 50-5000 kVA (all grades, mobile to industrial)',
                  'Enterprise UPS: zero-transfer, multi-megawatt capacity',
                  'Drilling rig power systems: precision voltage control',
                  'Platform power distribution: redundancy-designed',
                  'Export terminal power: high-capacity, emergency protocols',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-red-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">O&G-Critical Services</h3>
              <ul className="space-y-3">
                {[
                  '99.7% SLA guarantees with financial penalties',
                  '24/7/365 emergency response (dedicated teams)',
                  'Remote site fuel logistics & management',
                  'Satellite monitoring for offshore/remote operations',
                  'Environmental & regulatory compliance documentation',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-red-400 font-bold">✓</span>
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
          <h2 className="text-4xl font-bold mb-6">Power Africa's Oil & Gas Boom</h2>
          <p className="text-lg text-gray-300 mb-10">
            Exploration to production to export — every stage demands power infrastructure that doesn't fail. We deliver 99.7% uptime SLA for Africa's most critical operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20operate%20an%20oil%20%26%20gas%20facility%20and%20need%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-red-500 text-red-400 font-bold rounded-lg hover:bg-red-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Exploration • Development • Production • Export Terminals • Offshore Platforms • All African Countries
          </p>
        </div>
      </section>
    </div>
  );
}
