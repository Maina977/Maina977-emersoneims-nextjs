import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Choose EmersonEIMS | Kenya Power Solutions',
  description: 'Why 100+ companies choose EmersonEIMS. 47-county coverage, 15 services, 4 AI tools, fastest response times, transparent pricing.',
};

export default function WhyChooseUsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Why Choose EmersonEIMS</h1>
          <p className="text-2xl text-gray-300 mb-8">The most trusted power solutions provider in East Africa</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Transparent pricing. Fastest response. 15 integrated services. 4 AI diagnostic tools. Coverage in all 47 Kenya counties plus Tanzania, Uganda, Rwanda.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our 5 Core Advantages</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg text-center">
              <p className="text-5xl mb-4">🗺️</p>
              <h3 className="text-lg font-bold text-emerald-400 mb-3">Nationwide Coverage</h3>
              <p className="text-gray-300 text-sm">All 47 Kenya counties + East Africa. We reach where others won't.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg text-center">
              <p className="text-5xl mb-4">⚡</p>
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Fastest Response</h3>
              <p className="text-gray-300 text-sm">4 hours Nairobi, 8-14 hours regional. Competitors: 24-48 hours.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg text-center">
              <p className="text-5xl mb-4">🔧</p>
              <h3 className="text-lg font-bold text-amber-400 mb-3">15 Services</h3>
              <p className="text-gray-300 text-sm">Generators, solar, water, HVAC, UPS, controls, motors—complete solutions.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg text-center">
              <p className="text-5xl mb-4">🤖</p>
              <h3 className="text-lg font-bold text-blue-400 mb-3">AI Tools</h3>
              <p className="text-gray-300 text-sm">4 diagnostic platforms for instant analysis. No more guessing.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg text-center">
              <p className="text-5xl mb-4">💰</p>
              <h3 className="text-lg font-bold text-green-400 mb-3">Transparent Pricing</h3>
              <p className="text-gray-300 text-sm">All prices online. No hidden fees. No surprise invoices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What Sets Us Apart</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">1. Integrated Solutions, Not Piecemeal Parts</h3>
              <p className="text-gray-300 mb-4">
                Other providers sell individual products. We design complete systems that work together. Generator + solar + UPS + controls = one unified solution.
              </p>
              <p className="text-sm text-gray-400">
                Result: 40% faster commissioning, 30% better efficiency, one vendor to coordinate with.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">2. Design First, Equipment Second</h3>
              <p className="text-gray-300 mb-4">
                We don't just sell equipment. We analyze your facility, calculate your exact load, design the right-sized system, then procure equipment.
              </p>
              <p className="text-sm text-gray-400">
                Result: Right-sized equipment means lower costs and better performance.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">3. Maintenance Partnerships, Not One-Time Sales</h3>
              <p className="text-gray-300 mb-4">
                We offer lifetime maintenance contracts. We want your system running well for years—that's how we build loyalty.
              </p>
              <p className="text-sm text-gray-400">
                Result: Predictable costs, prevented downtime, better equipment lifespan.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">4. AI Diagnostics Speed Up Troubleshooting</h3>
              <p className="text-gray-300 mb-4">
                When problems arise, our AI tools diagnose issues in minutes (not days). Generator Oracle analyzes 400K fault codes. Solar Genius sizes systems instantly.
              </p>
              <p className="text-sm text-gray-400">
                Result: Faster problem-solving, lower emergency repair costs, reduced downtime.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-4">5. Honest About Capabilities</h3>
              <p className="text-gray-300 mb-4">
                We tell you what we can do and what we can't. No false promises. No "we can do everything." We're specialists, not generalists.
              </p>
              <p className="text-sm text-gray-400">
                Result: Realistic expectations, reliable delivery, respect for your time and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Industries We Serve</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">🏭 Manufacturing</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Backup power (zero downtime)</li>
                <li>✓ Process cooling (HVAC)</li>
                <li>✓ Water systems (boreholes + pumps)</li>
                <li>✓ Equipment automation</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">🏥 Healthcare & Education</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Mission-critical power (lives depend on it)</li>
                <li>✓ Clean water systems</li>
                <li>✓ Climate control</li>
                <li>✓ Backup testing & commissioning</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">🛒 Commercial & Retail</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Backup for customer continuity</li>
                <li>✓ Cost optimization (solar)</li>
                <li>✓ Cooling for comfort</li>
                <li>✓ Professional service (annual maintenance)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Commitment to You</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Quality First</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Certified technicians only</li>
                <li>✓ Quality equipment (no knockoffs)</li>
                <li>✓ Professional installation standards</li>
                <li>✓ Thorough testing before handover</li>
                <li>✓ Warranty on all work</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">Transparency Always</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Written quotes (no surprises)</li>
                <li>✓ All prices online</li>
                <li>✓ Clear timelines upfront</li>
                <li>✓ No hidden fees</li>
                <li>✓ Honest about limitations</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-amber-400 mb-6">Fast Response</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Answer calls same day</li>
                <li>✓ Emergency response 4-14 hours</li>
                <li>✓ Quick diagnostics</li>
                <li>✓ Minimal downtime</li>
                <li>✓ 24/7 available</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-green-400 mb-6">Long-Term Partnership</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Lifetime maintenance available</li>
                <li>✓ Priority emergency response</li>
                <li>✓ Technology upgrades</li>
                <li>✓ Regular system optimization</li>
                <li>✓ Proactive maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Choose Better?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Stop comparing individual services. Compare complete solutions. That's where EmersonEIMS wins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
              Get Your Free Consultation
            </Link>
            <Link href="/pricing" className="px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
              View Pricing
            </Link>
          </div>

          <p className="text-gray-400 text-sm mt-8">
            No obligation. No sales pressure. Just honest discussion about your needs and how we can help.
          </p>
        </div>
      </section>
    </main>
  );
}
