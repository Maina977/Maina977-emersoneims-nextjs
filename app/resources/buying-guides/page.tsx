
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Buying Guide | Sizing, Brands, Maintenance | EmersonEIMS',
  description: 'Complete generator buying guide: how to size a generator, brand comparison, new vs used, generator selection worksheet, ROI calculator.',
  alternates: {
    canonical: 'https://www.emersoneims.com/resources/buying-guides',
  },
};

export default function BuyingGuidesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How to Choose the Right
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Generator
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expert guidance on generator selection, sizing, brand comparison, and total cost of ownership analysis.
          </p>
        </div>
      </section>

      {/* Sizing Guide */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Generator Sizing 101</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-slate-900/50 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Step 1: Calculate Your Load</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>List all equipment:</strong> Add up wattage ratings of all devices that will run simultaneously.
                </p>
                <div className="p-4 bg-slate-800/50 rounded">
                  <p className="font-semibold mb-2">Example: Office Building</p>
                  <ul className="space-y-1 text-sm">
                    <li>• 10 computers × 300W = 3,000W</li>
                    <li>• Lighting (20 bulbs) = 2,000W</li>
                    <li>• AC system = 5,000W</li>
                    <li>• Water pump = 1,500W</li>
                    <li>• Total = 11,500W</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Add 20-30% buffer for future expansion and power surges.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-900/50 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Step 2: Account for Motor Starting</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Motor starting is expensive:</strong> Motors draw 3-7× rated power when starting.
                </p>
                <div className="p-4 bg-slate-800/50 rounded">
                  <p className="font-semibold mb-2">Example: 5.5 kW Air Compressor</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Running power = 5.5 kW</li>
                    <li>• Starting power = 5.5 kW × 5 = 27.5 kW</li>
                    <li>• Required generator: 30+ kVA</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Don't run multiple motors simultaneously on one generator.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { load: 'Small Residential', power: '10-20 kVA', examples: 'Home backup, small office' },
              { load: 'Medium Commercial', power: '30-100 kVA', examples: 'Retail shop, clinic, workshop' },
              { load: 'Industrial', power: '100-500 kVA', examples: 'Factory, hospital, data center' },
            ].map((cat, i) => (
              <div key={i} className="p-6 border border-slate-700 rounded-lg hover:border-cyan-500 transition">
                <h4 className="text-lg font-bold text-cyan-400 mb-3">{cat.load}</h4>
                <p className="text-2xl font-bold text-white mb-3">{cat.power}</p>
                <p className="text-gray-300 text-sm">{cat.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Comparison */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Generator Brand Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-cyan-400">Brand</th>
                  <th className="text-center p-4 text-cyan-400">Fuel Economy</th>
                  <th className="text-center p-4 text-cyan-400">Reliability</th>
                  <th className="text-center p-4 text-cyan-400">Cost</th>
                  <th className="text-center p-4 text-cyan-400">Service Network</th>
                  <th className="text-left p-4 text-cyan-400">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    brand: 'Cummins',
                    fuel: '⭐⭐⭐⭐',
                    reliability: '⭐⭐⭐⭐⭐',
                    cost: '⭐⭐⭐',
                    service: 'Global',
                    best: 'Industrial, Mission-critical',
                  },
                  {
                    brand: 'Perkins',
                    fuel: '⭐⭐⭐⭐⭐',
                    reliability: '⭐⭐⭐⭐',
                    cost: '⭐⭐⭐',
                    service: 'Global',
                    best: 'Commercial, Budget-conscious',
                  },
                  {
                    brand: 'Caterpillar',
                    fuel: '⭐⭐⭐',
                    reliability: '⭐⭐⭐⭐⭐',
                    cost: '⭐⭐',
                    service: 'Global',
                    best: 'Heavy-duty, Mining',
                  },
                  {
                    brand: 'Volvo Penta',
                    fuel: '⭐⭐⭐⭐',
                    reliability: '⭐⭐⭐⭐',
                    cost: '⭐⭐',
                    service: 'Limited',
                    best: 'Modern controls, Containers',
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="p-4 font-bold text-white">{row.brand}</td>
                    <td className="p-4 text-center">{row.fuel}</td>
                    <td className="p-4 text-center">{row.reliability}</td>
                    <td className="p-4 text-center">{row.cost}</td>
                    <td className="p-4 text-center text-gray-300 text-sm">{row.service}</td>
                    <td className="p-4 text-gray-300 text-sm">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* New vs Used */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">New vs Pre-Owned Generators</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-900/50 rounded-lg border border-green-700/50">
              <h3 className="text-2xl font-bold text-green-400 mb-6">✓ New Generators</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="font-semibold text-green-400">Advantages</p>
                  <ul className="space-y-2 text-sm mt-2">
                    <li>• Full manufacturer warranty (3-5 years)</li>
                    <li>• Zero operating hours</li>
                    <li>• Latest engine technology</li>
                    <li>• Customizable options</li>
                    <li>• Financing options available</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-orange-400">Disadvantages</p>
                  <ul className="space-y-2 text-sm mt-2">
                    <li>• Higher initial cost</li>
                    <li>• Longer delivery time</li>
                    <li>• May not need full capacity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900/50 rounded-lg border border-blue-700/50">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">✓ Pre-Owned Generators</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="font-semibold text-blue-400">Advantages</p>
                  <ul className="space-y-2 text-sm mt-2">
                    <li>• 30-50% cost savings</li>
                    <li>• Immediate availability</li>
                    <li>• Proven reliability if serviced</li>
                    <li>• Good for spare/backup use</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-orange-400">Disadvantages</p>
                  <ul className="space-y-2 text-sm mt-2">
                    <li>• Limited warranty (6-12 months)</li>
                    <li>• Unknown operating history</li>
                    <li>• May need repairs soon</li>
                    <li>• No customization possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-cyan-900/20 rounded-lg border border-cyan-500/50">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">EmersonEIMS Pre-Owned Standards</h4>
            <p className="text-gray-300 mb-4">
              Every pre-owned unit purchased through EmersonEIMS undergoes:
            </p>
            <ul className="grid md:grid-cols-3 gap-4 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Complete inspection by factory-trained technician</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Load bank testing for full power output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Oil, filter, and fluid replacement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Paint and cosmetic refurbishment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>1-year comprehensive warranty</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Free delivery and installation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TCO Calculator */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Total Cost of Ownership</h2>

          <p className="text-lg text-gray-300 mb-8 max-w-3xl">
            Don't just compare purchase price. Calculate total costs over 10 years including fuel, maintenance, repairs, and replacement parts.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                factor: 'Capital Cost',
                desc: 'Initial purchase price including installation and commissioning',
                impact: '15-20% of total',
              },
              {
                factor: 'Fuel Costs',
                desc: 'Daily fuel consumption at typical load levels across lifespan',
                impact: '40-50% of total',
              },
              {
                factor: 'Maintenance',
                desc: 'Regular servicing, filter changes, and preventive maintenance',
                impact: '15-20% of total',
              },
              {
                factor: 'Repairs',
                desc: 'Unexpected breakdowns and component failures',
                impact: '10-15% of total',
              },
              {
                factor: 'Parts',
                desc: 'Replacement parts, batteries, and rebuild components',
                impact: '5-10% of total',
              },
              {
                factor: 'Downtime',
                desc: 'Business losses during generator failure',
                impact: 'Highly variable',
              },
            ].map((factor, i) => (
              <div key={i} className="p-6 border border-slate-700 rounded-lg">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">{factor.factor}</h4>
                <p className="text-gray-300 text-sm mb-3">{factor.desc}</p>
                <p className="text-sm text-orange-400 font-semibold">{factor.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Generator?</h2>
          <p className="text-lg text-gray-200 mb-10">
            Our specialists will help you select the ideal solution for your needs and budget.
          </p>
          <Link
            href="/contact?type=generator-consultation"
            className="inline-block px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Start Your Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
