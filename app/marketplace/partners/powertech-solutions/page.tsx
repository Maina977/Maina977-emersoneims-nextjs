import { Metadata } from 'next';

/*
 * NOINDEX, 2026-08-29. This page publishes fabricated trust signals.
 *
 * It presents a named third-party company as a "Verified Partner" with a star
 * rating, a review count, a quoted customer testimonial, a tiered status and a
 * response-time SLA — none of which came from any collected data — and it makes
 * a money-back guarantee on that company's behalf ("full refund, no questions
 * asked"). Nothing in this repository evidences that these partners exist, that
 * anyone reviewed them, or that any such refund undertaking was agreed.
 *
 * Publishing invented review data is a Google structured-data and spam policy
 * violation as well as misleading advertising, so the page is removed from the
 * index while the owner decides whether these partners are real. The page is
 * NOT deleted — that is the owner's call, and the standing instruction is that
 * nothing is removed without consent.
 *
 * TO RESTORE: delete the robots block below, once the partner, the rating and
 * the guarantee can each be evidenced.
 */
export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/marketplace/partners/powertech-solutions' },
  robots: { index: false, follow: false },
  title: 'PowerTech Solutions | Verified Partner',
  description: 'Gold tier partner specializing in mining operations backup power. 4.8 rating, 2-hour response time. Kenya, Tanzania, Uganda coverage.',
};

export default function PowerTechPartnerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-4">PowerTech Solutions</h1>
              <p className="text-xl text-gray-300">Gold Tier Partner • Mining Operations Specialist</p>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">🥇</div>
              <p className="text-yellow-400 font-bold">4.8/5.0</p>
              <p className="text-gray-400 text-sm">12 reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Response Time</h3>
              <p className="text-3xl font-bold text-white mb-2">2 Hours</p>
              <p className="text-gray-400 text-sm">Guaranteed emergency response SLA</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Coverage Area</h3>
              <p className="text-white font-bold mb-2">Kenya, Tanzania, Uganda</p>
              <p className="text-gray-400 text-sm">Multi-country operations with regional hubs</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Track Record</h3>
              <p className="text-3xl font-bold text-white mb-2">10+</p>
              <p className="text-gray-400 text-sm">Years in backup power industry</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">About PowerTech Solutions</h2>
          <p className="text-gray-300 text-lg mb-6">
            PowerTech Solutions is a specialized backup power provider focused on mining and industrial operations across East Africa. With over 10 years in the industry and a Gold tier rating, they bring deep expertise in high-reliability systems for mission-critical environments.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Specializations</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Mining site backup power (24/7 operations)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Industrial facility power redundancy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Large-scale generator systems (500kW-5MW)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Preventive maintenance programs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Emergency repair & troubleshooting</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Certifications & Credentials</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>ISO 9001:2015 (Quality Management)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>ISO 45001:2018 (Health & Safety)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Authorized Caterpillar distributor</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Perkins certified technicians</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Full liability insurance & bonded</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Customer Reviews</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-yellow-400 font-bold">Mining Operation Manager, Kilifi</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "PowerTech installed a 2MW system for our mining site. Their team was professional, the installation was clean, and the 2-hour response time guarantee gives us real peace of mind for 24/7 operations. Two years in, zero issues."
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-yellow-400 font-bold">Industrial Facility Director, Tanzania</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "When we had a generator failure during peak production, PowerTech arrived in under 2 hours with backup equipment. They had us back online the same day. Worth every shilling of the contract."
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-yellow-400 font-bold">Operations Manager, Uganda Plant</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Professional service, knowledgeable technicians, realistic quotes. They didn't oversell us on features we didn't need. Maintenance contracts include everything—no surprise costs."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Service Options & Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Installation</h3>
              <p className="text-gray-300 mb-4">Complete system design, installation, testing, and commissioning for mining operations.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 2M - KES 20M+</p>
              <p className="text-gray-400 text-sm">Depending on system size and facility requirements</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Maintenance Contracts</h3>
              <p className="text-gray-300 mb-4">Quarterly service, spare parts, 24/7 emergency support with 2-hour response.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 100K - KES 500K/month</p>
              <p className="text-gray-400 text-sm">Based on system size and support level</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Emergency Repair</h3>
              <p className="text-gray-300 mb-4">24/7 emergency response for system failures with 2-hour arrival guarantee.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 50K - KES 500K</p>
              <p className="text-gray-400 text-sm">Depending on repair complexity</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Preventive Programs</h3>
              <p className="text-gray-300 mb-4">Customized maintenance plans, fuel quality management, load testing, documentation.</p>
              <p className="text-2xl font-bold text-white mb-2">Custom Quote</p>
              <p className="text-gray-400 text-sm">Designed for your specific operation needs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get a Quote from PowerTech Solutions</h2>
          <p className="text-lg text-gray-300 mb-8">
            Tell us about your backup power needs. PowerTech will respond with a detailed quote within 24 hours.
          </p>
          <a href="/contact?type=marketplace-quote&partner=powertech-solutions" className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all">
            Request Quote from PowerTech
          </a>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Your Protection as a Customer</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Quality Guarantee</h3>
              <p className="text-gray-300">
                If PowerTech doesn't meet agreed quality standards, EmersonEIMS will step in and complete the work at no additional cost to you.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Money-Back Guarantee</h3>
              <p className="text-gray-300">
                If PowerTech fails to deliver and we can't fix it, you get your money back. Full refund, no questions asked.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">SLA Enforcement</h3>
              <p className="text-gray-300">
                PowerTech commits to 2-hour response times. If they miss it, automatic service credit or refund to you.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Dispute Resolution</h3>
              <p className="text-gray-300">
                If you and PowerTech disagree on quality/timeline, we mediate. Our technical team visits the site and makes binding decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
