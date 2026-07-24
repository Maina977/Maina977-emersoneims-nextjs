import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generators Kenya vs EmersonEIMS | Detailed Comparison',
  description: 'Compare Generators Kenya with EmersonEIMS. Services, response times, AI tools, pricing, geographic coverage, and customer support.',
  alternates: {
    canonical: 'https://www.emersoneims.com/comparison/generators-kenya',
  },
};

export default function GeneratorsKenyaComparisonPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Generators Kenya vs</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
              EmersonEIMS
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Full comparison of Kenya's two largest integrated power solution providers.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Service Offerings Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-emerald-500/30">
                  <th className="p-4 text-left font-bold text-gray-300">Service</th>
                  <th className="p-4 text-center font-bold text-gray-300">Generators Kenya</th>
                  <th className="p-4 text-center font-bold text-emerald-400">EmersonEIMS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Generators</td>
                  <td className="p-4 text-center">✓ Yes</td>
                  <td className="p-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Solar Systems</td>
                  <td className="p-4 text-center">✓ Yes</td>
                  <td className="p-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">UPS & Battery Systems</td>
                  <td className="p-4 text-center">Limited</td>
                  <td className="p-4 text-center text-emerald-400">✓ Full range</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Borehole Pumps</td>
                  <td className="p-4 text-center">✓ Yes</td>
                  <td className="p-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Generator Automation/Controls</td>
                  <td className="p-4 text-center">✗ No</td>
                  <td className="p-4 text-center text-emerald-400">✓ Specialty service</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">HVAC/AC Systems</td>
                  <td className="p-4 text-center">✗ No</td>
                  <td className="p-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">Motor Rewinding</td>
                  <td className="p-4 text-center">✗ No</td>
                  <td className="p-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">AI Diagnostic Tools</td>
                  <td className="p-4 text-center">✗ None</td>
                  <td className="p-4 text-center text-emerald-400">✓ 4 platforms</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-400 text-sm mt-6 max-w-3xl mx-auto">
            Note: Generators Kenya focuses on generator + solar services. EmersonEIMS offers 15 integrated services including specialized areas like controls, motor rewinding, and AI diagnostics.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Geographic Coverage</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
              <h3 className="text-2xl font-bold text-slate-300 mb-6">Generators Kenya</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Nairobi</span>
                  <span className="text-gray-400">HQ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mombasa</span>
                  <span className="text-gray-400">Branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Kisumu</span>
                  <span className="text-gray-400">Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Other counties</span>
                  <span className="text-gray-400">Occasional</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-6 pt-6 border-t border-slate-700">
                Primarily Nairobi-focused with limited branches in other major cities.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">EmersonEIMS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">All 47 Kenya counties</span>
                  <span className="text-emerald-400">Nationwide</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tanzania</span>
                  <span className="text-emerald-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Uganda</span>
                  <span className="text-emerald-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rwanda</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
              <p className="text-sm text-emerald-300 mt-6 pt-6 border-t border-emerald-500/30">
                East Africa regional coverage with unified service standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Response Times</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
              <h3 className="text-xl font-bold text-slate-300 mb-4">Generators Kenya</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Nairobi Emergency Response</p>
                  <p className="text-2xl font-bold text-gray-300">24 hours typical</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Other cities</p>
                  <p className="text-2xl font-bold text-gray-300">48+ hours</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">EmersonEIMS</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm">Nairobi</p>
                  <p className="text-2xl font-bold text-emerald-400">4 hours guaranteed</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Other counties</p>
                  <p className="text-2xl font-bold text-emerald-400">8-14 hours regional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Technology & Innovation</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg">
              <h3 className="text-xl font-bold text-slate-300 mb-6">Generators Kenya</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Traditional diagnostics</li>
                <li>✓ Manual load calculations</li>
                <li>✓ Phone-based consultations</li>
                <li>✗ No AI tools</li>
                <li>✗ No remote monitoring platform</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">EmersonEIMS</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>✓ Generator Oracle (400K fault codes)</li>
                <li>✓ Solar Genius Pro (ROI calculator)</li>
                <li>✓ AquaScan Pro (borehole analysis)</li>
                <li>✓ Pro Building Suite (load design)</li>
                <li>✓ Remote monitoring capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">The Verdict</h2>

          <div className="space-y-6 text-lg text-gray-300 mb-10">
            <p>
              <strong>Generators Kenya</strong> is reliable for generator and solar work in Nairobi and major cities.
            </p>
            <p>
              <strong>EmersonEIMS is better if you need:</strong> Nationwide response (all 47 counties), 15 integrated services, AI diagnostic tools, faster emergency response, and unified East Africa presence.
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-8">
              For comprehensive power solutions nationwide = EmersonEIMS wins.
            </p>
          </div>

          <Link href="/contact" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            Talk to Our Solutions Team
          </Link>
        </div>
      </section>
    </main>
  );
}
