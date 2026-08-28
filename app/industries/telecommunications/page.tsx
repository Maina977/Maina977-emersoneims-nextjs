import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telecom Tower Power Solutions',
  description: '99.7% uptime for mobile network towers across Kenya. Automatic failover generators, battery backup UPS, remote monitoring, SLA guarantees. Prevents millions in network outages.',
  alternates: {
    canonical: 'https://www.emersoneims.com/industries/telecommunications',
  },
};

export default function TelecomIndustriesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Telecom Tower Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              99.7% Network Uptime
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every cell site outage costs Safaricom/Airtel/Jio millions per hour in lost revenue and SLA penalties.
            We keep towers running 24/7 with zero excuses.
          </p>
        </div>
      </section>

      {/* The Stakes */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Tower Uptime Is Everything</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">KES 100K/hour</h3>
              <p className="text-gray-300">
                Revenue loss per tower outage (Safaricom/Airtel rates). A single grid failure can cascade to multiple towers.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">KES 50M+/year</h3>
              <p className="text-gray-300">
                SLA penalties if uptime drops below contracted 99.7% (for 50-tower network). One bad quarter = massive fines.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">99.7%</h3>
              <p className="text-gray-300">
                This is less than 9 hours of downtime per year. Every grid outage, generator failure, or human error counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Cell Site Backup Architecture</h2>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">The Standard: Triple Redundancy</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Each tower has 3 independent power layers. If one fails, the other two keep it running.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  layer: 'Layer 1: Grid Power',
                  status: 'Primary',
                  details: [
                    'Dedicated 3-phase line from power company',
                    'Voltage regulation (±2%)',
                    'Load monitoring & alerts',
                  ],
                },
                {
                  layer: 'Layer 2: Generator Backup',
                  status: 'Secondary (30-50 sec failover)',
                  details: [
                    '30-100 kVA diesel generator',
                    'Automatic Transfer Switch (ATS)',
                    'Fuel tank (48-72hr endurance)',
                  ],
                },
                {
                  layer: 'Layer 3: Battery UPS',
                  status: 'Tertiary (immediate, milliseconds)',
                  details: [
                    '20-30 minute UPS (lithium + lead-acid)',
                    'Bridges gap between grid loss & generator start',
                    'Protects equipment from sudden power loss',
                  ],
                },
              ].map((layer, idx) => (
                <div key={idx} className="p-6 bg-black/50 rounded-lg border border-blue-500/20">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-blue-400 mb-1">{layer.layer}</h4>
                    <p className="text-xs text-gray-400">{layer.status}</p>
                  </div>

                  <ul className="space-y-2">
                    {layer.details.map((detail, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-blue-400">✓</span> {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">The Math: Tower Uptime Pays for Itself</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">For a 50-Tower Network</h3>

              <div className="space-y-6">
                <div className="bg-black/40 p-4 rounded">
                  <p className="text-xs text-gray-400 font-bold mb-1">Annual Investment</p>
                  <p className="text-2xl font-bold text-blue-400">KES 25M</p>
                  <p className="text-xs text-gray-400 mt-2">(50 towers × KES 500K average)</p>
                </div>

                <div className="bg-black/40 p-4 rounded">
                  <p className="text-xs text-gray-400 font-bold mb-1">Cost of 1 Tower Outage (1 hour)</p>
                  <p className="text-2xl font-bold text-red-400">KES 100K</p>
                  <p className="text-xs text-gray-400 mt-2">+ SLA penalties + reputation damage</p>
                </div>

                <div className="bg-black/40 p-4 rounded">
                  <p className="text-xs text-gray-400 font-bold mb-1">Break-Even Point</p>
                  <p className="text-2xl font-bold text-yellow-400">250 Hours Prevented</p>
                  <p className="text-xs text-gray-400 mt-2">= ~10 major outages = ~3-4 months ROI</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-6">Safaricom Kenya Case Study</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-2">BEFORE</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Reactive maintenance (no preventive plan)</li>
                    <li className="text-sm text-gray-300">• Uptime: 98.3% (failed SLA 8 times/year)</li>
                    <li className="text-sm text-gray-300">• Outage cost: KES 15M/year penalties</li>
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs text-gray-400 font-bold mb-2">AFTER</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-green-300">✓ Preventive maintenance SLA</li>
                    <li className="text-sm text-green-300">✓ Uptime: 99.8% (passed all SLA reviews)</li>
                    <li className="text-sm text-green-300">✓ Saved: KES 15M penalties + KES 8M reputation value</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-3 rounded border border-green-500/30">
                  <p className="text-xs text-green-400 font-bold">Net Annual Benefit</p>
                  <p className="text-xl font-bold text-green-400">KES 23M ROI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">EmersonEIMS Telecom Services</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                service: 'Towers: 0-50 (Small Regional Network)',
                features: [
                  '30-50 kVA generator per site',
                  'ATS + UPS configuration',
                  'Monthly preventive maintenance visits',
                  'Fuel supply management',
                  '4-hour emergency response',
                ],
                investment: 'KES 15M-25M',
                timeline: '3-4 weeks full rollout',
              },
              {
                service: 'Towers: 50-200 (Mid-Tier Operator)',
                features: [
                  '100-200 kVA generators per critical site',
                  'Redundant ATS + dual UPS',
                  'Bi-weekly preventive maintenance',
                  'Automated fuel delivery schedule',
                  '2-hour emergency response',
                ],
                investment: 'KES 40M-80M',
                timeline: '6-8 weeks full rollout',
              },
              {
                service: 'Towers: 200+ (National Operator)',
                features: [
                  'Scalable 100-300 kVA per site',
                  'Tri-redundant backup system',
                  'Weekly preventive maintenance',
                  'Real-time remote monitoring dashboard',
                  '1-hour emergency response nationwide',
                ],
                investment: 'KES 100M+ (scalable)',
                timeline: 'Phased 3-month rollout',
              },
              {
                service: 'Remote Monitoring & Analytics',
                features: [
                  'Real-time fuel level & temperature',
                  'Generator runtime & load analytics',
                  'Grid power quality metrics',
                  'UPS battery health monitoring',
                  'Predictive failure alerts',
                ],
                investment: 'KES 500K-2M setup + monthly fees',
                timeline: 'Instant deployment',
              },
            ].map((service, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
                <h3 className="text-xl font-bold text-blue-400 mb-6">{service.service}</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2">KEY FEATURES</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-blue-400">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">Investment</p>
                      <p className="text-lg font-bold text-blue-400">{service.investment}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 font-bold mb-1">Timeline</p>
                      <p className="text-sm text-gray-300">{service.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Guarantee Your Network Uptime</h2>
          <p className="text-lg text-gray-300 mb-10">
            Every hour of tower downtime costs millions. Let's build a backup strategy that keeps your network running. No compromises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=telecom"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Get Network Audit
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all"
            >
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
