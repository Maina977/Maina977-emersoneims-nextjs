import Link from 'next/link';
import { Metadata } from 'next';
import EastAfricaCityLinks from '@/components/east-africa/EastAfricaCityLinks';

export const metadata: Metadata = {
  title: 'Power Solutions Uganda',
  description: 'Reliable generator and power solutions across Uganda. Kampala tech hub, Jinja industrial park, telecom tower backup. 24/7 support in UGX. Call +256701234567.',
  alternates: {
    canonical: 'https://www.emersoneims.com/east-africa/uganda',
  },
};

export default function UgandaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Powering Uganda's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              Tech Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Kampala is Africa's fastest-growing tech ecosystem. From software startups to telecom giants, from manufacturing in Jinja to hospitality across all regions — EmersonEIMS keeps Uganda's businesses powered 24/7.
          </p>
        </div>
      </section>

      {/* Uganda Opportunity */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Uganda's Digital & Industrial Boom</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Tech Startups</h3>
              <p className="text-gray-300">Kampala has 1,000+ registered tech startups. Power reliability is critical for datacenters, dev offices, and co-working spaces.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Telecom Expansion</h3>
              <p className="text-gray-300">MTN, Airtel, Africell tower networks need 99.7% uptime. We provide redundancy across 50+ sites nationwide.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Jinja Industrial</h3>
              <p className="text-gray-300">Jinja's industrial park is Uganda's manufacturing hub. Factories need 99.5%+ uptime for export competitiveness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Presence in Uganda</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">Kampala Hub</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Same-day delivery for generators</li>
                <li>✓ 4-hour emergency response</li>
                <li>✓ Full service & parts inventory</li>
                <li>✓ Tech startup support specialists</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">Regional Coverage</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Jinja industrial support</li>
                <li>✓ Fort Portal & Western regions</li>
                <li>✓ Northern Uganda (Gulu, Lira)</li>
                <li>✓ Scheduled visits to emerging areas</li>
              </ul>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-blue-400 mb-3">Nationwide Service</h3>
            <p className="text-gray-300 mb-4">
              From Kampala's high-rise offices to Fort Portal's hospitals, from Jinja's factories to Mbale's agricultural processors — we serve all of Uganda's 134 districts.
            </p>
            <p className="text-sm text-blue-300">Response times: Kampala 4 hours • Jinja 6 hours • Regional 24-48 hours</p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Industries We Serve</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💻',
                title: 'Tech & Startups',
                examples: 'Software companies, datacenters, co-working spaces, fintech',
                locations: 'Kampala (primary)',
              },
              {
                icon: '📡',
                title: 'Telecommunications',
                examples: 'Tower backup, data centers, carrier operations',
                locations: 'Nationwide',
              },
              {
                icon: '🏭',
                title: 'Manufacturing',
                examples: 'Textiles, steel, food processing, assembly',
                locations: 'Jinja, Kampala suburbs',
              },
              {
                icon: '🥬',
                title: 'Agriculture & Processing',
                examples: 'Coffee mills, tea factories, grain storage',
                locations: 'Fort Portal, Kabale, Mbarara',
              },
              {
                icon: '🏥',
                title: 'Healthcare',
                examples: 'Hospitals, clinics, diagnostic centers',
                locations: 'Kampala, Jinja, regional centers',
              },
              {
                icon: '🍽️',
                title: 'Hospitality & Food',
                examples: 'Hotels, restaurants, catering operations',
                locations: 'Kampala, Jinja, tourist areas',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 mb-3">{item.examples}</p>
                <p className="text-xs text-blue-300">📍 {item.locations}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uganda Case Studies */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Success Across Uganda</h2>

          <div className="space-y-8">
            {[
              {
                title: 'Kampala Tech Startup Incubator',
                location: 'Kampala',
                issue: '50+ startup companies sharing one office, daily outages disrupting operations',
                solution: '100 kVA generator + UPS for all servers + remote monitoring',
                result: '99.9% uptime, zero startup churn, attracts top talent',
                investment: 'UGX 80M (~KES 1.8M)',
              },
              {
                title: 'MTN Uganda Tower Network',
                location: 'Nationwide (50+ sites)',
                issue: 'Grid unreliability causing tower drops, revenue loss UGX 50M/month',
                solution: 'Multi-site 30-50 kVA generator rollout + centralized monitoring',
                result: '99.7% uptime, zero tower incidents, KES 25M annual ROI',
                investment: 'UGX 500M (~KES 11.3M)',
              },
              {
                title: 'Jinja Manufacturing Plant',
                location: 'Jinja Industrial Park',
                issue: 'Factory downtime losing UGX 2M/hour, export deadlines missed',
                solution: '250 kVA industrial generator + predictive maintenance',
                result: '99.6% uptime, zero missed shipments, 3-month ROI',
                investment: 'UGX 180M (~KES 4.1M)',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
                <h3 className="text-xl font-bold text-blue-400 mb-2">{study.title}</h3>
                <p className="text-sm text-gray-400 mb-4">📍 {study.location}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">CHALLENGE</p>
                      <p className="text-sm text-gray-300">{study.issue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">SOLUTION</p>
                      <p className="text-sm text-gray-300">{study.solution}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                      <p className="text-xs text-green-400 font-bold mb-1">RESULT</p>
                      <p className="text-sm text-green-300">{study.result}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-1">Investment</p>
                      <p className="text-lg font-bold text-blue-400">{study.investment}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Services in Uganda</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Generator Sales & Installation (all brands, all sizes)',
              'UPS & Battery Backup Systems (medical to industrial grade)',
              'Solar & Hybrid Systems (reduce grid dependency)',
              'ATS/Changeover Panels (automatic, seamless switching)',
              'Preventive Maintenance (monthly scheduled service)',
              '24/7 Emergency Support (Kampala priority response)',
            ].map((service, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <span className="text-blue-400 font-bold text-xl mt-1">✓</span>
                <p className="text-gray-300">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Uganda's Future</h2>
          <p className="text-lg text-gray-300 mb-10">
            Whether you're a Kampala startup, a telecom operator, or a Jinja factory — we keep your power flowing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+256701234567"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +256 701 234 567
            </a>
            <a
              href="https://wa.me/256701234567?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20in%20Uganda.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Serving: Kampala • Jinja • Entebbe • Fort Portal • Mbarara • Gulu • Mbale • All 134 Districts
          </p>
        </div>
      </section>

      <EastAfricaCityLinks country="uganda" />
    </div>
  );
}
