import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Genius Pro | Solar System Design & ROI Calculator',
  description: 'Solar system design tool. Calculate ROI, sizing, component selection for Kenya solar installations. Transparent cost analysis with real-world data.',
};

export default function SolarGeniusProPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Solar Genius Pro</h1>
          <p className="text-2xl text-gray-300 mb-8">Solar System Design & ROI Calculator</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Design the perfect solar system for your facility. Calculate ROI, sizing, component specifications, and payback periods instantly.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Solar Genius Pro</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <p className="text-5xl mb-4">📊</p>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Accurate ROI Calculation</h3>
              <p className="text-gray-300">Based on real Kenya electricity rates, weather data, and equipment costs. No guesswork—just facts.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <p className="text-5xl mb-4">🔧</p>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Component Sizing</h3>
              <p className="text-gray-300">Automatically calculates panels, batteries, inverter, charge controllers needed for your load profile.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <p className="text-5xl mb-4">💰</p>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Cost Breakdown</h3>
              <p className="text-gray-300">Transparent component costs, installation fees, maintenance budgets—see where every shilling goes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How Solar Genius Pro Works</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="text-4xl font-bold text-amber-400 flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enter Your Load Profile</h3>
                <p className="text-gray-300">How much power do you use? When? What's your current electricity bill? Tell us everything.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="text-4xl font-bold text-amber-400 flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">System Type</h3>
                <p className="text-gray-300">Grid-tied, hybrid with battery backup, or off-grid? We calculate each scenario separately.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="text-4xl font-bold text-amber-400 flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Get System Design</h3>
                <p className="text-gray-300">Receive detailed component list: solar panels (quantity, type), battery bank (kWh capacity), inverter (kW), charge controller specs.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="text-4xl font-bold text-amber-400 flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">ROI Analysis</h3>
                <p className="text-gray-300">See your payback period, monthly savings, 10-year return, and financial breakeven analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Real-World ROI Examples</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Small Office (5kWh/day)</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex justify-between"><span>System Cost:</span><span className="text-amber-400">KES 800K-1.2M</span></div>
                <div className="flex justify-between"><span>Monthly Savings:</span><span className="text-amber-400">KES 25K-40K</span></div>
                <div className="flex justify-between"><span>Payback Period:</span><span className="text-amber-400">24-36 months</span></div>
                <div className="flex justify-between"><span>10-Year Return:</span><span className="text-amber-400">KES 3-5M</span></div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Medium Factory (30kWh/day)</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex justify-between"><span>System Cost:</span><span className="text-amber-400">KES 4-6M</span></div>
                <div className="flex justify-between"><span>Monthly Savings:</span><span className="text-amber-400">KES 120K-200K</span></div>
                <div className="flex justify-between"><span>Payback Period:</span><span className="text-amber-400">20-30 months</span></div>
                <div className="flex justify-between"><span>10-Year Return:</span><span className="text-amber-400">KES 15-25M</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">System Scenarios Solar Genius Calculates</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-800/30 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Grid-Tied</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Lowest cost option</li>
                <li>✓ Feed excess to grid</li>
                <li>✓ No battery backup</li>
                <li>✓ Best ROI in 3-5 years</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/30 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Hybrid (Recommended)</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Solar + backup battery</li>
                <li>✓ Grid during night</li>
                <li>✓ Good for uncertainty</li>
                <li>✓ Payback 4-6 years</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/30 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Off-Grid</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Full independence</li>
                <li>✓ Largest battery bank</li>
                <li>✓ For remote areas</li>
                <li>✓ Highest upfront cost</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Calculate Your Solar ROI?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Get an instant system design with transparent cost breakdown and 10-year financial analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/solar-genius-pro?action=launch" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">
              Launch Solar Genius Pro
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition-all">
              Talk to Our Solar Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
