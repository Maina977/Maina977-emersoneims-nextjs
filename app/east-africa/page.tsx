import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'East Africa Power Solutions | Kenya • Tanzania • Uganda • Rwanda | EmersonEIMS',
  description: 'Regional power infrastructure across East Africa. Generators, UPS, solar, ATS for hospitals, factories, telecoms, and government. Kenya HQ, expanding across the region. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/east-africa',
  },
};

export default function EastAfricaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Powering East Africa</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
              Kenya • Tanzania • Uganda • Rwanda
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            One of the world's fastest-growing regions. Hospitals saving lives. Factories meeting deadlines. Telecoms connecting millions. Governments delivering services. All powered by reliable infrastructure.
          </p>
        </div>
      </section>

      {/* Regional Stats */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">East Africa Market Opportunity</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Kenya', value: '47 Counties', color: 'from-red-500 to-orange-600' },
              { label: 'Tanzania', value: '31 Regions', color: 'from-green-500 to-emerald-600' },
              { label: 'Uganda', value: '134 Districts', color: 'from-blue-500 to-cyan-600' },
              { label: 'Rwanda', value: '5 Provinces', color: 'from-purple-500 to-pink-600' },
            ].map((item, idx) => (
              <div key={idx} className={`p-6 bg-gradient-to-br ${item.color} rounded-lg text-center`}>
                <p className="text-sm text-white/80 mb-2">{item.label}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Region at a Glance</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-gray-300">✓ 200+ million population (growing 3% annually)</p>
                <p className="text-gray-300">✓ Africa's tech hub (Kampala, Kigali)</p>
                <p className="text-gray-300">✓ Massive mining & agricultural exports</p>
                <p className="text-gray-300">✓ Telecom coverage race (99% 4G target)</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300">✓ Healthcare infrastructure boom</p>
                <p className="text-gray-300">✓ Government digital transformation</p>
                <p className="text-gray-300">✓ Real estate & construction surge</p>
                <p className="text-gray-300">✓ Manufacturing competitiveness race</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country Hubs */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Country Hubs & Coverage</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kenya */}
            <Link
              href="/industries"
              className="p-8 bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg hover:border-red-400/50 transition-all hover:bg-red-900/40"
            >
              <div className="text-4xl mb-4">🇰🇪</div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Kenya</h3>
              <p className="text-gray-300 mb-4">
                EmersonEIMS HQ. 11+ years operating across all 47 counties. Proven expertise in healthcare, manufacturing, telecom, hospitality, and real estate.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Same-day delivery in Nairobi</li>
                <li>✓ 47-county coverage guaranteed</li>
                <li>✓ 2-4 hour emergency response</li>
                <li>✓ 500+ installations in healthcare alone</li>
              </ul>
              <p className="mt-6 text-red-400 font-bold">Explore Kenya Services →</p>
            </Link>

            {/* Tanzania */}
            <Link
              href="/east-africa/tanzania"
              className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg hover:border-green-400/50 transition-all hover:bg-green-900/40"
            >
              <div className="text-4xl mb-4">🇹🇿</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Tanzania</h3>
              <p className="text-gray-300 mb-4">
                Rapid industrial growth. Dar es Salaam factories, Arusha healthcare boom, Mbeya mining expansion. We're scaling presence across all 31 regions.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Dar es Salaam premium response</li>
                <li>✓ Mining operations specialists</li>
                <li>✓ TZS pricing & local support</li>
                <li>✓ Regional expansion ongoing</li>
              </ul>
              <p className="mt-6 text-green-400 font-bold">Explore Tanzania →</p>
            </Link>

            {/* Uganda */}
            <Link
              href="/east-africa/uganda"
              className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg hover:border-blue-400/50 transition-all hover:bg-blue-900/40"
            >
              <div className="text-4xl mb-4">🇺🇬</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Uganda</h3>
              <p className="text-gray-300 mb-4">
                Africa's tech boom. Kampala startup ecosystem, Jinja manufacturing hub, nationwide telecom expansion. UGX pricing, local expertise, rapid growth.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Kampala tech startup specialists</li>
                <li>✓ Jinja industrial expert network</li>
                <li>✓ UGX pricing & payment options</li>
                <li>✓ 4-hour emergency response</li>
              </ul>
              <p className="mt-6 text-blue-400 font-bold">Explore Uganda →</p>
            </Link>

            {/* Rwanda */}
            <Link
              href="/east-africa/rwanda"
              className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all hover:bg-purple-900/40"
            >
              <div className="text-4xl mb-4">🇷🇼</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">Rwanda</h3>
              <p className="text-gray-300 mb-4">
                Powering Rwanda's digital future. Kigali datacenter expertise, Vision 2050 alignment, government digital transformation support.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Tier III/IV datacenter design</li>
                <li>✓ 99.99% uptime SLA capability</li>
                <li>✓ RWF pricing available</li>
                <li>✓ Government solutions specialist</li>
              </ul>
              <p className="mt-6 text-purple-400 font-bold">Explore Rwanda →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-Border Capabilities */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose EmersonEIMS for East Africa</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">Regional Advantages</h3>
              <ul className="space-y-3">
                {[
                  'Single partner across 4 countries',
                  'Consistent quality & standards',
                  'Multi-currency pricing (KES, TZS, UGX, RWF)',
                  'Coordinated regional rollouts',
                  'Shared spare parts network',
                  'Regional knowledge hub',
                  'Cross-border support capability',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">What We Deliver</h3>
              <ul className="space-y-3">
                {[
                  'Generators (20 kVA to 2000 kVA)',
                  'UPS & battery backup systems',
                  'Solar & hybrid solutions',
                  'ATS/changeover automation',
                  'Preventive maintenance contracts',
                  '24/7 emergency support',
                  'Remote monitoring & analytics',
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Industries */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Industries Across East Africa</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏥', title: 'Healthcare', desc: 'Hospitals, clinics, diagnostics across all countries' },
              { icon: '🏭', title: 'Manufacturing', desc: 'Textiles, steel, food processing, assembly' },
              { icon: '📡', title: 'Telecom', desc: '99.7% tower uptime guarantee, national coverage' },
              { icon: '⛏️', title: 'Mining & Extraction', desc: 'Gold, tanzanite, gemstones operations' },
              { icon: '🌾', title: 'Agriculture & Processing', desc: 'Mills, farms, exporters, cold chain' },
              { icon: '🏢', title: 'Commercial Real Estate', desc: 'Offices, malls, residential towers' },
              { icon: '💳', title: 'Banking & Finance', desc: 'SLA-backed systems for 99.99% availability' },
              { icon: '💻', title: 'Tech & Startups', desc: 'Kampala, Kigali datacenter specialists' },
              { icon: '🏛️', title: 'Government', desc: 'Digital transformation, all 4 countries' },
            ].map((industry, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
                <div className="text-3xl mb-3">{industry.icon}</div>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">{industry.title}</h3>
                <p className="text-sm text-gray-300">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Hubs */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Get in Touch</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                country: 'Kenya',
                phone: '+254 768 860 665',
                currency: 'KES',
                response: 'Same-day',
              },
              {
                country: 'Tanzania',
                phone: '+255 754 411 722',
                currency: 'TZS',
                response: '24-48 hrs',
              },
              {
                country: 'Uganda',
                phone: '+256 701 234 567',
                currency: 'UGX',
                response: '4-6 hrs',
              },
              {
                country: 'Rwanda',
                phone: '+250 788 123 456',
                currency: 'RWF',
                response: '2 hrs',
              },
            ].map((contact, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-2">{contact.country}</p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-all mb-3 block"
                >
                  {contact.phone}
                </a>
                <p className="text-xs text-gray-400 mb-2">{contact.currency} Pricing</p>
                <p className="text-xs text-green-400 font-semibold">↓ {contact.response} Response</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Powering East Africa's Growth</h2>
          <p className="text-lg text-gray-300 mb-10">
            One region. One trusted partner. Unlimited possibilities.
          </p>

          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
          >
            Get Regional Proposal
          </Link>
        </div>
      </section>
    </main>
  );
}
