import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Fuel Efficiency: 5 Ways to Reduce Operating Costs',
  description: 'Lower generator fuel consumption. Load sizing, regular maintenance, proper operation. Save 20-40% on fuel bills.',
};

export default function GeneratorFuelEfficiencyBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-orange-400 hover:text-orange-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Generator Fuel Efficiency: 5 Ways to Reduce Operating Costs</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 6 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Your generator costs KES 60K/month in fuel. You accept it as "cost of backup power." But what if half that was wasted through poor efficiency?
          </p>

          <p>
            Most generators waste 20-40% of fuel through oversizing, poor maintenance, and inefficient operation. Simple fixes drop fuel costs to KES 35-40K/month. Here's how.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Fix #1: Right-Sized Generator (Not Oversized)</h2>

          <p>
            Oversized generator = wasted fuel. A 50 kVA generator running 20 kVA load burns 40% more fuel than a 25 kVA unit at the same load.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Test your actual peak load (real data, not guesswork). If you run 20 kVA peak, buy 25-30 kVA generator, not 50 kVA "just in case."
          </p>

          <p className="mt-3">
            <strong>Savings:</strong> 15-25% fuel reduction
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Fix #2: Run at Optimal Load (70-80% Capacity)</h2>

          <p>
            Generators are most efficient at 70-80% of rated capacity. Running at 30% load = poor efficiency. Running at 100% load = engine stress and overheating.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Schedule high-power tasks for generator runtime. Consolidate loads. Avoid idle running at low load.
          </p>

          <p className="mt-3">
            <strong>Savings:</strong> 10-20% fuel reduction
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Fix #3: Monthly Maintenance (Oil, Filters, Fuel)</h2>

          <p>
            Dirty oil = higher friction = wasted fuel. Clogged filters = inefficient combustion. Bad fuel = poor starting and performance.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Oil change every 100-200 operating hours. Air filter cleaning monthly. Fuel filter replacement annually. Use quality diesel.
          </p>

          <p className="mt-3">
            <strong>Savings:</strong> 8-15% fuel reduction + extended engine life
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Fix #4: Governor Calibration</h2>

          <p>
            Generator governor controls engine speed based on load. Mis-calibrated governor runs engine too fast (wastes fuel) or too slow (causes problems).
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Technician test and calibrate governor under actual load conditions. Should hold speed within ±5% of rated.
          </p>

          <p className="mt-3">
            <strong>Savings:</strong> 5-12% fuel reduction
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Fix #5: Avoid Idle Running</h2>

          <p>
            Generator running with no load (idle) still burns fuel but produces no value. Common mistake: leaving it running "just in case."
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Turn off generator when not needed. In standby mode (off but ready), uses zero fuel. Start it only when power actually required.
          </p>

          <p className="mt-3">
            <strong>Savings:</strong> 20-30% fuel reduction (if you were idling frequently)
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real Savings Example</h2>

          <div className="bg-slate-800/50 border border-orange-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-orange-400 mb-4">Manufacturing Facility, 20 kVA Generator</p>
            <div className="space-y-3 text-sm">
              <p><strong>Current:</strong> 50 kVA unit (oversized), poor maintenance, idle running</p>
              <div className="flex justify-between"><span>Monthly fuel cost:</span><span>KES 80K</span></div>
              <div className="flex justify-between"><span>Annual cost:</span><span>KES 960K</span></div>

              <p className="mt-3"><strong>After implementing 5 fixes:</strong></p>
              <div className="flex justify-between"><span>Right size (25 kVA):</span><span>-20% fuel</span></div>
              <div className="flex justify-between"><span>Optimal load + no idle:</span><span>-25% fuel</span></div>
              <div className="flex justify-between"><span>Maintenance + calibration:</span><span>-12% fuel</span></div>
              <div className="flex justify-between"><span>Combined reduction:</span><span>-40%+ fuel</span></div>

              <div className="border-t border-slate-600 pt-3 mt-3 flex justify-between font-bold">
                <span>New monthly cost:</span><span className="text-orange-400">KES 48K</span>
              </div>
              <div className="border-t border-slate-600 pt-1 flex justify-between font-bold">
                <span>Annual savings:</span><span className="text-orange-400">KES 384K</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Monitoring Fuel Efficiency</h2>

          <p>
            <strong>Track these metrics:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li>Fuel consumption per operating hour (litres/hour)</li>
            <li>Average generator load (should be 70-80%)</li>
            <li>Hours per month (if increasing, investigate why)</li>
            <li>Oil condition (pressure, temperature)</li>
          </ul>

          <p className="mt-3">
            <strong>Warning signs of poor efficiency:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li>Fuel consumption increasing without load increase</li>
            <li>Black smoke from exhaust (incomplete combustion)</li>
            <li>Difficulty starting or rough running</li>
            <li>Oil pressure dropping</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Long-Term Strategy</h2>

          <p>
            Beyond monthly tweaks:
          </p>

          <p className="mt-3">
            <strong>Year 1-2:</strong> Implement 5 fixes above. Monitor results. Should see 25-40% fuel savings.
          </p>

          <p className="mt-3">
            <strong>Year 3-5:</strong> Consider upgrade to newer, more efficient generator model (modern generators use 15-20% less fuel). Payback: 2-3 years.
          </p>

          <p className="mt-3">
            <strong>Long-term:</strong> Consider hybrid system (solar + battery + smaller generator). Reduces fuel consumption by 60-80%.
          </p>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6 mt-8">
            <p className="text-orange-300 mb-4">
              <strong>Audit your generator efficiency.</strong> We analyze your load, equipment age, and operation to identify savings opportunities.
            </p>
            <Link href="/contact?type=efficiency-audit" className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all">
              Get Free Efficiency Audit
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
