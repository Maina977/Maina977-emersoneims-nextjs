import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why EmersonEIMS Leads',
  description: 'Honest competitive analysis: Why EmersonEIMS leads the backup power market. Response time, pricing transparency, service breadth, guarantees, and proven outcomes.',
};

export default function CompetitivePositioningPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Why EmersonEIMS Leads</h1>
          <p className="text-xl text-gray-300">
            Honest competitive analysis across response time, pricing, service breadth, guarantees, and verified outcomes.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Competitive Comparison Matrix</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 font-bold text-white">Criteria</th>
                  <th className="text-left p-4 font-bold text-emerald-400">EmersonEIMS</th>
                  <th className="text-left p-4 font-bold text-gray-400">Competitor A</th>
                  <th className="text-left p-4 font-bold text-gray-400">Competitor B</th>
                  <th className="text-left p-4 font-bold text-gray-400">Competitor C</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Urban Response Time</td>
                  <td className="p-4 text-emerald-400">4 hours ✓</td>
                  <td className="p-4 text-gray-400">12-24 hours</td>
                  <td className="p-4 text-gray-400">24-48 hours</td>
                  <td className="p-4 text-gray-400">Next day</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Service Coverage</td>
                  <td className="p-4 text-emerald-400">All 15 services ✓</td>
                  <td className="p-4 text-gray-400">5-7 services</td>
                  <td className="p-4 text-gray-400">3-4 services</td>
                  <td className="p-4 text-gray-400">2-3 services</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Geographic Coverage</td>
                  <td className="p-4 text-emerald-400">47 counties ✓</td>
                  <td className="p-4 text-gray-400">3-5 cities</td>
                  <td className="p-4 text-gray-400">2-3 cities</td>
                  <td className="p-4 text-gray-400">1 city</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Pricing Transparency</td>
                  <td className="p-4 text-emerald-400">Fixed pricing ✓</td>
                  <td className="p-4 text-gray-400">Quote required</td>
                  <td className="p-4 text-gray-400">Hidden fees</td>
                  <td className="p-4 text-gray-400">Vague pricing</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Service Guarantees</td>
                  <td className="p-4 text-emerald-400">Written SLA ✓</td>
                  <td className="p-4 text-gray-400">Verbal promise</td>
                  <td className="p-4 text-gray-400">None stated</td>
                  <td className="p-4 text-gray-400">None stated</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Emergency Capability</td>
                  <td className="p-4 text-emerald-400">24/7 verified ✓</td>
                  <td className="p-4 text-gray-400">Business hours</td>
                  <td className="p-4 text-gray-400">Limited hours</td>
                  <td className="p-4 text-gray-400">Call center only</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Case Studies Available</td>
                  <td className="p-4 text-emerald-400">15+ documented ✓</td>
                  <td className="p-4 text-gray-400">3-5 mentioned</td>
                  <td className="p-4 text-gray-400">1-2 vague</td>
                  <td className="p-4 text-gray-400">None visible</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Customer Retention</td>
                  <td className="p-4 text-emerald-400">5+ year contracts ✓</td>
                  <td className="p-4 text-gray-400">1-2 year typical</td>
                  <td className="p-4 text-gray-400">Project basis</td>
                  <td className="p-4 text-gray-400">Not disclosed</td>
                </tr>
                <tr className="border-b border-slate-900 hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">Team Expertise</td>
                  <td className="p-4 text-emerald-400">Brand specialists ✓</td>
                  <td className="p-4 text-gray-400">Some certified</td>
                  <td className="p-4 text-gray-400">Basic training</td>
                  <td className="p-4 text-gray-400">Not disclosed</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">One-Stop Solution</td>
                  <td className="p-4 text-emerald-400">Yes ✓</td>
                  <td className="p-4 text-gray-400">Partial</td>
                  <td className="p-4 text-gray-400">No</td>
                  <td className="p-4 text-gray-400">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">What Sets EmersonEIMS Apart</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">1. Proven Emergency Response</h3>
              <p className="text-gray-300 mb-4">
                Real-world proven capability: 24/7 response teams nationwide. Verified emergency response across hospitals, manufacturers, and telecom facilities. Seamless installations from remote diagnostics to on-site deployment. Competitors typically take 24+ hours; we're active in 4 hours urban.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> In emergencies, speed is the difference between success and catastrophe. Our 4-hour urban SLA is backed by verified performance across multiple customer scenarios.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">2. All 15 Services Under One Roof</h3>
              <p className="text-gray-300 mb-4">
                Generators, solar, HVAC, electrical, UPS, incinerators, motors, controls, fabrication, load management, water systems, high voltage, ATS, distribution boards, repairs—all from EmersonEIMS.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors specialize in 2-3 services. We handle comprehensive integrated solutions. One contract, one point of contact, consistent quality across all services.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">3. Nationwide Coverage (47 Counties)</h3>
              <p className="text-gray-300 mb-4">
                Urban: 4-7 hour response. Regional: 8-14 hours. Remote: 16-20 hours. Coverage across all 47 Kenyan counties with regional teams, not just Nairobi headquarters.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors serve 2-3 cities. We serve the entire nation. Transparency on response times builds trust in remote areas.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">4. Transparent, Fixed Pricing</h3>
              <p className="text-gray-300 mb-4">
                Every service has published pricing: generators KES 350K-25M, solar KES 120K-15M, UPS KES 8K-5M, etc. No surprise quotes. No hidden markups. Compare apples to apples.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors hide prices behind "request quote" walls. Our transparency eliminates sales friction and builds instant credibility.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">5. Written SLAs, Not Verbal Promises</h3>
              <p className="text-gray-300 mb-4">
                Our maintenance contracts include measurable SLAs: 4-hour emergency response, 99%+ uptime guarantees, automatic compensation for SLA misses. Enforceable commitments.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors say "we'll help you," we say "we guarantee this, or we pay you." Real accountability.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">6. Verified Case Studies, Not Marketing Fluff</h3>
              <p className="text-gray-300 mb-4">
                Hospital blackout prevention (lives saved). Manufacturing downtime elimination. Telecom uptime guarantees. Real projects with named clients, verifiable outcomes, and measurable ROI.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors mention projects vaguely. We document them with timelines, metrics, and customer quotes. Proof beats promises.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">7. Customer Retention Speaks Volumes</h3>
              <p className="text-gray-300 mb-4">
                5-year maintenance contracts from hospitals, manufacturers, and telecom companies. If competitors were better, customers would switch. Long-term contracts prove satisfaction.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Why it matters:</strong> Competitors lose customers annually. We keep them for years. Retention is the ultimate endorsement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Honest Industry Assessment</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Where Competitors Excel</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Some offer specialized expertise in niche areas</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Established local relationships in specific regions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Lower entry prices on individual services</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Familiar to some long-standing customers</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Why EmersonEIMS Still Leads</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-emerald-400">→</span>
                  <span>Our breadth means we solve more problems for each customer</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">→</span>
                  <span>Our nationwide footprint covers them everywhere</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">→</span>
                  <span>Our transparency on pricing builds trust immediately</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">→</span>
                  <span>Our guarantees eliminate procurement risk</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">The Bottom Line</h2>

          <div className="p-12 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 rounded-lg">
            <p className="text-gray-300 text-lg mb-6">
              EmersonEIMS leads because we combine six competitive advantages that competitors individually possess but don't together:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-emerald-400 font-bold mb-2">Speed</p>
                <p className="text-gray-400 text-sm">4-hour emergency response (vs 24-48 hours)</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold mb-2">Breadth</p>
                <p className="text-gray-400 text-sm">15 services (vs 2-3 service competitors)</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold mb-2">Coverage</p>
                <p className="text-gray-400 text-sm">47 counties (vs 2-3 city competitors)</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold mb-2">Transparency</p>
                <p className="text-gray-400 text-sm">Fixed pricing (vs hidden quotes)</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold mb-2">Guarantees</p>
                <p className="text-gray-400 text-sm">Written SLAs (vs verbal promises)</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold mb-2">Proof</p>
                <p className="text-gray-400 text-sm">15+ case studies (vs vague mentions)</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm border-t border-emerald-500/30 pt-6">
              <strong>Result:</strong> Customers choose EmersonEIMS not just for one advantage, but because we eliminate every source of risk and friction. One contract covers 15 services across 47 counties with guaranteed response times and transparent pricing. That integrated, risk-free value proposition is unmatched.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Experience the Difference</h2>
          <p className="text-lg text-gray-300 mb-10">
            See why hospitals, manufacturers, and telecom companies trust EmersonEIMS to lead across all 15 services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/case-studies" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              View Case Studies
            </Link>
            <Link href="/contact?type=competitive-demo" className="inline-block px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
