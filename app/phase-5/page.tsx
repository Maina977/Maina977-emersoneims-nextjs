import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phase 5: Service Market Leadership | EmersonEIMS',
  description: 'Phase 5 expansion: Complete service mastery across 15 core offerings. Industry-specific solutions, advanced case studies, and real-world integration.',
};

export default function Phase5Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Phase 5: Complete Service Mastery</h1>
          <p className="text-xl text-gray-300">
            Establishing market leadership across all 15 core services. Industry-specific solutions, advanced integrations, and competitive differentiation.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">15 Core Services — Market Leadership</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', name: 'Generators', link: '/services/cummins-generators', icon: '⚡' },
              { num: '2', name: 'Solar Energy', link: '/services/solar-energy', icon: '☀️' },
              { num: '3', name: 'Borehole Pumps', link: '/services/borehole-pumps', icon: '💧' },
              { num: '4', name: 'HVAC/AC', link: '/services/ac-installation', icon: '❄️' },
              { num: '5', name: 'Electrical Services', link: '/services/distribution-boards', icon: '🔌' },
              { num: '6', name: 'ATS & Changeover', link: '/services/ats-changeover', icon: '🔄' },
              { num: '7', name: 'UPS Systems', link: '/services/ups-systems', icon: '🔋' },
              { num: '8', name: 'Incinerators', link: '/services/hospital-incinerators', icon: '🔥' },
              { num: '9', name: 'Motor Rewinding', link: '/services/motor-rewinding', icon: '⚙️' },
              { num: '10', name: 'Generator Repairs', link: '/services/generator-repairs', icon: '🔧' },
              { num: '11', name: 'Controls', link: '/solutions/controls', icon: '🎛️' },
              { num: '12', name: 'Fabrication', link: '/solutions/fabrication', icon: '🏭' },
              { num: '13', name: 'Load Management', link: '#load-mgmt', icon: '⚖️' },
              { num: '14', name: 'Water Systems', link: '/services/borehole-pumps', icon: '🚰' },
              { num: '15', name: 'High Voltage', link: '#high-voltage', icon: '⚡⚡' },
            ].map((service) => (
              <Link key={service.num} href={service.link} className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg hover:border-emerald-500/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{service.icon}</div>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">#{service.num}</span>
                </div>
                <h3 className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300">{service.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 5 Strategic Pillars</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">Industry-Specific Solutions</h3>
                  <p className="text-gray-300">Tailored service bundles for healthcare, manufacturing, telecom, agriculture, real estate, and hospitality.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-blue-400 font-bold mb-3">Healthcare Facilities</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Mission-critical backup power</li>
                    <li>• UPS for life-support systems</li>
                    <li>• Incinerator compliance</li>
                    <li>• HVAC for sterile environments</li>
                    <li>• Load management for peak demands</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 font-bold mb-3">Manufacturing Plants</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Industrial backup generators</li>
                    <li>• Motor control solutions</li>
                    <li>• Automated changeover systems</li>
                    <li>• Load optimization</li>
                    <li>• Energy cost reduction</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🎥</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Real-World Video Integration</h3>
                  <p className="text-gray-300">Video walkthroughs of actual installations, real customer scenarios, performance demonstrations, and maintenance procedures.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-cyan-400 font-bold mb-3">Installation Videos</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Generator installation walkthrough</li>
                    <li>• Solar panel mounting</li>
                    <li>• ATS integration procedure</li>
                    <li>• AC system setup</li>
                    <li>• Control panel fabrication</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold mb-3">Performance & Testing</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Load bank testing</li>
                    <li>• System failover demonstration</li>
                    <li>• Fuel efficiency measurement</li>
                    <li>• UPS battery test</li>
                    <li>• Pump performance validation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">📚</div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-3">Advanced Case Studies</h3>
                  <p className="text-gray-300">Deep-dive technical documentation of real projects with ROI analysis, performance metrics, and before/after comparisons.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-purple-400 font-bold mb-3">Case Study Categories</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Emergency power solutions</li>
                    <li>• Cost reduction projects</li>
                    <li>• Hybrid system implementations</li>
                    <li>• Troubleshooting & repairs</li>
                    <li>• System upgrades & modernization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-purple-400 font-bold mb-3">Content Depth</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Project timeline & phases</li>
                    <li>• Technical specifications</li>
                    <li>• Cost-benefit analysis</li>
                    <li>• Performance validation</li>
                    <li>• Customer testimonial</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-3">Competitive Differentiation</h3>
                  <p className="text-gray-300">Service bundles, guaranteed response times, transparent pricing matrices, and performance warranties across all 15 services.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-amber-400 font-bold mb-3">Service Packages</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Complete system solutions</li>
                    <li>• Maintenance contracts (AMC)</li>
                    <li>• Emergency response tiers</li>
                    <li>• Installation + training bundles</li>
                    <li>• Upgrade & expansion packages</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-400 font-bold mb-3">Guarantees & SLAs</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Response time SLAs (4-24hr)</li>
                    <li>• Quality guarantees</li>
                    <li>• Performance warranties</li>
                    <li>• Transparent pricing</li>
                    <li>• No hidden costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Service Leadership Maturity Model</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-3xl">🥇</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Tier 1: Service Completeness</h3>
                  <p className="text-gray-300 text-sm">All 15 services have comprehensive pages with pricing, FAQs, benefits, features, and real customer testimonials.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-3xl">🥈</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Tier 2: Industry Mastery</h3>
                  <p className="text-gray-300 text-sm">Industry-specific solution pages (healthcare, manufacturing, telecom) showing how service combinations address unique challenges.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-3xl">🥉</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Tier 3: Evidence-Based Credibility</h3>
                  <p className="text-gray-300 text-sm">Real case studies with performance data, ROI calculations, video documentation, and verified customer outcomes.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-3xl">👑</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Tier 4: Market Dominance</h3>
                  <p className="text-gray-300 text-sm">Competitive matrix showing how each service outperforms alternatives. Guaranteed response times. Transparent total-cost-of-ownership analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 5 Content Strategy</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">Content Expansion</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Industry-specific solution pages (6 major industries)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Service comparison matrices (vs competitors)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Advanced case studies (20+ verified projects)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Video galleries (installation, testing, maintenance)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>ROI calculators per service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Service bundle packages with pricing</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Market Positioning</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Clear leadership narrative for each service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified customer testimonials across industries</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Response time guarantees (4-24hr tiers)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Transparent pricing & cost breakdown</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Performance warranties & guarantees</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Competitive advantage statements (honest)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Phase 5: Complete Market Leadership</h2>
          <p className="text-lg text-gray-300 mb-10">
            Across all 15 services, Phase 5 establishes EmersonEIMS as the market leader through comprehensive service pages, industry-specific solutions, real case studies, and transparent competitive positioning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/services" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              Browse All Services
            </Link>
            <Link href="/industries" className="inline-block px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              Industry Solutions
            </Link>
            <Link href="/case-studies" className="inline-block px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
