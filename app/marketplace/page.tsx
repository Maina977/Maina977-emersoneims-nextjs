import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EmersonEIMS Partner Marketplace | Vetted Backup Power Providers | Africa',
  description: 'Connect with verified backup power providers. All partners audited for quality, certifications verified, customer reviews real. No commission inflation, no hidden costs.',
  alternates: {
    canonical: 'https://www.emersoneims.com/marketplace',
  },
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Verified Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
              Partner Network
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get quotes from multiple vetted providers. Every partner audited for quality, every review is real, no hidden fees.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">The Honest Marketplace Process</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-3">You Request Quote</h3>
              <p className="text-gray-300 text-sm">
                Submit your facility requirements: power needs, timeline, location. Be specific so partners can give accurate quotes.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-3">We Match Partners</h3>
              <p className="text-gray-300 text-sm">
                We send your RFQ to 2-3 verified partners qualified for your specific project type and region.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-3">Partners Compete</h3>
              <p className="text-gray-300 text-sm">
                Partners respond with real quotes (not templates). You compare quality, pricing, timeline, experience.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="text-3xl mb-4">4️⃣</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-3">We Oversee Quality</h3>
              <p className="text-gray-300 text-sm">
                If partner doesn't deliver, you're protected. We guarantee quality through contracts and money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Verification */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How We Verify Partners (Real Transparency)</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Company Registration Verified</h3>
                  <p className="text-gray-300">
                    We verify every partner is a real, registered business with government records checked and confirmed current.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Equipment Certifications Validated</h3>
                  <p className="text-gray-300">
                    All equipment certifications (ISO, safety, manufacturer approval) are verified as current and legitimate.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Customer References Contacted</h3>
                  <p className="text-gray-300">
                    We call 3+ past customers to verify work quality, responsiveness, and customer satisfaction before listing.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">On-Site Quality Audit</h3>
                  <p className="text-gray-300">
                    We visit their facility, inspect their equipment, review their processes, and assess their team's technical capability.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Insurance & Legal Verified</h3>
                  <p className="text-gray-300">
                    All partners carry liability insurance and have signed our partnership agreement. No exceptions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Trial Project Required</h3>
                  <p className="text-gray-300">
                    Before marketplace listing, partner executes small pilot project with us. Proves capability and quality before joining network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Result: Partners You Can Trust</h3>
            <p className="text-gray-300 mb-4">
              Every partner in our marketplace has been vetted for quality, capacity, and customer satisfaction. When a partner doesn't perform, we take responsibility.
            </p>
            <p className="text-gray-300">
              <strong>Your Money-Back Guarantee:</strong> If a marketplace partner fails to deliver, we refund your money and handle the solution ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Partner Tiers (Based on Verified Performance)</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <div className="text-3xl mb-4">🥉</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Bronze Tier</h3>
              <ul className="space-y-3 text-gray-300 text-sm mb-6">
                <li>✓ New to marketplace</li>
                <li>✓ Pre-approved & trained</li>
                <li>✓ 24-hour response target</li>
                <li>✓ Real-time monitoring</li>
                <li>✓ 2-5 year track record</li>
              </ul>
              <p className="text-xs text-gray-400 border-t border-yellow-500/20 pt-4">
                Newer partners with capacity and commitment to quality. Perfect for growing regions.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/40 rounded-lg ring-2 ring-emerald-500/30">
              <div className="text-3xl mb-4">🥈</div>
              <h3 className="text-xl font-bold text-gray-300 mb-4">Silver Tier <span className="text-emerald-400 text-sm">(Most Popular)</span></h3>
              <ul className="space-y-3 text-gray-300 text-sm mb-6">
                <li>✓ 1-2 verified projects</li>
                <li>✓ 4.0+ star rating</li>
                <li>✓ 12-hour response SLA</li>
                <li>✓ Expanding capability</li>
                <li>✓ 5-10 year track record</li>
              </ul>
              <p className="text-xs text-gray-400 border-t border-gray-500/40 pt-4">
                Proven partners with solid track record. Right size for most projects.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-600/40 rounded-lg">
              <div className="text-3xl mb-4">🥇</div>
              <h3 className="text-xl font-bold text-yellow-600 mb-4">Gold Tier</h3>
              <ul className="space-y-3 text-gray-300 text-sm mb-6">
                <li>✓ 3+ verified projects</li>
                <li>✓ 4.5+ star rating</li>
                <li>✓ 2-hour response SLA</li>
                <li>✓ Proven large projects</li>
                <li>✓ 10+ year track record</li>
              </ul>
              <p className="text-xs text-gray-400 border-t border-yellow-600/40 pt-4">
                Elite partners for complex, large-scale projects. Highest reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Protection */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Customer Protections (Real Guarantees)</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Quality Guarantee</h3>
              <p className="text-gray-300 mb-4">
                If a partner doesn't meet agreed quality standards, we step in. Our team will complete the work to spec at no additional cost to you.
              </p>
              <p className="text-xs text-gray-400">
                Enforced through contracts and escrow arrangements. Not a promise — a contractual obligation.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Money-Back Guarantee</h3>
              <p className="text-gray-300 mb-4">
                If partner doesn't deliver and we can't fix it, you get your money back. Full refund, no questions. We eat the cost.
              </p>
              <p className="text-xs text-gray-400">
                Backed by escrow and insurance. We don't let partner failures become your problem.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Dispute Resolution</h3>
              <p className="text-gray-300 mb-4">
                If you and partner disagree on quality/timeline/specs, we mediate. We review the contract, visit the site, and make a binding decision.
              </p>
              <p className="text-xs text-gray-400">
                Fair process. We have technical team who can verify claims from both sides.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">SLA Enforcement</h3>
              <p className="text-gray-300 mb-4">
                Every partner commits to response time SLAs (2-24 hours depending on tier). Miss it? Automatic service credit or refund to you.
              </p>
              <p className="text-xs text-gray-400">
                We track response times automatically. Delays trigger automatic compensation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Pricing: No Hidden Fees</h2>

          <div className="max-w-3xl mx-auto">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-500/20">
                <span className="text-gray-300 font-bold">Your Quote from Partner</span>
                <span className="text-cyan-400">100% (e.g., KES 5M)</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-emerald-500/20">
                <span className="text-gray-300">EmersonEIMS Marketplace Fee</span>
                <span className="text-yellow-400">10% (e.g., KES 500K)</span>
              </div>

              <div className="flex justify-between items-center pt-4 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 p-4 rounded">
                <span className="text-gray-300 font-bold">Your Total Cost</span>
                <span className="text-emerald-400 font-bold">110% (e.g., KES 5.5M)</span>
              </div>

              <div className="text-sm text-gray-400 space-y-2 mt-6 pt-6 border-t border-emerald-500/20">
                <p>
                  <strong>What you get for the 10% fee:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Partner verification (detailed audit)</li>
                  <li>Quality guarantees (money-back if they fail)</li>
                  <li>Dispute resolution (neutral mediation)</li>
                  <li>SLA enforcement (automatic compensation)</li>
                  <li>Insurance backing (escrow accounts)</li>
                  <li>Our team oversight (real quality checks)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg mb-4">
              The 10% fee is transparent, fixed, and includes real protections you can count on.
            </p>
            <p className="text-gray-400">
              Compare that to marketplace competitors who take 15-25% with no guarantees or who hide their fee structure entirely.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Partners */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Browse Verified Partners</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: 'PowerTech Solutions',
                tier: 'Gold',
                rating: 4.8,
                reviews: 12,
                specialty: 'Mining Operations',
                response: '2 hours',
                region: 'Kenya, Tanzania, Uganda',
                href: '/marketplace/partners/powertech-solutions',
              },
              {
                name: 'Reliable Energy Systems',
                tier: 'Silver',
                rating: 4.2,
                reviews: 8,
                specialty: 'Healthcare & Utilities',
                response: '12 hours',
                region: 'Kenya, Rwanda',
                href: '/marketplace/partners/reliable-energy',
              },
              {
                name: 'East Africa Industrial',
                tier: 'Silver',
                rating: 4.4,
                reviews: 6,
                specialty: 'Manufacturing & O&G',
                response: '8 hours',
                region: 'Tanzania, Uganda',
                href: '/marketplace/partners/east-africa-industrial',
              },
            ].map((partner, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                    <p className="text-sm text-gray-400">{partner.specialty}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    partner.tier === 'Gold' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-gray-600/20 text-gray-300'
                  }`}>
                    {partner.tier}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <p>⭐ {partner.rating} ({partner.reviews} reviews)</p>
                  <p>⏱️ {partner.response} response time</p>
                  <p>📍 {partner.region}</p>
                </div>

                <div className="space-y-2">
                  <Link href={partner.href} className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-center">
                    View Profile
                  </Link>
                  <a href={`/contact?type=marketplace-quote&partner=${partner.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full px-4 py-2 border-2 border-emerald-500 text-emerald-400 font-bold rounded hover:bg-emerald-500/10 transition-all text-center">
                    Request Quote
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Showing 3 of 47 verified partners. Browse full network or request a quote.
            </p>
            <a
              href="/contact?type=marketplace-quote"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Get Quotes from Multiple Partners
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Questions About the Marketplace</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">Why do partners charge extra if EmersonEIMS is already in business?</h3>
              <p className="text-gray-300">
                EmersonEIMS focuses on complex projects and direct sales. The marketplace connects you with regional specialists who may have lower costs or faster delivery for specific project types. We're not competing — we're expanding access.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">Can I request a quote from EmersonEIMS instead of marketplace partners?</h3>
              <p className="text-gray-300">
                Yes. <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">Contact us directly</Link> if you prefer to work with EmersonEIMS. The marketplace is for customers who want to compare multiple options.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">What if a marketplace partner doesn't perform?</h3>
              <p className="text-gray-300">
                We step in. Either our team completes the work to spec at no cost to you, or we refund your money. Our money-back guarantee means partner failure isn't your risk.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">How long does the quote process take?</h3>
              <p className="text-gray-300">
                Typically 48-72 hours. You submit requirements → we match partners → partners respond with detailed quotes. Some simple projects get quotes in 24 hours; complex projects may take 1-2 weeks.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">Do marketplace partners handle everything or do I need EmersonEIMS involvement?</h3>
              <p className="text-gray-300">
                Partners handle project execution. EmersonEIMS handles quality verification and customer protection. You deal with the partner day-to-day; we ensure they deliver to spec.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Compare?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Submit your project requirements and get quotes from verified partners. No obligation, no pressure.
          </p>

          <a
            href="/contact?type=marketplace-quote"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Get Marketplace Quotes
          </a>
        </div>
      </section>
    </main>
  );
}
