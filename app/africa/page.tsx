import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Africa Power Infrastructure | Mining • Oil & Gas • Utilities • EmersonEIMS',
  description: 'Powering Africa\'s growth. Mining operations, oil & gas exploration, utility backup systems, infrastructure development. 10+ countries, 99.5%+ uptime guaranteed. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa',
  },
};

export default function AfricaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Powering</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
              Africa's Infrastructure
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Africa's infrastructure boom demands world-class power solutions. From mines in the Sahara to oil platforms offshore, from mega-dams to 5G rollouts — EmersonEIMS powers the continent's growth with 99.5%+ uptime guarantee.
          </p>
        </div>
      </section>

      {/* Africa Opportunity */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Infrastructure Boom</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-4xl mb-4">⛏️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Mining Dominance</h3>
              <p className="text-gray-300">Africa produces 30% of world's minerals. Gold, diamonds, cobalt, lithium operations need 99.5%+ uptime. KES 50M-500M contract value per site.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-4xl mb-4">🛢️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Oil & Gas Growth</h3>
              <p className="text-gray-300">New fields in Kenya, Mozambique, Tanzania. Exploration rigs, processing plants, export infrastructure. KES 100M-1B contracts per project.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Energy Crisis</h3>
              <p className="text-gray-300">Africa's power deficit = KES 5T+ annual economic loss. Governments, utilities, industries all need backup. Massive TAM = massive opportunity.</p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Why Africa Matters</h3>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
              <li>✓ 1.4 billion people (fastest growing continent)</li>
              <li>✓ 54 countries = 54 markets to penetrate</li>
              <li>✓ Mining sector = KES 5T+ annual value</li>
              <li>✓ Oil & gas = KES 2T+ annual discoveries</li>
              <li>✓ Infrastructure = KES 1T+ annual government spend</li>
              <li>✓ Power deficit = KES 50B+ annual losses to industry</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Industries Across Africa */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Major Industries Across Africa</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '⛏️',
                title: 'Mining & Extraction',
                desc: 'Gold, diamonds, cobalt, lithium, copper',
                value: 'KES 50M-500M per site',
                regions: 'South Africa, DRC, Ghana, Mali, Zambia, Zimbabwe',
              },
              {
                icon: '🛢️',
                title: 'Oil & Gas',
                desc: 'Exploration, production, processing, export',
                value: 'KES 100M-1B per project',
                regions: 'Kenya, Nigeria, Angola, Mozambique, Sudan',
              },
              {
                icon: '⚡',
                title: 'Utilities & Power',
                desc: 'Water treatment, substations, renewable integration',
                value: 'KES 500M-5B per grid system',
                regions: 'All 54 countries (primary buyer)',
              },
              {
                icon: '🏗️',
                title: 'Infrastructure',
                desc: 'Roads, dams, ports, airports, telecom towers',
                value: 'KES 200M-2B per project',
                regions: 'Pan-Africa (Chinese belt-and-road focus)',
              },
              {
                icon: '🥬',
                title: 'Agro-Industrial',
                desc: 'Coffee, cocoa, tea mills, grain storage, export',
                value: 'KES 50M-200M per facility',
                regions: 'West Africa (Ghana, Ivory Coast), East Africa',
              },
              {
                icon: '🏭',
                title: 'Manufacturing',
                desc: 'Textiles, steel, chemicals, food processing',
                value: 'KES 20M-500M per plant',
                regions: 'South Africa, Egypt, Kenya, Nigeria, Ethiopia',
              },
            ].map((industry, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{industry.title}</h3>
                <p className="text-sm text-gray-300 mb-3">{industry.desc}</p>
                <p className="text-sm text-yellow-300 font-semibold mb-2">💰 {industry.value}</p>
                <p className="text-xs text-gray-400">📍 {industry.regions}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Hubs */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's 5 Regional Markets</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* East Africa */}
            <Link
              href="/east-africa"
              className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg hover:border-green-400/50 transition-all"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-4">🌍 East Africa</h3>
              <p className="text-gray-300 mb-4">Kenya (HQ), Tanzania, Uganda, Rwanda. Tech boom, mining expansion, manufacturing growth.</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Kenya: Market leader (90/100)</li>
                <li>✓ Tanzania: Mining specialist</li>
                <li>✓ Uganda: Tech hub expert</li>
                <li>✓ Rwanda: Datacenter focus</li>
              </ul>
            </Link>

            {/* Southern Africa */}
            <Link
              href="/africa/southern"
              className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg hover:border-blue-400/50 transition-all"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-4">🌍 Southern Africa</h3>
              <p className="text-gray-300 mb-4">South Africa, Botswana, Zimbabwe, Zambia. Mining powerhouse, manufacturing, utilities.</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ South Africa: Mining hub</li>
                <li>✓ Botswana: Diamond ops</li>
                <li>✓ Zimbabwe: Gold specialist</li>
                <li>✓ Zambia: Copper ops</li>
              </ul>
            </Link>

            {/* West Africa */}
            <Link
              href="/africa/west"
              className="p-8 bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg hover:border-orange-400/50 transition-all"
            >
              <h3 className="text-2xl font-bold text-orange-400 mb-4">🌍 West Africa</h3>
              <p className="text-gray-300 mb-4">Nigeria, Ghana, Ivory Coast, Senegal. Oil & gas boom, agro-industrial exports, fastest growth.</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Nigeria: Oil & gas focus</li>
                <li>✓ Ghana: Gold mining</li>
                <li>✓ Ivory Coast: Cocoa export</li>
                <li>✓ Senegal: Port development</li>
              </ul>
            </Link>

            {/* Central Africa */}
            <Link
              href="/africa/central"
              className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🌍 Central Africa</h3>
              <p className="text-gray-300 mb-4">DRC, Congo, Cameroon, Gabon. Mineral wealth, logging, hydropower, infrastructure boom.</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ DRC: Cobalt/copper hub</li>
                <li>✓ Congo: Oil producer</li>
                <li>✓ Cameroon: Hydro integration</li>
                <li>✓ Gabon: Oil & timber</li>
              </ul>
            </Link>

            {/* North Africa */}
            <div className="md:col-span-2">
              <Link
                href="/africa/north"
                className="p-8 bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/30 rounded-lg hover:border-indigo-400/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-indigo-400 mb-4">🌍 North Africa</h3>
                <p className="text-gray-300 mb-4">Egypt, Morocco, Algeria, Tunisia, Libya. Mediterranean trade, renewable energy integration, government infrastructure.</p>
                <ul className="text-sm text-gray-400 space-y-2 grid md:grid-cols-2">
                  <li>✓ Egypt: Suez + Nile infrastructure</li>
                  <li>✓ Morocco: Solar + renewable</li>
                  <li>✓ Algeria: Oil & gas powerhouse</li>
                  <li>✓ Tunisia: Manufacturing & tourism</li>
                </ul>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why EmersonEIMS Wins Across Africa</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                competitor: 'Aggreko (Global)',
                weakness: 'Expensive rental model, slow delivery, no local support',
                ourEdge: 'Sales + service in 10+ countries, local teams, competitive pricing',
              },
              {
                competitor: 'Caterpillar (Direct)',
                weakness: 'Equipment only, no ongoing support, long sales cycles',
                ourEdge: 'Full lifecycle: sales, installation, maintenance, emergencies',
              },
              {
                competitor: 'Siemens (Enterprise)',
                weakness: 'Premium pricing, focus on mega-projects, abandons SMB',
                ourEdge: 'All sizes welcome: KES 500K to KES 500M solutions',
              },
              {
                competitor: 'Local Competitors',
                weakness: 'Single-country presence, no SLA guarantees, limited expertise',
                ourEdge: 'Multi-country reach, contractual SLAs, proven track record',
              },
              {
                competitor: 'Chinese Suppliers',
                weakness: 'No after-sales support, warranty disputes, quality variance',
                ourEdge: 'Engineering partnership model, real warranties, quality assurance',
              },
              {
                competitor: 'Grid-Only Approach',
                weakness: 'Dangerous assumption in Africa, power cuts = revenue loss',
                ourEdge: 'Backup-first philosophy, 99.5%+ uptime guarantee',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">{item.competitor}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">WEAKNESS</p>
                    <p className="text-sm text-gray-300">{item.weakness}</p>
                  </div>
                  <div>
                    <p className="text-xs text-yellow-400 font-bold mb-1">OUR EDGE</p>
                    <p className="text-sm text-yellow-300">{item.ourEdge}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Across Africa */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Capabilities Across Africa</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Equipment & Systems</h3>
              <ul className="space-y-3">
                {[
                  'Generators 20 kVA to 2000 kVA (all major brands)',
                  'UPS & battery backup systems (all grades)',
                  'Solar & hybrid renewable systems',
                  'ATS/automatic changeover panels',
                  'Voltage stabilizers & power conditioning',
                  'Distribution infrastructure',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-yellow-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Services & Support</h3>
              <ul className="space-y-3">
                {[
                  'Professional installation & commissioning',
                  'Preventive maintenance contracts',
                  '24/7 emergency response (where established)',
                  'Fuel management & logistics',
                  'Remote monitoring & diagnostics',
                  'Genuine parts supply & warranties',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-yellow-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Africa's Future</h2>
          <p className="text-lg text-gray-300 mb-10">
            Mining operations, oil & gas projects, utilities, infrastructure — Africa's growth depends on reliable power. We're here for the journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20for%20my%20African%20operations.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-bold rounded-lg hover:bg-yellow-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            East Africa • Southern Africa • West Africa • Central Africa • North Africa
          </p>
        </div>
      </section>
    </div>
  );
}
