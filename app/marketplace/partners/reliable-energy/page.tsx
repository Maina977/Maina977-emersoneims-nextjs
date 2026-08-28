import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reliable Energy Systems | Verified Partner | EmersonEIMS Marketplace',
  description: 'Silver tier partner specializing in healthcare & utilities backup power. 4.2 rating, 12-hour response time. Kenya, Rwanda coverage.',
};

export default function ReliableEnergyPartnerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-4">Reliable Energy Systems</h1>
              <p className="text-xl text-gray-300">Silver Tier Partner • Healthcare & Utilities Specialist</p>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">🥈</div>
              <p className="text-gray-300 font-bold">4.2/5.0</p>
              <p className="text-gray-400 text-sm">8 reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-gray-300 mb-3">Response Time</h3>
              <p className="text-3xl font-bold text-white mb-2">12 Hours</p>
              <p className="text-gray-400 text-sm">Guaranteed emergency response SLA</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-gray-300 mb-3">Coverage Area</h3>
              <p className="text-white font-bold mb-2">Kenya, Rwanda</p>
              <p className="text-gray-400 text-sm">Regional operations with service hubs</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-gray-300 mb-3">Track Record</h3>
              <p className="text-3xl font-bold text-white mb-2">5-10</p>
              <p className="text-gray-400 text-sm">Years in backup power industry</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">About Reliable Energy Systems</h2>
          <p className="text-gray-300 text-lg mb-6">
            Reliable Energy Systems specializes in backup power solutions for healthcare facilities and utility systems across Kenya and Rwanda. With a proven Silver tier rating and deep experience in mission-critical applications, they excel at designing systems where power reliability directly impacts patient safety and service delivery.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-300 mb-6">Specializations</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Hospital & clinic backup power systems</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Utility infrastructure power redundancy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Critical load prioritization & UPS integration</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Medical equipment power quality standards</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Emergency response & rapid deployment</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-300 mb-6">Certifications & Credentials</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>ISO 9001:2015 (Quality Management)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Healthcare facility compliance certified</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Authorized Cummins service partner</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
                  <span>Electrical safety auditing certified</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300 font-bold">✓</span>
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
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-gray-300 font-bold">Hospital Director, Nairobi</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Reliable Energy designed a backup system specifically for our OR and ICU loads. They understood medical equipment requirements better than other providers. System has been flawless for 3 years."
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-gray-300 font-bold">Utility Operations Manager, Rwanda</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "We use them for both equipment supply and maintenance contracts. Responsive team, good pricing, and they've helped us expand service to underserved regions."
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-gray-300 font-bold">Clinic Manager, Kisumu</p>
                  <p className="text-gray-400 text-sm">⭐⭐⭐⭐ Verified customer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Our clinic needed affordable backup power. Reliable Energy helped us find a solution that fit our budget without compromising reliability. Good value."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Service Options & Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Installation</h3>
              <p className="text-gray-300 mb-4">Complete system design, installation, testing for healthcare and utility facilities.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 500K - KES 5M</p>
              <p className="text-gray-400 text-sm">Depending on system size and facility type</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Maintenance Contracts</h3>
              <p className="text-gray-300 mb-4">Regular service, spare parts, 12-hour emergency support included.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 50K - KES 200K/month</p>
              <p className="text-gray-400 text-sm">Based on system size and support level</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Emergency Repair</h3>
              <p className="text-gray-300 mb-4">24/7 emergency response for system failures with 12-hour arrival target.</p>
              <p className="text-2xl font-bold text-white mb-2">KES 25K - KES 200K</p>
              <p className="text-gray-400 text-sm">Depending on repair complexity</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Supply & Installation</h3>
              <p className="text-gray-300 mb-4">Equipment supply with professional installation and commissioning.</p>
              <p className="text-2xl font-bold text-white mb-2">Custom Quote</p>
              <p className="text-gray-400 text-sm">Designed for your specific facility needs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/30 to-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get a Quote from Reliable Energy Systems</h2>
          <p className="text-lg text-gray-300 mb-8">
            Tell us about your facility's backup power needs. Reliable Energy will respond with a detailed quote within 24-48 hours.
          </p>
          <a href="/contact?type=marketplace-quote&partner=reliable-energy" className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-gray-500/30 transition-all">
            Request Quote from Reliable Energy
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
                If Reliable Energy doesn't meet agreed quality standards, EmersonEIMS will step in and complete the work at no additional cost to you.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Money-Back Guarantee</h3>
              <p className="text-gray-300">
                If Reliable Energy fails to deliver and we can't fix it, you get your money back. Full refund, no questions asked.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">SLA Enforcement</h3>
              <p className="text-gray-300">
                Reliable Energy commits to 12-hour response times. If they miss it, automatic service credit or refund to you.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Dispute Resolution</h3>
              <p className="text-gray-300">
                If you and Reliable Energy disagree on quality/timeline, we mediate. Our technical team visits the site and makes binding decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
