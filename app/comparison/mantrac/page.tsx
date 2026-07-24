import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mantrac vs EmersonEIMS | Equipment Sales vs Solutions Provider',
  description: 'Compare Mantrac Kenya with EmersonEIMS. Service model, equipment range, support quality, and ROI analysis.',
  alternates: {
    canonical: 'https://www.emersoneims.com/comparison/mantrac',
  },
};

export default function MantracComparisonPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Mantrac Kenya vs</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              EmersonEIMS
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Equipment distributor vs integrated solutions provider. Understand the difference for your business.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Business Model Comparison</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
              <h3 className="text-2xl font-bold text-slate-300 mb-6">Mantrac: Equipment Distributor</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-300">Primary Focus:</p>
                  <p className="text-sm text-gray-400">Sell Caterpillar, PerkinS equipment</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Their Role:</p>
                  <p className="text-sm text-gray-400">Equipment vendor (dealers only)</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Installation:</p>
                  <p className="text-sm text-gray-400">Refer to approved installers</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Support:</p>
                  <p className="text-sm text-gray-400">Limited to warranty period</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">EmersonEIMS: Solutions Partner</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-300">Primary Focus:</p>
                  <p className="text-sm text-cyan-300">Solve your power & facility problems</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Our Role:</p>
                  <p className="text-sm text-cyan-300">Design, install, maintain, optimize</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Installation:</p>
                  <p className="text-sm text-cyan-300">In-house by certified technicians</p>
                </div>
                <div>
                  <p className="font-bold text-gray-300">Support:</p>
                  <p className="text-sm text-cyan-300">Lifetime (maintenance contracts)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="p-4 text-left font-bold text-gray-300">Factor</th>
                  <th className="p-4 text-center font-bold">Mantrac</th>
                  <th className="p-4 text-center font-bold text-cyan-400">EmersonEIMS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Equipment Brand Range</td>
                  <td className="p-4 text-center">Caterpillar, Perkins only</td>
                  <td className="p-4 text-center text-cyan-400">15+ brands</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Installation Services</td>
                  <td className="p-4 text-center">Refer elsewhere</td>
                  <td className="p-4 text-center text-cyan-400">In-house certified</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Design Consultation</td>
                  <td className="p-4 text-center">Limited</td>
                  <td className="p-4 text-center text-cyan-400">Comprehensive</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Maintenance Contracts</td>
                  <td className="p-4 text-center">Warranty only</td>
                  <td className="p-4 text-center text-cyan-400">Lifetime support</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Emergency Response</td>
                  <td className="p-4 text-center">24-48 hours</td>
                  <td className="p-4 text-center text-cyan-400">4-12 hours</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">AI Diagnostic Tools</td>
                  <td className="p-4 text-center">✗ None</td>
                  <td className="p-4 text-center text-cyan-400">✓ 4 platforms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Real-World Scenario</h2>

          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
            <h3 className="text-2xl font-bold mb-8">Scenario: Your generator failed. You need a new one.</h3>

            <div className="space-y-8">
              <div>
                <p className="font-bold text-cyan-400 mb-3">🏢 With Mantrac:</p>
                <div className="space-y-2 text-gray-300 ml-4">
                  <p>1. Call Mantrac → They quote you equipment only</p>
                  <p>2. Buy generator from them (price negotiation)</p>
                  <p>3. They refer you to an installer</p>
                  <p>4. Call installer → separate quote</p>
                  <p>5. Coordinate between two vendors (communication chaos)</p>
                  <p>6. After installation → no maintenance relationship</p>
                  <p>7. When it breaks → call Mantrac or the installer? Confusion.</p>
                  <p className="text-red-400 font-bold mt-4">Result: Higher total cost, slower delivery, confusion on who's responsible</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-cyan-400 mb-3">✓ With EmersonEIMS:</p>
                <div className="space-y-2 text-gray-300 ml-4">
                  <p>1. Call us → We assess your facility</p>
                  <p>2. Design the right solution (sizing, brand, placement)</p>
                  <p>3. Quote includes equipment + installation + commissioning</p>
                  <p>4. Our team does the installation (one vendor, one point of contact)</p>
                  <p>5. Maintenance contract available (KES 40K-300K/month)</p>
                  <p>6. When it breaks → call us (we service what we installed)</p>
                  <p className="text-emerald-400 font-bold mt-4">Result: One-stop solution, faster, clearer accountability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Total Cost of Ownership</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
              <h3 className="text-lg font-bold text-slate-300 mb-6">Mantrac Path</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Generator (100 kVA):</span>
                  <span className="text-gray-400">KES 2.5M</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation (external):</span>
                  <span className="text-gray-400">+KES 500K-800K</span>
                </div>
                <div className="flex justify-between">
                  <span>Coordination/delays:</span>
                  <span className="text-gray-400">+KES 200K (lost time)</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance (DIY):</span>
                  <span className="text-gray-400">+KES 30K-50K/month</span>
                </div>
                <div className="border-t border-slate-600 pt-3 mt-3 flex justify-between font-bold">
                  <span>3-Year Total:</span>
                  <span>KES 4.1M+</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-6">EmersonEIMS Path</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Design + Equipment:</span>
                  <span className="text-cyan-400">KES 2.5M</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation (included):</span>
                  <span className="text-cyan-400">+KES 400K</span>
                </div>
                <div className="flex justify-between">
                  <span>Commissioning:</span>
                  <span className="text-cyan-400">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance (contract):</span>
                  <span className="text-cyan-400">KES 40K-60K/month</span>
                </div>
                <div className="border-t border-cyan-600 pt-3 mt-3 flex justify-between font-bold">
                  <span>3-Year Total:</span>
                  <span className="text-cyan-400">KES 3.7M</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-center mt-8 max-w-3xl mx-auto">
            EmersonEIMS saves you KES 400K+ over 3 years through unified vendor relationship, included installation, and structured maintenance.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">When Mantrac Makes Sense</h2>

          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg max-w-3xl mx-auto">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-slate-400">•</span>
                <span>If you want to buy just equipment (you have your own installer)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400">•</span>
                <span>If you prefer Cat/Perkins brand exclusively</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400">•</span>
                <span>If you want lowest equipment price (ignoring total cost)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">The Verdict</h2>

          <p className="text-lg text-gray-300 mb-8">
            <strong>Mantrac is a quality equipment distributor.</strong> But if you want installation, design, maintenance, and unified support—EmersonEIMS is the better partner.
          </p>

          <p className="text-2xl font-bold text-cyan-400 mb-10">
            One vendor, one contact, complete solution = EmersonEIMS advantage.
          </p>

          <Link href="/contact" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            Get a Complete Power Solution Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
