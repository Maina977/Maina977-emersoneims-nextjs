import Link from 'next/link';
import { Metadata } from 'next';

// Internal roadmap document, not a customer-facing page. It states business
// strategy and positioning in plain terms, which is not something to publish to
// competitors or to rank for. It was already absent from the sitemap; this makes
// that explicit rather than incidental. The page stays reachable by URL for
// internal use.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Phase 4: Market Leader Transformation',
  description: 'Phase 4 infrastructure: YouTube channel, podcast series, partner marketplace, certification program, mobile strategy. Building Africa\'s leading backup power ecosystem.',
};

export default function Phase4Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Phase 4: Market Leader Transformation</h1>
          <p className="text-xl text-gray-300">
            Building Africa's leading backup power and engineering ecosystem. New infrastructure for education, partnership, certification, and customer engagement.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Five Pillars of Phase 4</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/videos/youtube-episodes" className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg hover:border-cyan-500/50 transition-all">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 group-hover:text-cyan-300">YouTube Channel</h3>
              <p className="text-gray-300 text-sm mb-4">Technical deep dives on backup power systems. Real installations, honest solutions.</p>
              <p className="text-xs text-gray-500">2+ episodes live</p>
            </Link>

            <Link href="/podcasts/episodes" className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">🎙️</div>
              <h3 className="text-lg font-bold text-purple-400 mb-3 group-hover:text-purple-300">Podcast Series</h3>
              <p className="text-gray-300 text-sm mb-4">Weekly conversations with industry operators. Real challenges, verified solutions.</p>
              <p className="text-xs text-gray-500">Available now</p>
            </Link>

            <Link href="/marketplace" className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg hover:border-emerald-500/50 transition-all">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-3 group-hover:text-emerald-300">Marketplace</h3>
              <p className="text-gray-300 text-sm mb-4">50+ vetted partners. 10% transparent fee. Money-back guarantee.</p>
              <p className="text-xs text-gray-500">3 featured partners</p>
            </Link>

            <Link href="/certification" className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg hover:border-amber-500/50 transition-all">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-amber-400 mb-3 group-hover:text-amber-300">Certification</h3>
              <p className="text-gray-300 text-sm mb-4">3-tier professional training. Technician, Engineer, Master programs.</p>
              <p className="text-xs text-gray-500">750+ alumni</p>
            </Link>

            <Link href="/mobile-strategy" className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg hover:border-blue-500/50 transition-all">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-lg font-bold text-blue-400 mb-3 group-hover:text-blue-300">Mobile Strategy</h3>
              <p className="text-gray-300 text-sm mb-4">Native apps for field operations. Real-time monitoring and dispatch.</p>
              <p className="text-xs text-gray-500">In development</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 4 Capabilities Overview</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">📺</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">YouTube Educational Channel</h3>
                  <p className="text-gray-300">Technical education platform featuring real installations and field trials.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-cyan-400 font-bold mb-3">Featured Episodes</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Solutions: Complete Power Integration</li>
                    <li>• Field Trials & Performance Testing (Kadence)</li>
                    <li>• Backup Power Design Methodology</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold mb-3">Content Focus</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Real installations, no staged scenarios</li>
                    <li>• Hands-on demonstrations</li>
                    <li>• Performance data & verification</li>
                    <li>• Maintenance best practices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🎙️</div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-3">Power Infrastructure Podcast</h3>
                  <p className="text-gray-300">Weekly conversations with facility managers, engineers, and operators on real power challenges.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-purple-400 font-bold mb-3">Episode Topics</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Healthcare Facility Backup Power</li>
                    <li>• Manufacturing Power Strategy</li>
                    <li>• Solar Integration & ROI</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-purple-400 font-bold mb-3">Guest Profile</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Real operators (not consultants)</li>
                    <li>• Verified customer experiences</li>
                    <li>• Honest cost & performance data</li>
                    <li>• No marketing scripts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🤝</div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-3">Verified Partner Marketplace</h3>
                  <p className="text-gray-300">50+ vetted providers with 6-step verification, customer protections, and transparent pricing.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-emerald-400 font-bold mb-3">Featured Partners</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• PowerTech Solutions (Gold) — Mining specialist</li>
                    <li>• Reliable Energy Systems (Silver) — Healthcare/utilities</li>
                    <li>• East Africa Industrial (Silver) — Manufacturing/O&G</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-bold mb-3">Customer Guarantees</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 10% transparent marketplace fee</li>
                    <li>• Quality guarantee (we fix if they don't)</li>
                    <li>• Money-back guarantee</li>
                    <li>• SLA enforcement with auto-credits</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-3">Professional Certification Program</h3>
                  <p className="text-gray-300">3-tier training with 750+ graduates. Real equipment, real skills, career advancement.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-amber-400 font-bold mb-3">Certification Tiers</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Technician (3 days, KES 25K)</li>
                    <li>• Engineer (5 days, KES 50K)</li>
                    <li>• Master (7 days + 3mo, KES 100K)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-400 font-bold mb-3">Graduate Outcomes</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 95%+ employment within 3-6 months</li>
                    <li>• +30-80% salary improvement</li>
                    <li>• 3-hub network (Kenya, Tanzania, Rwanda)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">📱</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">Mobile-First Operations</h3>
                  <p className="text-gray-300">Native apps for field technicians. Real-time dispatch and customer monitoring across 47 counties.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div>
                  <h4 className="text-blue-400 font-bold mb-3">Apps in Development</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Technician Mobile App (iOS/Android)</li>
                    <li>• Operations Center Dashboard</li>
                    <li>• Customer Monitoring Portal</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 font-bold mb-3">Key Features</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Real-time GPS tracking & dispatch</li>
                    <li>• Offline-first architecture</li>
                    <li>• Live system monitoring</li>
                    <li>• Emergency coordination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Strategic Goals</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Market Leadership</h3>
                <p className="text-gray-300">Establish EmersonEIMS as the market leader across all 15 core services. Educational content, certification, and partnerships amplify reach and credibility.</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg flex gap-4">
              <div className="text-3xl">📚</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Ecosystem Education</h3>
                <p className="text-gray-300">YouTube and podcast reach field technicians, facility managers, and engineers across Africa. Raise industry knowledge standards through verified, honest content.</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg flex gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Network Expansion</h3>
                <p className="text-gray-300">Marketplace and certification create pathways for regional partners and technicians. Grow capacity without growing overhead through network effects.</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg flex gap-4">
              <div className="text-3xl">💼</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Professional Development</h3>
                <p className="text-gray-300">Certification program creates verified talent pipeline. 750+ graduates already advancing careers. Build trust through demonstrated competency.</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Data-Driven Growth</h3>
                <p className="text-gray-300">Real-time mobile ops, marketplace analytics, and customer monitoring provide feedback loop for continuous improvement and innovation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Content Verification Standards</h2>

          <p className="text-gray-300 text-lg mb-8">
            All Phase 4 content adheres to strict verification standards. No fabrication, no false claims, no marketing hype. Every statement backed by data or field experience.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">YouTube & Podcast</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Real facilities, real installations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Actual field data, not estimates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Verified customer experiences</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>No staged scenarios</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Marketplace & Certification</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>6-step partner verification</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified customer reviews</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Real graduate outcomes tracked</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Transparent pricing, no hidden fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Explore Phase 4</h2>
          <p className="text-lg text-gray-300 mb-10">
            Each pillar works independently but amplifies the others. Education drives certifications. Marketplace grows through trusted partnerships. Mobile ops serve real customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/videos/youtube-episodes" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Watch YouTube Episodes
            </Link>
            <Link href="/podcasts/episodes" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Listen to Podcast
            </Link>
            <Link href="/marketplace" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              Browse Marketplace
            </Link>
            <Link href="/certification" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">
              Explore Certification
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
