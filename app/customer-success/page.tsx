import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Success Stories | Verified Outcomes',
  description: 'Real customer success stories across healthcare, manufacturing, telecom, agriculture. Verified outcomes, ROI metrics, and transformation stories.',
};

export default function CustomerSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
            <div className="p-8 bg-gradient-to-br from-orange-800/20 to-slate-900/50 border border-orange-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🌻</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Bigot Flowers: Export Quality Cold Chain</h3>
                  <p className="text-gray-300 mb-4">
                    Premium flower export operation in Naivasha requiring zero downtime for temperature-sensitive products. 300kVA CAT + 100kVA redundancy system installed. Achieved zero product loss due to power failures. Export-grade reliability maintained 24/7.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-orange-500 font-bold">Zero</p>
                      <p className="text-gray-400">Product Loss</p>
                    </div>
                    <div>
                      <p className="text-orange-500 font-bold">99.9%</p>
                      <p className="text-gray-400">Uptime</p>
                    </div>
                    <div>
                      <p className="text-orange-500 font-bold">24/7</p>
                      <p className="text-gray-400">Continuous Operation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-800/20 to-slate-900/50 border border-blue-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏛️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">NTSA Headquarters: Government Operations Continuity</h3>
                  <p className="text-gray-300 mb-4">
                    National Transport and Safety Authority headquarters requiring uninterrupted government service delivery. 300kVA Atlas Copco system installed with real-time monitoring. Ensured 100% continuity through grid failures. Critical infrastructure reliability.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-blue-500 font-bold">100%</p>
                      <p className="text-gray-400">Continuity</p>
                    </div>
                    <div>
                      <p className="text-blue-500 font-bold">24/7</p>
                      <p className="text-gray-400">Monitoring</p>
                    </div>
                    <div>
                      <p className="text-blue-500 font-bold">Real-time</p>
                      <p className="text-gray-400">Alerts Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-800/20 to-slate-900/50 border border-green-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏗️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Greenheart Kilifi: Real Estate Development Power</h3>
                  <p className="text-gray-300 mb-4">
                    Coastal real estate development project in Kilifi requiring reliable power across multiple unit phases. 44kVA Cummins Voltka system installed. Eliminated power outages during construction and resident operations. Property value enhanced through power reliability.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-green-500 font-bold">30%</p>
                      <p className="text-gray-400">Maintenance Savings</p>
                    </div>
                    <div>
                      <p className="text-green-500 font-bold">Coastal</p>
                      <p className="text-gray-400">Kilifi Location</p>
                    </div>
                    <div>
                      <p className="text-green-500 font-bold">Multi-unit</p>
                      <p className="text-gray-400">Coverage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-800/20 to-slate-900/50 border border-purple-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🏭</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Sanergy Limited: Industrial Operations Excellence</h3>
                  <p className="text-gray-300 mb-4">
                    Manufacturing and waste management operations requiring continuous power for critical processes. FG Wilson generator system deployed. Achieved 95% reduction in downtime. Annual operational savings of KES 1.8M through uninterrupted production.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-purple-500 font-bold">95%</p>
                      <p className="text-gray-400">Downtime Reduction</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-bold">KES 1.8M</p>
                      <p className="text-gray-400">Annual Savings</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-bold">24/7</p>
                      <p className="text-gray-400">Operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-800/20 to-slate-900/50 border border-cyan-500/30 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-5xl">🎓</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Kivukoni International School: Campus Power Security</h3>
                  <p className="text-gray-300 mb-4">
                    Coastal educational institution in Kilifi requiring reliable power for daily operations and staff/student services. 60kVA Cummins generator with hybrid solar integration installed. Achieved 40% energy cost reduction while ensuring 24/7 campus availability.
                  </p>
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-cyan-500 font-bold">40%</p>
                      <p className="text-gray-400">Energy Cost Reduction</p>
                    </div>
                    <div>
                      <p className="text-cyan-500 font-bold">Hybrid</p>
                      <p className="text-gray-400">Solar + Generator</p>
                    </div>
                    <div>
                      <p className="text-cyan-500 font-bold">24/7</p>
                      <p className="text-gray-400">Campus Operations</p>
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
              { title: 'Proven Emergency Response', desc: '24/7 emergency response with documented success across hospitals, manufacturers, and telecom facilities nationwide.' },
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
    </div>
  );
}
