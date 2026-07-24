import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electrical Load Management: Lower Your Bills',
  description: 'Reduce electricity bills. Load scheduling, demand factor, peak shaving. Save 15-25% with smart management.',
};

export default function LoadManagementBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-yellow-400 hover:text-yellow-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">Electrical Load Management: Lower Your Bills</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 5 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Kenya Power charges based on peak demand, not total usage. Run AC, machines, and lights simultaneously? You're paying premium pricing for those 30 minutes. Spread them out? Same usage, 25% lower bill.
          </p>

          <p>
            Load management isn't hard. It's just intentional.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">How Kenya Power Charges</h2>

          <p>
            <strong>Peak Demand Charge:</strong> Your highest 15-minute power draw in a month determines your rate tier. Use 50 kW for 15 minutes? You pay as if you always need 50 kW capacity.
          </p>

          <p className="mt-3">
            <strong>Example:</strong> Office with 30 kW average demand but 55 kW peak (AC + kitchen + production simultaneous) might pay 40% more than office with same 30 kW usage but never exceeding 35 kW peak.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">5 Ways to Lower Peak Demand</h2>

          <p>
            <strong>1. Schedule High-Load Tasks</strong>
          </p>
          <p className="text-sm mt-2">
            Don't run AC, laundry, and production simultaneously. AC: 6-10 AM and 4-6 PM. Production: 10 AM - 4 PM. Laundry: 2-4 PM (off-peak). Spreads demand evenly.
          </p>

          <p className="mt-4">
            <strong>2. Install Capacitor Banks</strong>
          </p>
          <p className="text-sm mt-2">
            Improves power factor (how efficiently you use power). Reduces effective demand by 10-20%. Cost: KES 150-400K. Payback: 12-18 months.
          </p>

          <p className="mt-4">
            <strong>3. Upgrade Aging Equipment</strong>
          </p>
          <p className="text-sm mt-2">
            Old motors use 30-40% more electricity than modern ones. Replace 15+ year old equipment with efficient models. 10-15% energy savings.
          </p>

          <p className="mt-4">
            <strong>4. Use Energy Storage (Battery/Generator)</strong>
          </p>
          <p className="text-sm mt-2">
            Battery supplies peak-hour demand. Lower peak demand charge. Works especially well with solar (charged during day = free peak power at night).
          </p>

          <p className="mt-4">
            <strong>5. LED Lighting & HVAC Efficiency</strong>
          </p>
          <p className="text-sm mt-2">
            LED uses 75% less energy than incandescent. High-efficiency HVAC uses 30% less. Combined: 15-20% facility reduction.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real Example: Manufacturing Facility</h2>

          <div className="bg-slate-800/50 border border-yellow-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-yellow-400 mb-4">Before Load Management</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Peak demand (simultaneous AC + machinery):</span><span>80 kW</span></div>
              <div className="flex justify-between"><span>Average demand:</span><span>45 kW</span></div>
              <div className="flex justify-between"><span>Monthly bill:</span><span>KES 250K</span></div>
            </div>

            <p className="font-bold text-yellow-400 mb-4 mt-6">After Load Management</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Peak demand (staggered schedule):</span><span>55 kW</span></div>
              <div className="flex justify-between"><span>Average demand:</span><span>43 kW (slight improvement)</span></div>
              <div className="flex justify-between"><span>Monthly bill:</span><span className="text-yellow-400">KES 185K</span></div>
            </div>

            <div className="border-t border-slate-600 pt-3 mt-3 flex justify-between font-bold">
              <span>Monthly savings:</span><span className="text-yellow-400">KES 65K (26% reduction)</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Energy Audit First</h2>

          <p>
            Before implementing changes:
          </p>

          <ol className="list-decimal list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Get power quality analyzer (measures actual usage patterns)</li>
            <li>Identify which equipment causes peak demand</li>
            <li>Calculate current demand charge (bill analysis)</li>
            <li>Prioritize upgrades by ROI</li>
          </ol>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mt-8">
            <p className="text-yellow-300 mb-4">
              <strong>Reduce electricity costs 15-25%.</strong> We analyze your load profile and recommend specific optimization steps.
            </p>
            <Link href="/contact?type=energy-audit" className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all">
              Get Energy Audit
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
