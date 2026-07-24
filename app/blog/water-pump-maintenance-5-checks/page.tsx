import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Water Pump Maintenance: 5 Critical Checks',
  description: 'Borehole pump maintenance checklist. Prevent pump failure. Monthly checks, seasonal care, when to call technician.',
};

export default function WaterPumpMaintenanceBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-teal-400 hover:text-teal-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">Water Pump Maintenance: 5 Critical Checks</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 5 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Borehole pump stops working. No water. Emergency call. Technician charges KES 200K to repair what preventive maintenance would have caught for KES 30K.
          </p>

          <p>
            Five monthly checks prevent 80% of pump failures. Takes 30 minutes.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Check #1: Water Pressure</h2>

          <p>
            <strong>What to check:</strong> Pressure at discharge (near pump). Should be stable.
          </p>

          <p className="mt-3">
            <strong>Normal range:</strong> 1.5-3.5 bar depending on system
          </p>

          <p className="mt-3">
            <strong>Red flags:</strong> Pressure dropping over weeks = seals failing. Pressure spiking = blockage building.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Install pressure gauge. Read monthly. Log data. Compare month-to-month.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Check #2: Pump Current Draw</h2>

          <p>
            <strong>What to check:</strong> Electrical current to pump motor (requires clamp meter).
          </p>

          <p className="mt-3">
            <strong>Rising current = problem.</strong> Means motor working harder (friction increasing = bearing wear).
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Measure monthly. Should remain stable. If +10% increase over 2 months = call technician.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Check #3: Noise & Vibration</h2>

          <p>
            <strong>What to check:</strong> Listen and feel for unusual sounds or vibration.
          </p>

          <p className="mt-3">
            <strong>Normal:</strong> Steady hum, minimal vibration
          </p>

          <p className="mt-3">
            <strong>Red flags:</strong> Grinding, squealing, knocking = bearing/seal wear. Excessive vibration = imbalance or looseness.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> If new noise appears = call technician within week (before failure).
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Check #4: Water Output</h2>

          <p>
            <strong>What to check:</strong> Flow rate (litres per minute) at discharge.
          </p>

          <p className="mt-3">
            <strong>Declining output = problem.</strong> Pump cavitating (air entering = seal failure) or filter clogged.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Measure monthly (bucket + timer). Compare to baseline. Any 20%+ drop = investigate.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Check #5: Seal Condition</h2>

          <p>
            <strong>What to check:</strong> Look for water leaking at motor/pump seals.
          </p>

          <p className="mt-3">
            <strong>Small drip = seal wearing.</strong> Major leak = seal failed.
          </p>

          <p className="mt-3">
            <strong>Action:</strong> Small drip = call technician within 2 weeks. Major leak = emergency (pump will overheat).
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Monthly Maintenance Schedule</h2>

          <div className="bg-slate-800/50 border border-teal-500/20 rounded-lg p-6 my-6">
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Read pressure gauge (log in notebook)</li>
              <li>Listen for new sounds (30 seconds)</li>
              <li>Check seals for leaks (visual)</li>
              <li>Measure flow rate (5 minutes)</li>
              <li>Check electrical connections (tight?)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Annual Service (Professional)</h2>

          <p>
            Once yearly, hire technician for:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Motor current test (identify wear early)</li>
            <li>Seal inspection and potential replacement</li>
            <li>Filter cleaning/replacement</li>
            <li>Pressure relief valve testing</li>
          </ul>

          <p className="mt-4">
            <strong>Cost:</strong> KES 50-150K annual. Prevents KES 500K-2M pump replacement.
          </p>

          <div className="bg-teal-900/20 border border-teal-500/30 rounded-lg p-6 mt-8">
            <p className="text-teal-300 mb-4">
              <strong>Pump troubleshooting?</strong> We diagnose pressure drops, flow loss, and seal leaks to prevent expensive failures.
            </p>
            <Link href="/contact?type=pump-service" className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all">
              Schedule Pump Service
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
