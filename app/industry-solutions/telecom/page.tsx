import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/industry-solutions/telecom' },
  title: 'Telecom Power Solutions',
  description: 'Backup power for telecom towers, data centers, and network facilities. Guaranteed uptime, redundant systems, 24/7 monitoring.',
};

export default function TelecomSolutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Telecom Network Power Solutions</h1>
          <p className="text-xl text-gray-300">Mission-critical backup power for towers, switching centers, and data facilities. 99.9% uptime guarantee. Nationwide coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why Telecom Networks Need Backup Power</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-red-800/20 to-slate-900/50 border border-red-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-6">Network Downtime Consequences</h3>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-2xl">📡</span>
                  <span><strong>Service Interruption:</strong> Thousands of users lose connectivity. Revenue loss and customer churn.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">💼</span>
                  <span><strong>Business Impact:</strong> Corporate clients, banks, and enterprises dependent on mobile connectivity.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span><strong>Emergency Disruption:</strong> 999/police/hospital services affected by tower downtime.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">📊</span>
                  <span><strong>Regulatory Penalties:</strong> Telecom Authority fines for SLA violations.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-800/20 to-slate-900/50 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-6">EmersonEIMS Solution</h3>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-2xl">🔋</span>
                  <span><strong>Battery Systems:</strong> Immediate power backup for critical telecom equipment. 30-120 minute runtime.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">⚡</span>
                  <span><strong>Backup Generators:</strong> Continuous power for extended outages. Fuel delivery to remote towers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">📡</span>
                  <span><strong>Redundant Systems:</strong> Multiple generators, batteries, and power paths for true redundancy.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">🔍</span>
                  <span><strong>24/7 Monitoring:</strong> Real-time alerts on power system status. Predictive maintenance prevents failures.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Telecom Power Solutions by Facility Type</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">📡</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">Mobile Tower Sites</h3>
                  <p className="text-gray-300 text-sm">Remote and urban tower sites requiring automatic failover backup.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm ml-16">
                <li>✓ Battery bank for immediate backup (30-120 min runtime)</li>
                <li>✓ Automatic Transfer Switch for seamless failover</li>
                <li>✓ Diesel generator for extended outages</li>
                <li>✓ Remote monitoring via SMS/email alerts</li>
                <li><strong>Typical Cost:</strong> KES 800K - 2M per tower</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">🏢</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">Switching Centers & Exchanges</h3>
                  <p className="text-gray-300 text-sm">Central equipment hubs requiring 99.99% uptime with redundant power.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm ml-16">
                <li>✓ Dual backup generators with automatic load balancing</li>
                <li>✓ UPS systems for equipment protection (30-100kVA)</li>
                <li>✓ Distribution boards with redundant circuits</li>
                <li>✓ Real-time monitoring and predictive maintenance</li>
                <li><strong>Typical Cost:</strong> KES 5M - 15M per facility</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">🖥️</div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400">Data Centers</h3>
                  <p className="text-gray-300 text-sm">Enterprise data facilities requiring N+1 redundancy and environmental control.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm ml-16">
                <li>✓ Multiple generators with automatic failover</li>
                <li>✓ Module UPS systems (500kVA-5MW)</li>
                <li>✓ Emergency lighting and environmental control backup</li>
                <li>✓ Fuel supply contracts for continuous operation</li>
                <li><strong>Typical Cost:</strong> KES 10M - 50M+ for complete facility</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">📞</div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400">Call Centers</h3>
                  <p className="text-gray-300 text-sm">Customer service facilities needing continuous power for operations.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm ml-16">
                <li>✓ Backup power for servers and workstations</li>
                <li>✓ UPS systems protecting phone systems</li>
                <li>✓ Emergency lighting for safe evacuation</li>
                <li>✓ Generator backup for extended outages</li>
                <li><strong>Typical Cost:</strong> KES 2M - 5M per facility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Nationwide Coverage Network</h2>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg p-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-8">EmersonEIMS Network Capabilities</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-cyan-400 font-bold mb-4">Coverage</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ 47 county coverage across Kenya</li>
                  <li>✓ 4-7 hour urban response time</li>
                  <li>✓ 8-14 hour regional response time</li>
                  <li>✓ 16-20 hour remote response time</li>
                  <li>✓ Fuel supply coordination nationwide</li>
                </ul>
              </div>

              <div>
                <h4 className="text-cyan-400 font-bold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ 24/7 emergency response</li>
                  <li>✓ Preventive maintenance programs</li>
                  <li>✓ Equipment supply and upgrades</li>
                  <li>✓ Performance monitoring</li>
                  <li>✓ SLA enforcement with guaranteed uptime</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-400 font-bold mb-2">Telecom Industry Partnership</p>
              <p className="text-gray-300 text-sm">We understand SLA requirements and regulatory compliance. Our solutions are designed specifically for telecom industry needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why EmersonEIMS for Telecom</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">Telecom Expertise</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>10+ years of telecom infrastructure power</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Understanding of network uptime requirements</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>SLA compliance and documentation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Regulatory reporting and compliance</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Network Reliability</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>24/7/365 monitoring and support</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Predictive maintenance prevents outages</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Redundant backup systems</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>99.9%+ uptime guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Guarantee Your Network Uptime</h2>
          <p className="text-lg text-gray-300 mb-10">
            Network downtime costs businesses and damages your reputation. Our telecom solutions ensure your network stays up when customers depend on it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <a href="/contact?type=telecom-solution" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Free Network Audit
            </a>
            <a href="tel:+254768860665" className="inline-block px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all">
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
