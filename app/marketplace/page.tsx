import Link from 'next/link';
import { Metadata } from 'next';

/*
 * NOINDEX, 2026-08-31. This page advertises a partner network that does not
 * yet exist, and it was indexed at sitemap priority 0.85.
 *
 * What was published here and could not be evidenced anywhere in this
 * repository: three named partner companies, a star rating and review count
 * for each, a response-time SLA for each, and the line "Showing 3 of 47
 * verified partners" — a 47-company network. The description asserted that
 * every partner was "audited for quality", that "certifications verified" and
 * that "customer reviews real". The three linked profiles were themselves
 * noindexed on 2026-08-29 for publishing fabricated trust signals, but they
 * stayed linked from here, and this page stayed indexable — so the invented
 * ratings were the part Google could actually see.
 *
 * Invented review data is a Google spam-policy violation and misleading
 * advertising, and a "Verified Partner Network" with no verified partners is
 * a promise the business cannot keep on enquiry.
 *
 * The page and the feature are NOT deleted — that is the owner's call, and the
 * standing instruction is that nothing is removed without consent. The invented
 * specifics are gone, the concept and the quotation route remain.
 *
 * TO RESTORE: delete the robots block, restore the sitemap entry in
 * app/sitemap.ts, and list only partners who exist, with ratings drawn from
 * reviews actually collected.
 */
export const metadata: Metadata = {
  title: 'Partner Marketplace',
  description: 'How the EmersonEIMS partner marketplace works: request one specification, compare quotations, and deal with the supplier directly. Partner network in formation.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.emersoneims.com/marketplace',
  },
};

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
          {/*
            This said "Every partner audited for quality, every review is real"
            — stated as accomplished fact, with no partners and no reviews
            behind it. It now describes the standard the network is being built
            to, which is the truthful version of the same promise.
          */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            One specification, quotations you can compare, and no commission loaded onto the price.
            The standard every partner must meet before being listed is set out below.
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
              {/*
                A blanket "money-back guarantee" was published here on a third
                party's behalf, with no written undertaking anywhere to support
                it. Replaced with the remedy that is actually within our control.
              */}
              <p className="text-gray-300 text-sm">
                Work is contracted against the specification we issued. If a partner does not deliver
                to it, EmersonEIMS takes the job on directly and remedies it.
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
              Partners are admitted only after the checks set out above. When a partner does not perform, we take responsibility. When a partner doesn't perform, we take responsibility.
            </p>
            <p className="text-gray-300">
              {/* A refund undertaking given on a third party's behalf, with no escrow,
                  insurer or written policy behind it anywhere in this repository. */}
              <strong>If a partner does not deliver:</strong> EmersonEIMS takes the job on directly and completes it to the specification we issued. Any refund is governed by the written terms of your order.
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
                Enforced through the contract issued against our specification.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">If Something Goes Wrong</h3>
              <p className="text-gray-300 mb-4">
                If a partner does not deliver, the work comes back to EmersonEIMS and we complete it. Remedies beyond that are governed by the written terms of your order.
              </p>
              <p className="text-xs text-gray-400">
                We do not let a partner failure become your problem.
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
                  <li>Work contracted against our written specification</li>
                  <li>Dispute resolution (neutral mediation)</li>
                  <li>SLA terms set out in the order</li>
                  <li>EmersonEIMS completes the work if a partner does not</li>
                  <li>Our team oversight (real quality checks)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg mb-4">
              The 10% fee is transparent, fixed, and includes real protections you can count on.
            </p>
            {/*
              Removed a comparison against unnamed "marketplace competitors who
              take 15-25%" — a figure for other companies' pricing that we have
              no source for, and a comparison the owner has ruled out entirely.
              The fee stands on its own terms.
            */}
            <p className="text-gray-400">
              You see the fee before you accept a quotation, and it does not change afterwards.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Partners */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Partner Network</h2>

          {/*
            Three partner cards stood here, each publishing a star rating, a
            review count and a response-time SLA for a named company. None of
            it came from collected data, and the footer claimed a 47-company
            network. Replaced with what is true today: the network is being
            built, and every enquiry is handled by EmersonEIMS directly.
          */}
          <div className="max-w-3xl mx-auto mb-12 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">The partner network is in formation</h3>
            <p className="text-gray-300 mb-4">
              We are not listing partner companies, ratings or review counts until there are
              partners who have signed terms and reviews that customers have actually written.
              Publishing either before then would tell you something we cannot stand behind.
            </p>
            <p className="text-gray-300">
              In the meantime your enquiry does not sit in a queue. It reaches the EmersonEIMS
              engineering team in Nairobi, who quote, supply, install and maintain directly —
              diesel generators, solar, UPS and industrial power systems, nationwide.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Need a quotation now, or run a power engineering firm interested in joining the network?
            </p>
            <a
              href="/contact?type=marketplace-quote"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Talk to the EmersonEIMS Team
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
                We step in. Our team completes the work to the specification we issued, at no additional cost to you. Any refund is governed by the written terms of your order.</p>
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
    </div>
  );
}
