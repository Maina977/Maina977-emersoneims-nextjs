import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrastructure Power Solutions | Construction • Dams • Ports • Telecom | 24/7 Support | EmersonEIMS Africa',
  description: 'Construction site generators, infrastructure project power systems. Roads, dams, ports, airports, railways, telecom towers. Temporary to permanent solutions. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/infrastructure',
  },
};

export default function InfrastructurePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Infrastructure Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              From Construction to Operation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Africa's infrastructure boom demands power solutions at every stage: from construction cranes to operational facilities. Roads, dams, ports, airports, railways, telecom towers — every megaproject depends on reliable power.
          </p>
        </div>
      </section>

      {/* The Boom */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Infrastructure Investment Wave</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg">
              <div className="text-4xl font-bold text-indigo-400 mb-2">KES 1T+</div>
              <p className="text-sm text-gray-300 mb-4">Annual government infrastructure investment</p>
              <p className="text-xs text-gray-400">Roads, water, energy, telecom across Africa</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg">
              <div className="text-4xl font-bold text-indigo-400 mb-2">100+</div>
              <p className="text-sm text-gray-300 mb-4">Major projects underway continent-wide</p>
              <p className="text-xs text-gray-400">Chinese belt-and-road, bilateral development, local</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg">
              <div className="text-4xl font-bold text-indigo-400 mb-2">KES 200M-2B</div>
              <p className="text-sm text-gray-300 mb-4">Power system per megaproject</p>
              <p className="text-xs text-gray-400">From temporary construction to permanent operations</p>
            </div>
          </div>

          <p className="text-center text-gray-300 text-lg">
            Every infrastructure project has 2 power phases: temporary (construction) and permanent (operations). We handle both.
          </p>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Infrastructure Projects Across Africa</h2>

          <div className="space-y-8">
            {[
              {
                project: 'Roads & Highways',
                examples: 'Lane expansion, bridge construction, toll infrastructure',
                locations: 'Pan-Africa (Chinese-funded, bilateral, local)',
                phases: {
                  construction: '50-200 kVA (temporary, 2-4 years)',
                  operation: '20-100 kVA (permanent toll/traffic systems)',
                },
                challenge: 'Construction sites need mobile power, toll plazas need 99.9% uptime',
                solution: 'Mobile generators for construction phase, permanent UPS+generator for operations',
                roi: '2-3 month ROI via project acceleration in construction phase',
              },
              {
                project: 'Hydroelectric Dams',
                examples: 'Mega-dam projects (Grand Renaissance, Kariba expansion)',
                locations: 'Ethiopia, Zimbabwe, Congo, Kenya, Tanzania',
                phases: {
                  construction: '500-1000 kVA (5-7 year construction)',
                  operation: '100-500 kVA (permanent facility operations)',
                },
                challenge: 'Remote locations, massive equipment, construction timeline pressure',
                solution: 'Multi-site generator network, remote monitoring, fuel logistics',
                roi: 'Project acceleration worth KES 100B+ per week saved',
              },
              {
                project: 'Ports & Harbors',
                examples: 'Port facility expansion, container terminal automation',
                locations: 'Djibouti, Mombasa, Dar es Salaam, Lagos, Port Louis',
                phases: {
                  construction: '200-500 kVA (3-4 year construction)',
                  operation: '500-1000 kVA (continuous cargo handling)',
                },
                challenge: 'Maritime operations require 99.9% uptime, shipping schedules unforgiving',
                solution: 'Enterprise backup power + automation systems + emergency protocols',
                roi: 'Each prevented 1-day port closure = KES 500M+ cargo value protected',
              },
              {
                project: 'Airports & Air Transport',
                examples: 'Terminal expansion, runway extension, aviation infrastructure',
                locations: 'Major African hubs (Addis Ababa, Cairo, Lagos, Johannesburg)',
                phases: {
                  construction: '200-500 kVA (2-3 year construction)',
                  operation: '1000-2000 kVA (24/7 operations)',
                },
                challenge: 'Aviation safety critical, zero tolerance for power interruptions',
                solution: 'Tri-redundant systems, UPS for all safety-critical equipment',
                roi: 'Flight safety guarantee enables premium rates on operations',
              },
              {
                project: 'Railways & Transit',
                examples: 'Rail line construction, station infrastructure, signal systems',
                locations: 'Standard Gauge Railway networks (Kenya, Uganda, Tanzania)',
                phases: {
                  construction: '100-300 kVA (4-5 year construction)',
                  operation: '200-500 kVA (operations centers, stations)',
                },
                challenge: 'Railway operations sensitive to power fluctuations, safety-critical',
                solution: 'Signaling system UPS + generator + automated failover',
                roi: 'Railway operating safety + schedule reliability = premium positioning',
              },
              {
                project: 'Telecom Tower Networks',
                examples: '5G rollout, tower densification, backhaul infrastructure',
                locations: 'Nationwide (every country)',
                phases: {
                  construction: '20-50 kVA per site (tower construction)',
                  operation: '30-100 kVA per site (24/7 tower operation)',
                },
                challenge: 'Rapid deployment, 99.7% uptime requirement, scale',
                solution: 'Standardized generator kits, bulk deployment, centralized monitoring',
                roi: '99.7% uptime enables premium premium pricing for operators',
              },
            ].map((proj, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-indigo-500/20 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">{proj.project}</h3>
                  <p className="text-sm text-gray-300">{proj.examples}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">Locations</p>
                      <p className="text-sm text-gray-300">{proj.locations}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-2">Power Phases</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300"><span className="text-indigo-400 font-bold">Construction:</span> {proj.phases.construction}</p>
                        <p className="text-gray-300"><span className="text-indigo-400 font-bold">Operation:</span> {proj.phases.operation}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">Challenge</p>
                      <p className="text-sm text-gray-300">{proj.challenge}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-2">SOLUTION</p>
                      <p className="text-sm text-gray-300">{proj.solution}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                      <p className="text-xs text-green-400 font-bold mb-1">ROI</p>
                      <p className="text-sm text-green-300">{proj.roi}</p>
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
          <h2 className="text-4xl font-bold mb-12 text-center">Megaproject Examples</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Standard Gauge Railway Construction (Kenya)',
                location: 'Mombasa to Nairobi to Uganda',
                issue: 'Construction sites across 480km requiring coordinated mobile power',
                solution: '10-site generator network + fuel logistics + remote monitoring + 24/7 support',
                result: 'Project completed on schedule, zero construction delays due to power',
                investment: 'KES 85M',
              },
              {
                title: 'Port Authority Expansion (Djibouti)',
                location: 'Djibouti Port (critical Middle East trade hub)',
                issue: 'Port operations requiring 99.9% uptime, expansion happening simultaneously',
                solution: 'Dual 1000 kVA systems for operations + temporary generators for construction',
                result: '99.95% uptime maintained during 3-year expansion, KES 1B+ cargo protected annually',
                investment: 'KES 120M',
              },
              {
                title: 'Airport Terminal Renovation (Lagos)',
                location: 'Murtala Muhammed International Airport',
                issue: 'Airport cannot shut down during terminal renovation, 99.99% uptime required',
                solution: 'Parallel temporary power infrastructure during construction + permanent system installation',
                result: 'Zero airport downtime during 2-year renovation, 1M+ passengers seamlessly served',
                investment: 'KES 150M',
              },
              {
                title: '5G Tower Rollout (Nationwide Tanzania)',
                location: 'Dar es Salaam to nationwide coverage',
                issue: 'Rapid deployment of 500+ towers requiring consistent 30-50 kVA power per site',
                solution: 'Standardized 50 kVA generator kits + rapid deployment model + centralized monitoring',
                result: '5G network launched 3 months ahead of schedule, 99.7% tower uptime maintained',
                investment: 'KES 250M (500 sites × KES 500K)',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-indigo-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-indigo-400 mb-2">{study.title}</h3>
                <p className="text-xs text-gray-400 mb-4">📍 {study.location}</p>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">CHALLENGE</p>
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

                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-gray-400 font-bold">Investment</p>
                    <p className="text-lg font-bold text-indigo-400">{study.investment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Africa's Infrastructure Boom</h2>
          <p className="text-lg text-gray-300 mb-10">
            From construction site to operational facility — every infrastructure project needs reliable power at every stage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20work%20on%20an%20infrastructure%20project%20and%20need%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-indigo-500 text-indigo-400 font-bold rounded-lg hover:bg-indigo-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Construction • Dams • Ports • Airports • Railways • Telecom Networks • All Megaprojects
          </p>
        </div>
      </section>
    </main>
  );
}
