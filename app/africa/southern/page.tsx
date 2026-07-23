import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Power Solutions Southern Africa | Mining • Manufacturing • Utilities | South Africa Hub | EmersonEIMS',
  description: 'Reliable power across Southern Africa. South Africa mining powerhouse, Botswana diamonds, Zimbabwe gold. Industrial generators, UPS, remote monitoring. Call +27118876543.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/southern',
  },
};

export default function SouthernAfricaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Southern Africa's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
              Mining Powerhouse
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            South Africa, Botswana, Zimbabwe, Zambia — the world's richest mining regions. Gold, platinum, diamonds, copper, uranium. Mines generating KES 1T+ annual revenue depend on power infrastructure that never fails.
          </p>
        </div>
      </section>

      {/* Regional Overview */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Southern Africa's Mining Legacy</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                country: '🇿🇦 South Africa',
                profile: 'Mining superpower (gold, platinum, diamonds)',
                economy: 'KES 400B+ mining value annual',
                coverage: 'Premium (HQ location)',
              },
              {
                country: '🇧🇼 Botswana',
                profile: 'Diamond mining center',
                economy: 'KES 120B+ mining value annual',
                coverage: 'Premium (24-hour response)',
              },
              {
                country: '🇿🇼 Zimbabwe',
                profile: 'Gold & platinum extraction',
                economy: 'KES 80B+ mining value annual',
                coverage: 'Standard (48-hour response)',
              },
              {
                country: '🇿🇲 Zambia',
                profile: 'Copper belt operations',
                economy: 'KES 100B+ mining value annual',
                coverage: 'Standard (48-hour response)',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <div className="text-2xl mb-3">{item.country.split(' ')[0]}</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{item.country.substring(3)}</h3>
                <p className="text-sm text-gray-300 mb-3">{item.profile}</p>
                <p className="text-xs text-yellow-300 font-semibold mb-2">{item.economy}</p>
                <p className="text-xs text-gray-400">{item.coverage}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Why Southern Africa Matters</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                '⛏️ KES 1T+ annual mining production (25% of world minerals)',
                '💼 300+ active mine sites requiring industrial power',
                '🏭 Manufacturing & processing infrastructure competing globally',
                '📊 Mining export revenue = primary source for national budgets',
                '⚡ Power infrastructure critical to competitive positioning',
                '🌍 Global commodity prices set by Southern African volume',
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
          <h2 className="text-4xl font-bold mb-12 text-center">Industries Across Southern Africa</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '⛏️',
                title: 'Gold Mining',
                locations: 'South Africa (Witwatersrand), Zimbabwe, Zambia',
                scale: 'Super-large (5000-50000+ kVA per mine)',
                challenge: 'Deep underground operations requiring continuous power for safety & extraction',
                solution: 'Multi-megawatt power infrastructure, redundancy, remote monitoring',
              },
              {
                icon: '💎',
                title: 'Diamond Mining',
                locations: 'Botswana (Debswana), South Africa (De Beers)',
                scale: 'Large (1000-5000 kVA per mine)',
                challenge: 'Processing & security critical, 99.9% uptime required',
                solution: 'Enterprise backup systems, UPS for control, security power',
              },
              {
                icon: '🔶',
                title: 'Platinum & PGM',
                locations: 'South Africa (Rustenburg, Bushveld)',
                scale: 'Large (2000-10000 kVA per operation)',
                challenge: 'Refining process sensitive to power fluctuations',
                solution: 'Precision power + UPS + harmonic filtering',
              },
              {
                icon: '🔴',
                title: 'Copper Mining',
                locations: 'Zambia (Copper Belt), Zimbabwe',
                scale: 'Large (1000-3000 kVA per mine)',
                challenge: 'Refining requires continuous power, downtime = production loss',
                solution: 'Industrial backup systems with fuel logistics',
              },
              {
                icon: '🏭',
                title: 'Manufacturing & Refining',
                locations: 'South Africa (Johannesburg), Zimbabwe, Botswana',
                scale: 'Industrial (500-2000 kVA per facility)',
                challenge: 'Export competitive manufacturing requires 99.5% uptime',
                solution: 'Reliable backup power + solar integration',
              },
              {
                icon: '⚡',
                title: 'Utility Systems',
                locations: 'Nationwide (power stations, substations)',
                scale: 'Massive (grid support systems)',
                challenge: 'Regional power shortage = mining shutdowns',
                solution: 'Government utility support + distributed backup',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{item.title}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><span className="font-bold">Locations:</span> {item.locations}</p>
                  <p className="text-gray-300"><span className="font-bold">Scale:</span> {item.scale}</p>
                  <p className="text-red-300"><span className="font-bold">Challenge:</span> {item.challenge}</p>
                  <p className="text-green-300"><span className="font-bold">Solution:</span> {item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Southern Africa Capabilities</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">South Africa HQ</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Johannesburg office & workshop</li>
                <li>✓ Same-day response for Gauteng</li>
                <li>✓ 24/7 emergency support</li>
                <li>✓ Parts inventory & fuel supply</li>
                <li>✓ Industrial expertise network</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Equipment & Systems</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Mega-scale generators (5-10 MW)</li>
                <li>✓ Enterprise UPS systems</li>
                <li>✓ Multi-site power networks</li>
                <li>✓ Remote monitoring & control</li>
                <li>✓ Fuel management solutions</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Services & Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Multi-site deployments</li>
                <li>✓ 99.5% SLA guarantees</li>
                <li>✓ Preventive maintenance</li>
                <li>✓ Emergency response (24/7)</li>
                <li>✓ Regional coordination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Southern Africa's Mining Future</h2>
          <p className="text-lg text-gray-300 mb-10">
            From South African goldfields to Botswana diamonds to Zambian copper — we power Southern Africa's mining dominance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+27118876543"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +27 11 888 7654 (South Africa)
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20operate%20a%20mining%20facility%20in%20Southern%20Africa%20and%20need%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-bold rounded-lg hover:bg-yellow-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            South Africa • Botswana • Zimbabwe • Zambia • Namibia • Eswatini • Lesotho
          </p>
        </div>
      </section>
    </main>
  );
}
