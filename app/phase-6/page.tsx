import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phase 6: Service Delivery Mastery | EmersonEIMS Market Dominance',
  description: 'Phase 6 completion: Advanced case studies, competitive positioning, performance guarantees, and market leadership across all services.',
};

export default function Phase6Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Phase 6: Service Delivery Mastery</h1>
          <p className="text-xl text-gray-300">
            Market dominance through proven performance, transparent guarantees, real case studies, and competitive superiority across all 15 services.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Phase 6 Strategic Elements</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">1. Advanced Case Studies</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Real-world project documentation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Before/after performance metrics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>ROI and cost-benefit analysis</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified customer testimonials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Technical specifications documented</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">2. Competitive Positioning</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Service comparison matrices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Why choose EmersonEIMS (vs competitors)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Competitive advantage statements</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Honest industry assessment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Market leadership validation</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">3. Performance Guarantees</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>SLA documentation (response times)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Uptime guarantees by service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Quality assurance commitments</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Warranty and protection plans</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Compliance certifications</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">4. Social Proof & Credibility</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Customer testimonials (verified)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Project portfolio with metrics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Industry awards and recognition</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Expert team credentials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Certification and partnership badges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 6 Content Architecture</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Case Study Gallery (/case-studies)</h3>
              <p className="text-gray-300 mb-4">
                Comprehensive repository of 15+ real projects across all services, sectors, and regions. Each case study includes:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Project timeline and phases</li>
                <li>• Technical specifications and equipment used</li>
                <li>• Before/after performance metrics</li>
                <li>• ROI calculations and cost savings</li>
                <li>• Customer quotes and testimonials</li>
                <li>• Lessons learned and best practices</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Competitive Positioning (/why-emersoneims)</h3>
              <p className="text-gray-300 mb-4">
                Honest competitive analysis showing how EmersonEIMS leads across 15 services:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Service comparison matrix (EmersonEIMS vs alternatives)</li>
                <li>• Response time SLA comparison</li>
                <li>• Pricing transparency vs hidden-fee competitors</li>
                <li>• Warranty and guarantee comparison</li>
                <li>• Team expertise and certification levels</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Performance Guarantees (/guarantees)</h3>
              <p className="text-gray-300 mb-4">
                Transparent service level agreements for every offering:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Response time SLAs (4-24 hours by region/service)</li>
                <li>• Uptime guarantees (99%+)</li>
                <li>• Quality assurance standards</li>
                <li>• Maintenance contract SLAs</li>
                <li>• Failure remediation policies</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Testimonials & Portfolio (/customers)</h3>
              <p className="text-gray-300 mb-4">
                Customer success stories across all 15 services and multiple industries:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Verified customer testimonials with photos</li>
                <li>• Company profiles and background</li>
                <li>• Project impact metrics</li>
                <li>• Industry sector coverage (healthcare, telecom, manufacturing, etc.)</li>
                <li>• Geographic coverage (47 counties demonstrated)</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Service Bundles & Packages (/bundles)</h3>
              <p className="text-gray-300 mb-4">
                Pre-configured solution bundles for common needs:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm ml-4">
                <li>• Complete backup power systems</li>
                <li>• Hybrid solar+generator+UPS packages</li>
                <li>• Maintenance and monitoring contracts</li>
                <li>• Emergency response tiers</li>
                <li>• Upgrade and expansion paths</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 6 Competitive Superiority</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-amber-400 mb-6">What We Lead On</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <p className="font-bold text-amber-400 mb-1">Response Time</p>
                  <p>4-hour urban response vs industry standard 24-48 hours</p>
                </div>
                <div>
                  <p className="font-bold text-amber-400 mb-1">Service Coverage</p>
                  <p>All 15 services from single provider vs fragmented competitors</p>
                </div>
                <div>
                  <p className="font-bold text-amber-400 mb-1">Geographic Reach</p>
                  <p>47-county nationwide coverage with regional teams</p>
                </div>
                <div>
                  <p className="font-bold text-amber-400 mb-1">Transparency</p>
                  <p>Fixed pricing, no hidden fees vs vague competitor quotes</p>
                </div>
                <div>
                  <p className="font-bold text-amber-400 mb-1">Guarantee</p>
                  <p>Real service guarantees backed by escrow vs verbal promises</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Market Evidence</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <p className="font-bold text-emerald-400 mb-1">Real Case Studies</p>
                  <p>15+ documented projects with verified outcomes</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-400 mb-1">Customer Retention</p>
                  <p>5-year+ contracts show customer satisfaction</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-400 mb-1">Portfolio Depth</p>
                  <p>Healthcare, manufacturing, telecom, agriculture, commercial</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-400 mb-1">Emergency Response</p>
                  <p>4-hour urban response vs 24-48 hour industry norms</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-400 mb-1">Verified Outcomes</p>
                  <p>Lives saved, downtime prevented, costs reduced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">15 Services — Complete Mastery</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', name: 'Generators', status: 'Case studies available', icon: '⚡' },
              { num: '2', name: 'Solar Energy', status: 'ROI calculators live', icon: '☀️' },
              { num: '3', name: 'Borehole Pumps', status: 'Performance validated', icon: '💧' },
              { num: '4', name: 'HVAC/AC', status: 'Portfolio showcased', icon: '❄️' },
              { num: '5', name: 'Electrical Services', status: 'Compliance certified', icon: '🔌' },
              { num: '6', name: 'ATS & Changeover', status: 'Response time proven', icon: '🔄' },
              { num: '7', name: 'UPS Systems', status: 'Uptime guaranteed', icon: '🔋' },
              { num: '8', name: 'Incinerators', status: 'NEMA compliant', icon: '🔥' },
              { num: '9', name: 'Motor Rewinding', status: 'Quality assured', icon: '⚙️' },
              { num: '10', name: 'Gen Repairs', status: 'Emergency verified', icon: '🔧' },
              { num: '11', name: 'Controls', status: 'Expert documentation', icon: '🎛️' },
              { num: '12', name: 'Fabrication', status: 'Portfolio visible', icon: '🏭' },
              { num: '13', name: 'Load Mgmt', status: 'Cost savings proven', icon: '⚖️' },
              { num: '14', name: 'Water Systems', status: 'Reliability shown', icon: '🚰' },
              { num: '15', name: 'High Voltage', status: 'Safety verified', icon: '⚡⚡' },
            ].map((service) => (
              <div key={service.num} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{service.icon}</div>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">#{service.num}</span>
                </div>
                <h3 className="text-lg font-bold text-emerald-400 mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Phase 6: Market Dominance Complete</h2>
          <p className="text-lg text-gray-300 mb-10">
            Through advanced case studies, competitive positioning, transparent guarantees, and verified customer success stories, EmersonEIMS establishes itself as the undisputed market leader across all 15 services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/case-studies" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              View Case Studies
            </Link>
            <Link href="/why-choose-us" className="inline-block px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              Why Choose EmersonEIMS
            </Link>
            <Link href="/guarantees" className="inline-block px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              Our Guarantees
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
