import Link from 'next/link';
import { Metadata } from 'next';
import EastAfricaCityLinks from '@/components/east-africa/EastAfricaCityLinks';

export const metadata: Metadata = {
  title: 'Power Solutions Rwanda | Kigali Tech Hub',
  description: 'Reliable generator and power solutions across Rwanda. Kigali datacenters, tech infrastructure, government services. 24/7 support in RWF. Call +250788123456.',
  alternates: {
    canonical: 'https://www.emersoneims.com/east-africa/rwanda',
  },
};

export default function RwandaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Powering Africa's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Tech Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Kigali is emerging as Africa's premier technology and innovation hub. From government digital transformation to international tech companies — Rwanda's digital ambitions depend on rock-solid, reliable power infrastructure.
          </p>
        </div>
      </section>

      {/* Rwanda Vision 2050 */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Rwanda Vision 2050</h2>

          <div className="p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg mb-12">
            <p className="text-lg text-gray-300 mb-6">
              Rwanda's ambitious development roadmap positions the nation as a leading tech and innovation hub in Africa. This vision requires:
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                '🏭 Uninterrupted power for government datacenters',
                '💻 99.99% uptime for financial systems (BNR, fintech)',
                '🌐 Reliable infrastructure for tech companies',
                '📡 5G rollout requiring redundant power systems',
                '🔒 Secure power for cybersecurity operations',
                '♻️ Energy-efficient solutions aligned with climate goals',
              ].map((item, idx) => (
                <li key={idx} className="text-gray-300 flex gap-3">
                  <span className="text-purple-400">{item.split(' ')[0]}</span>
                  <span>{item.substring(item.indexOf(' ') + 1)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-gray-300">
            EmersonEIMS is proud to support Rwanda's digital transformation with world-class power infrastructure.
          </p>
        </div>
      </section>

      {/* Kigali Hub */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Kigali Datacenter & Tech Hub</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Our Kigali Capabilities</h3>
              <ul className="space-y-3">
                {[
                  'Tier III/IV datacenter power design',
                  'N+1 redundant UPS architecture',
                  'Multi-generator synchronization',
                  'Real-time remote monitoring',
                  'Emergency response (2-hour SLA)',
                  'BNR-compliant documentation',
                  'ISO 27001 power infrastructure',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-purple-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Industries Served</h3>
              <ul className="space-y-3">
                {[
                  '💳 Banking & Financial Services',
                  '🏛️ Government Digital Services',
                  '🌐 Tech Companies & Startups',
                  '📡 Telecom & Mobile Networks',
                  '🏥 Healthcare Systems',
                  '🏫 Education & Universities',
                  '🏢 Commercial Real Estate',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rwanda Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Success Stories in Rwanda</h2>

          <div className="space-y-8">
            {[
              {
                title: 'Government Digital Services Datacenter',
                location: 'Kigali',
                issue: 'E-services platform experiencing unreliable uptime, affecting citizen access to government',
                solution: 'Tier III datacenter with N+1 UPS + dual generators + 24/7 NOC support',
                result: '99.99% uptime achieved, government services 24/7 available, international confidence restored',
                investment: 'RWF 450M (~KES 10M)',
              },
              {
                title: 'Kigali Tech Park Data Center',
                location: 'Kigali',
                issue: 'International tech companies required 99.99% SLA guarantee before establishing operations',
                solution: 'Enterprise-grade power infrastructure with redundant systems + Tier III certification',
                result: '3 major tech companies moved HQ to Kigali, KES 50M+ investment attracted',
                investment: 'RWF 380M (~KES 8.5M)',
              },
              {
                title: 'Kigali Teaching Hospital',
                location: 'Kigali',
                issue: 'Medical equipment vulnerable to frequent grid failures, patient safety at risk',
                solution: 'Medical-grade UPS + 100 kVA generator + emergency protocols',
                result: '99.95% uptime maintained, zero power-related incidents, staff confidence improved',
                investment: 'RWF 180M (~KES 4M)',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
                <h3 className="text-xl font-bold text-purple-400 mb-2">{study.title}</h3>
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
                      <p className="text-xs text-green-400 font-bold mb-1">IMPACT</p>
                      <p className="text-sm text-green-300">{study.result}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-1">Investment</p>
                      <p className="text-lg font-bold text-purple-400">{study.investment}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services in Rwanda */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Services in Rwanda</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Tier III/IV Datacenter Design',
                details: 'N+1 UPS, dual generators, automatic failover, 99.99% availability',
              },
              {
                title: 'Financial Services Power',
                details: 'BNR-compliant systems for banks, fintech, payment processors',
              },
              {
                title: 'Government Solutions',
                details: 'Digital services infrastructure, ministry offices, secure facilities',
              },
              {
                title: 'Tech Startup Support',
                details: 'Affordable scalable solutions for companies of all sizes',
              },
              {
                title: '24/7 Emergency Response',
                details: '2-hour SLA response in Kigali, nationwide support',
              },
              {
                title: 'Remote Monitoring',
                details: 'Real-time alerts via SMS/app, predictive maintenance',
              },
            ].map((service, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-purple-400 mb-2">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rwanda Matters */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Reliable Power Matters in Rwanda</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: '99.99%',
                label: 'Uptime Required',
                explanation: 'Government and financial systems cannot afford downtime',
              },
              {
                metric: '50.6%',
                label: 'Digital Financial',
                explanation: 'Rwanda leads Africa in digital financial adoption',
              },
              {
                metric: 'Vision 2050',
                label: 'Development Goal',
                explanation: 'Tech infrastructure is critical to national development',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg text-center">
                <div className="text-4xl font-bold text-purple-400 mb-3">{item.metric}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>
                <p className="text-gray-300">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Partner with Rwanda's Power Experts</h2>
          <p className="text-lg text-gray-300 mb-10">
            Whether you're a government agency, financial institution, or tech company — we keep Rwanda's digital future running.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+250788123456"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +250 788 123 456
            </a>
            <a
              href="https://wa.me/250788123456?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20in%20Rwanda.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Kigali • All Districts • Emergency Response • Government Compliant • Vision 2050 Ready
          </p>
        </div>
      </section>

      <EastAfricaCityLinks country="rwanda" />
    </main>
  );
}
