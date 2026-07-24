import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Success Stories | Verified Outcomes | EmersonEIMS',
  description: 'Real customer success stories across healthcare, manufacturing, telecom, agriculture. Verified outcomes, ROI metrics, and transformation stories.',
};

export default function CustomerSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Customer Success Stories</h1>
          <p className="text-xl text-gray-300">
            Real outcomes from real customers. Verified results across all 15 services and 47 counties. See how EmersonEIMS leads the market through proven customer success.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Featured Customer Success Stories</h2>

          <div className="space-y-8">
            <Link href="/case-studies/hospital-blackout" className="block p-8 bg-gradient-to-br from-red-800/20 to-slate-900/50 border border-red-500/30 rounded-lg hover:border-red-500/60 transition-all">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏥</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-400 mb-2">Kivukoni Hospital: Emergency Response Excellence</h3>
                  <p className="text-gray-300 mb-4">
                    Generator failure during surgery. 47 patients on life support. Emergency response in 5 minutes, installation in 51 minutes. All patients safe. 5-year maintenance contract signed.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-red-500 font-bold">47</p>
                      <p className="text-gray-400">Lives Protected</p>
                    </div>
                    <div>
                      <p className="text-red-500 font-bold">51 min</p>
                      <p className="text-gray-400">Installation Time</p>
                    </div>
                    <div>
                      <p className="text-red-500 font-bold">KES 2.4M</p>
                      <p className="text-gray-400">5-Year Contract</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-8 bg-gradient-to-br from-orange-800/20 to-slate-900/50 border border-orange-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏭</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Major Manufacturing Plant: Production Continuity</h3>
                  <p className="text-gray-300 mb-4">
                    Textile factory eliminating production losses from power outages. Integrated generator + load management system installed. 30% reduction in electricity costs through peak shaving. Zero unplanned downtime for 18 months.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-orange-500 font-bold">Zero</p>
                      <p className="text-gray-400">Production Stops (18mo)</p>
                    </div>
                    <div>
                      <p className="text-orange-500 font-bold">30%</p>
                      <p className="text-gray-400">Cost Reduction</p>
                    </div>
                    <div>
                      <p className="text-orange-500 font-bold">KES 8M</p>
                      <p className="text-gray-400">Annual Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-800/20 to-slate-900/50 border border-blue-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">📡</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Telecom Switching Center: Network Reliability</h3>
                  <p className="text-gray-300 mb-4">
                    Regional switching center requiring 99.9%+ uptime SLA. Dual generators + UPS systems + real-time monitoring installed. Achieved 99.97% uptime. 24/7 emergency response validated three times in emergency scenarios.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-blue-500 font-bold">99.97%</p>
                      <p className="text-gray-400">Uptime Achieved</p>
                    </div>
                    <div>
                      <p className="text-blue-500 font-bold">24/7</p>
                      <p className="text-gray-400">Emergency Response</p>
                    </div>
                    <div>
                      <p className="text-blue-500 font-bold">3</p>
                      <p className="text-gray-400">Emergency Tests Passed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-800/20 to-slate-900/50 border border-green-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🌾</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Agricultural Cooperative: Solar Water Supply</h3>
                  <p className="text-gray-300 mb-4">
                    Rural cooperative serving 500+ farmers. Solar borehole pump system installed with battery backup. Zero electricity costs. Reliable water supply year-round. System paid for itself in 3 years. Members added 40 more pumps.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-green-500 font-bold">500+</p>
                      <p className="text-gray-400">Farmers Served</p>
                    </div>
                    <div>
                      <p className="text-green-500 font-bold">0</p>
                      <p className="text-gray-400">Electricity Cost</p>
                    </div>
                    <div>
                      <p className="text-green-500 font-bold">40</p>
                      <p className="text-gray-400">Additional Pumps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-800/20 to-slate-900/50 border border-purple-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏢</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Commercial Real Estate: Tenant Power Reliability</h3>
                  <p className="text-gray-300 mb-4">
                    15-story commercial office building. Generator + UPS + ATS system installed. Ensures tenant operations continue during grid outages. Property value increased 8% due to power reliability guarantee. Highest occupancy rate in metro area.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-purple-500 font-bold">8%</p>
                      <p className="text-gray-400">Value Increase</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-bold">98%</p>
                      <p className="text-gray-400">Occupancy Rate</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-bold">99.9%</p>
                      <p className="text-gray-400">Uptime SLA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-800/20 to-slate-900/50 border border-cyan-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏨</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Hospitality Chain: Guest Experience Protection</h3>
                  <p className="text-gray-300 mb-4">
                    Hotel chain across 5 locations. Generators + load management for critical systems (AC, lighting, security, WiFi). Zero guest interruptions in 2 years despite 12 power outages in region. Guest satisfaction scores highest in chain.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-cyan-500 font-bold">12</p>
                      <p className="text-gray-400">Outages Handled</p>
                    </div>
                    <div>
                      <p className="text-cyan-500 font-bold">0</p>
                      <p className="text-gray-400">Guest Complaints</p>
                    </div>
                    <div>
                      <p className="text-cyan-500 font-bold">5</p>
                      <p className="text-gray-400">Locations Covered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">By the Numbers: Real Impact Across Services</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">47</h3>
              <p className="text-gray-300 mb-4"><strong>Counties Served</strong></p>
              <p className="text-gray-400 text-sm">Nationwide coverage means customers in every region get the same quality service and response time standards.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">15</h3>
              <p className="text-gray-300 mb-4"><strong>Services Integrated</strong></p>
              <p className="text-gray-400 text-sm">All backup power solutions under one roof means customers get comprehensive solutions, not fragmented services from multiple vendors.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">99.9%</h3>
              <p className="text-gray-300 mb-4"><strong>Average Uptime</strong></p>
              <p className="text-gray-400 text-sm">Verified performance across customer base. Real SLAs backed by real results, not marketing promises.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">4-24h</h3>
              <p className="text-gray-300 mb-4"><strong>Response Time SLA</strong></p>
              <p className="text-gray-400 text-sm">Guaranteed response based on region and service type. Emergency response proven in real scenarios.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">30%+</h3>
              <p className="text-gray-300 mb-4"><strong>Average Cost Reduction</strong></p>
              <p className="text-gray-400 text-sm">Through load management, solar integration, and efficiency optimization. Real savings measured across customer base.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-5xl font-bold text-emerald-400 mb-3">5+yr</h3>
              <p className="text-gray-300 mb-4"><strong>Average Contract Length</strong></p>
              <p className="text-gray-400 text-sm">Customer retention speaks louder than marketing. Long-term contracts prove satisfaction and value delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why Customers Choose EmersonEIMS</h2>

          <div className="space-y-6">
            {[
              { title: 'Proven Emergency Response', desc: '51-minute emergency installation. 5-minute response time validated in critical scenarios.' },
              { title: 'Comprehensive Solutions', desc: '15 services mean no coordination needed across multiple vendors. One contract, unified quality.' },
              { title: 'Transparent Pricing', desc: 'Fixed pricing per service. No surprise quotes. No hidden fees. Customers know costs upfront.' },
              { title: 'Written Guarantees', desc: 'SLA-based commitments with measurable SLOs. Automatic compensation if we miss targets.' },
              { title: 'Long-Term Partnership', desc: '5+ year contracts show mutual commitment. Customers become partners, not transactions.' },
              { title: 'Real Performance Data', desc: 'Verified metrics: response times, uptime, cost savings. Not estimates—actual field results.' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg flex gap-4">
                <div className="text-3xl flex-shrink-0">{idx + 1}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing List of Satisfied Customers</h2>
          <p className="text-lg text-gray-300 mb-10">
            From hospitals saving lives to manufacturers eliminating downtime to communities gaining reliable power. See how EmersonEIMS delivers real results across all 15 services and 47 counties.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/case-studies" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              Read All Case Studies
            </Link>
            <Link href="/contact?type=customer-story" className="inline-block px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              Share Your Story
            </Link>
            <Link href="/competitive-positioning" className="inline-block px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              Why We Lead
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
