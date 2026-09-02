import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Power Solutions West Africa',
  description: 'Industrial power across West Africa. Nigeria oil & gas hub, Ghana gold & cocoa, Ivory Coast agro-exports. KES 150B+ sector value. 24/7 regional support. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/western',
  },
};

export default function WesternAfricaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">West Africa's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
              Oil & Gold Boom
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Nigeria (oil superpower), Ghana (gold miner), Ivory Coast (cocoa exporter), Senegal (port hub), Mali (gold rich). West Africa's economic powerhouse depends on reliable power infrastructure for mining, refining, and agricultural exports worth KES 150B+ annually.
          </p>
        </div>
      </section>

      {/* Regional Opportunity */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">West Africa's Economic Engine</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                country: '🇳🇬 Nigeria',
                focus: 'Oil & gas superpower',
                value: 'KES 80B+ annual production',
                status: 'Primary market',
              },
              {
                country: '🇬🇭 Ghana',
                focus: 'Gold & cocoa leader',
                value: 'KES 40B+ annual production',
                status: 'High growth',
              },
              {
                country: '🇨🇮 Ivory Coast',
                focus: 'Cocoa export hub',
                value: 'KES 20B+ annual exports',
                status: 'Agro specialist',
              },
              {
                country: '🇸🇳 Senegal',
                focus: 'Port & infrastructure',
                value: 'KES 10B+ regional hub',
                status: 'Growth market',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-red-400 mb-3">{item.country}</h3>
                <p className="text-sm text-gray-300 mb-3">{item.focus}</p>
                <p className="text-xs text-red-300 font-semibold mb-2">{item.value}</p>
                <p className="text-xs text-gray-400">{item.status}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Why West Africa Matters</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                '🛢️ Nigeria = African oil powerhouse (2M+ barrels/day)',
                '⛏️ Ghana = world\'s top 10 gold producers (500+ tonnes/year)',
                '🌰 Ivory Coast = 40% of world\'s cocoa production',
                '📦 Ports = regional trade hub for West Africa',
                '⚡ Power infrastructure = competitive advantage for industry',
                '💼 KES 150B+ annual sector value across region',
              ].map((item, idx) => (
                <li key={idx} className="text-gray-300 flex gap-3">
                  <span>{item.split(' ')[0]}</span>
                  <span>{item.substring(item.indexOf(' ') + 1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Key Industries */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Primary Industries</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛢️',
                title: 'Oil & Gas (Nigeria)',
                scale: 'Super-large (5000-50000 kVA)',
                priority: '🔴 Critical',
                opportunity: 'KES 80B+ sector = largest contracts on continent',
              },
              {
                icon: '⛏️',
                title: 'Gold Mining (Ghana, Mali)',
                scale: 'Large (1000-5000 kVA)',
                priority: '🟠 High',
                opportunity: 'KES 40B+ sector = proven extraction demand',
              },
              {
                icon: '🌰',
                title: 'Cocoa Processing (Ivory Coast)',
                scale: 'Medium (100-500 kVA)',
                priority: '🟡 Growing',
                opportunity: 'KES 20B+ sector = export premium positioning',
              },
              {
                icon: '📦',
                title: 'Ports & Trade',
                scale: 'Large (500-2000 kVA)',
                priority: '🟠 High',
                opportunity: 'KES 15B+ = regional trade hub infrastructure',
              },
              {
                icon: '🏭',
                title: 'Manufacturing & Refining',
                scale: 'Industrial (500-2000 kVA)',
                priority: '🟡 Growing',
                opportunity: 'KES 20B+ = value-add processing',
              },
              {
                icon: '🌾',
                title: 'Agriculture & Export',
                scale: 'Medium (50-300 kVA)',
                priority: '🟡 Growing',
                opportunity: 'KES 30B+ = commodity export volume',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-red-400 mb-2">{item.title}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><span className="font-bold">Scale:</span> {item.scale}</p>
                  <p className="text-gray-300"><span className="font-bold">Priority:</span> {item.priority}</p>
                  <p className="text-yellow-300"><span className="font-bold">Opportunity:</span> {item.opportunity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Strategy */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our West Africa Strategy</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Entry Approach</h3>
              <ul className="space-y-4">
                {[
                  'Nigerian oil & gas: Multi-megawatt industrial contracts',
                  'Ghana mining: Gold extraction power systems',
                  'Ivory Coast: Cocoa processor & exporter support',
                  'Regional: Port facilities, trade infrastructure',
                  'Distribution: Local partnerships for scaling',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-red-400 font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Competitive Advantages</h3>
              <ul className="space-y-4">
                {[
                  'African expertise: Proven in Kenya, Tanzania, Uganda, Rwanda',
                  'Industrial scale: Built systems for mining, O&G, utilities',
                  '24/7 support: Emergency response model proven across regions',
                  'Capital efficiency: Right-size solutions for West African budgets',
                  'Local partnerships: Ready to license local integrators',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-red-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">West Africa Capabilities</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Equipment</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Mega-scale generators (up to 10 MW+)</li>
                <li>✓ Oil & gas specialized systems</li>
                <li>✓ Mining industrial power</li>
                <li>✓ Port & export infrastructure</li>
                <li>✓ Remote & mobile solutions</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Services</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Multi-site coordination</li>
                <li>✓ 99.5% SLA guarantees</li>
                <li>✓ 24/7 emergency response</li>
                <li>✓ Fuel & logistics management</li>
                <li>✓ Remote monitoring systems</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-6">Strategy</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Direct contracts (large projects)</li>
                <li>✓ Local partnerships (scaling)</li>
                <li>✓ Government relationships (utilities)</li>
                <li>✓ Supply chain development</li>
                <li>✓ Regional training programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power West Africa's Growth</h2>
          <p className="text-lg text-gray-300 mb-10">
            Oil, gold, cocoa, ports — West Africa's industries need reliable power partners. We're ready to power your operation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20operate%20in%20West%20Africa%20and%20need%20industrial%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-red-500 text-red-400 font-bold rounded-lg hover:bg-red-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Nigeria • Ghana • Ivory Coast • Senegal • Mali • Burkina Faso • Guinea • Liberia • Sierra Leone
          </p>
        </div>
      </section>
    </div>
  );
}
