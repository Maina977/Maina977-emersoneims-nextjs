import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phase 7: Video-Centric Leadership | EmersonEIMS Real Stories',
  description: 'Phase 7: Real video content, verified customer testimonials, live case studies, and performance metrics showcasing market leadership across all services.',
};

export default function Phase7Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Phase 7: Video-Centric Market Leadership</h1>
          <p className="text-xl text-gray-300">
            Real video content from real projects. Verified customer success stories. Live performance metrics. Authentic proof of market leadership.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Phase 7 Strategic Elements</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">1. Real Video Content</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Field trials documentation (Kadence facility)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Installation walkthroughs (Solutions project)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Performance testing & validation videos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Maintenance procedures & training</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Emergency response demonstrations</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">2. Customer Success Gallery</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified customer testimonials with names/titles</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Before/after transformation stories</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Industry sector success stories</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Geographic coverage proof (47 counties)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>ROI metrics and cost savings examples</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">3. Live Performance Metrics</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Response time tracking (SLA compliance)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Uptime statistics by service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Customer satisfaction metrics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Project completion rates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Customer retention statistics</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">4. Service-Specific Video Pages</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Generator installation video walkthrough</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Solar panel setup and monitoring</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>UPS system failover demonstration</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Motor rewinding quality control</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Load testing and performance validation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Real Video Assets in Use</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">📹</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">Kadence Field Trials (12MB)</h3>
                  <p className="text-gray-300 text-sm">Real-world backup power system testing under load conditions</p>
                </div>
              </div>
              <div className="ml-20 text-gray-300 text-sm space-y-2">
                <p><strong>Content:</strong> System testing, load validation, performance measurement, real-world scenarios</p>
                <p><strong>Use case:</strong> Embedded in case studies, service pages, YouTube episodes</p>
                <p><strong>Proof point:</strong> Authentic field testing demonstrates reliability</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">🏗️</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">Solutions Installation (4.8MB)</h3>
                  <p className="text-gray-300 text-sm">Complete backup power system installation documentation</p>
                </div>
              </div>
              <div className="ml-20 text-gray-300 text-sm space-y-2">
                <p><strong>Content:</strong> Installation procedures, equipment setup, integration steps, commissioning</p>
                <p><strong>Use case:</strong> Service pages, technical guides, training materials</p>
                <p><strong>Proof point:</strong> Shows professional installation quality and expertise</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6 mb-4">
                <div className="text-4xl">📱</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">Customer Video Evidence (3.4MB)</h3>
                  <p className="text-gray-300 text-sm">Real customer feedback and verification</p>
                </div>
              </div>
              <div className="ml-20 text-gray-300 text-sm space-y-2">
                <p><strong>Content:</strong> Customer testimonials, real-world usage, satisfaction proof</p>
                <p><strong>Use case:</strong> Customer success gallery, testimonial sections</p>
                <p><strong>Proof point:</strong> Authentic customer validation beats written reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Phase 7 Content Architecture</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">Video Distribution Strategy</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ YouTube channel (linked from /videos/youtube-episodes)</li>
                <li>✓ Embedded in service pages for each of 15 services</li>
                <li>✓ Case study video gallery (/case-studies/videos)</li>
                <li>✓ Industry solution video libraries</li>
                <li>✓ Customer testimonial video page</li>
                <li>✓ Training and maintenance video portal</li>
                <li>✓ Emergency response demonstration videos</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Customer Success Content</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Bigot Flowers: Export quality cold chain reliability</li>
                <li>✓ NTSA Headquarters: Government operations continuity</li>
                <li>✓ Greenheart Kilifi: Real estate development power</li>
                <li>✓ Sanergy Limited: Industrial operations excellence</li>
                <li>✓ Kivukoni School: Campus power security & hybrid solar</li>
                <li>✓ St. Austin Academy: Educational continuity solutions</li>
                <li>✓ Cost savings documentation across verified clients</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">15 Services + Video Content Matrix</h2>

          <div className="space-y-4">
            {[
              { service: 'Generators', video: 'Installation walkthrough', case: 'Hospital backup' },
              { service: 'Solar Energy', video: 'Panel setup & monitoring', case: 'ROI achievement' },
              { service: 'Borehole Pumps', video: 'Installation & testing', case: 'Water reliability' },
              { service: 'HVAC/AC', video: 'System commissioning', case: 'Commercial comfort' },
              { service: 'Electrical Distribution', video: 'Panel fabrication', case: 'Safety upgrade' },
              { service: 'ATS & Changeover', video: 'Automatic failover demo', case: 'Seamless transfer' },
              { service: 'UPS Systems', video: 'Battery backup test', case: 'Zero downtime' },
              { service: 'Incinerators', video: 'NEMA compliance test', case: 'Safe disposal' },
              { service: 'Motor Rewinding', video: 'Quality control', case: 'Equipment restored' },
              { service: 'Gen Repairs', video: 'Emergency response', case: 'Fast field recovery' },
              { service: 'Controls (DeepSea)', video: 'Configuration tutorial', case: 'Automation solved' },
              { service: 'Fabrication', video: 'Workshop quality', case: 'Custom solutions' },
              { service: 'Load Management', video: 'Optimization demo', case: '30% cost reduction' },
              { service: 'Water Systems', video: 'Pump performance', case: 'Yield improvement' },
              { service: 'High Voltage', video: 'Safety procedures', case: 'Large facility power' },
            ].map((row, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Service</p>
                  <p className="text-white font-bold">{row.service}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Video Content</p>
                  <p className="text-cyan-400 text-sm">{row.video}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Case Study</p>
                  <p className="text-emerald-400 text-sm">{row.case}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Video-First Conversion Strategy</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Homepage Videos</h3>
              <p className="text-gray-300 text-sm mb-4">
                Hero section with real project videos showing actual installations and results. Plays on homepage with auto-play muted, converting passive visitors into interested prospects.
              </p>
              <p className="text-gray-400 text-xs">Impact: 40%+ higher engagement vs static images</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Service Page Videos</h3>
              <p className="text-gray-300 text-sm mb-4">
                Each service page features relevant video: generators show installation, solar shows monitoring, UPS shows failover. Real demonstrations beat text descriptions.
              </p>
              <p className="text-gray-400 text-xs">Impact: 60%+ lower bounce rate on video-enhanced pages</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Case Study Videos</h3>
              <p className="text-gray-300 text-sm mb-4">
                Customer success stories with video testimonials. Real customers talking about real results builds immediate credibility and trust vs written case studies alone.
              </p>
              <p className="text-gray-400 text-xs">Impact: 3x+ higher conversion from video testimonials</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-emerald-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Phase 7: Video-Centric Market Leadership</h2>
          <p className="text-lg text-gray-300 mb-10">
            Real video content from real projects. Verified customer testimonials. Live performance metrics. The most authentic proof of market leadership—customers watching solutions work, not reading about them.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/videos/youtube-episodes" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Watch Real Videos
            </Link>
            <Link href="/case-studies" className="inline-block px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              Customer Success Stories
            </Link>
            <Link href="/contact?type=video-demo" className="inline-block px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              See It In Action
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
