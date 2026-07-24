import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'High-Voltage Systems: Industrial Power Solutions',
  description: 'High-voltage power (11kV, 33kV). Industrial applications, safety, maintenance. Large facility power distribution.',
};

export default function HighVoltageBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-pink-400 hover:text-pink-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">High-Voltage Systems: Industrial Power Solutions</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 6 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Large facilities don't connect to grid at 400V like offices. They connect at 11,000V (11kV) or higher. High-voltage power is efficient, safe (when properly maintained), and necessary for industrial operations. Here's what every facility manager should know.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Power Transmission Hierarchy</h2>

          <div className="bg-slate-800/50 border border-pink-500/20 rounded-lg p-6 my-6 text-sm space-y-2">
            <p><strong>Grid:</strong> 66kV, 132kV (transmission)</p>
            <p><strong>Substations:</strong> Step down to 11kV/33kV (distribution)</p>
            <p><strong>Large Industries:</strong> Receive 11kV or 33kV directly</p>
            <p><strong>Transformer:</strong> Steps down to 400V for equipment use</p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Why High-Voltage?</h2>

          <p>
            <strong>1. Efficiency:</strong> 11kV transmission loses less power than 400V over distance. For large facilities, saves 5-15% energy vs low-voltage.
          </p>

          <p className="mt-3">
            <strong>2. Capacity:</strong> Delivers massive power (5-50 MW+) in single connection. Low-voltage would need multiple parallel connections.
          </p>

          <p className="mt-3">
            <strong>3. Cost:</strong> Smaller cables, fewer connections = lower installation cost despite equipment expense.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">High-Voltage Equipment</h2>

          <p>
            <strong>Oil-Immersed Transformer (Most Common)</strong>
          </p>
          <p className="text-sm mt-2">
            Converts 11kV to 400V. Cost: KES 2-5M depending on capacity (500 kVA - 2 MVA typical). Lifespan: 30-40 years with maintenance.
          </p>

          <p className="mt-4">
            <strong>Switchgear Cabinet</strong>
          </p>
          <p className="text-sm mt-2">
            Controls high-voltage distribution. Cost: KES 1.5-3M. Contains circuit breakers, isolators, protective relays.
          </p>

          <p className="mt-4">
            <strong>Protection Relay System</strong>
          </p>
          <p className="text-sm mt-2">
            Monitors high-voltage supply. Auto-shuts down if fault detected. Prevents equipment damage. Cost: KES 500K-1.5M.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Maintenance Requirements</h2>

          <p>
            <strong>Monthly:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2 text-sm">
            <li>Visual inspection for damage/leaks</li>
            <li>Oil level check (if oil-immersed transformer)</li>
            <li>Temperature monitoring</li>
          </ul>

          <p className="mt-4">
            <strong>Annually:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2 text-sm">
            <li>Oil quality test (moisture, acid number, dissolved gas)</li>
            <li>Insulation resistance test</li>
            <li>Protection relay function test</li>
            <li>Load test under actual conditions</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Safety Considerations</h2>

          <p>
            <strong>11kV is deadly.</strong> Direct contact = instant fatality. Proper safety procedures are non-negotiable.
          </p>

          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Only trained technicians work on high-voltage systems</li>
            <li>Lockout/tagout procedures on maintenance</li>
            <li>Grounding all equipment before work</li>
            <li>Arc flash protective equipment for technicians</li>
            <li>No untrained personnel in high-voltage areas</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Common Failures</h2>

          <p>
            <strong>Oil Degradation:</strong> Oil ages, loses insulation properties. Result: transformer overheating, failure. Prevented by annual oil testing.
          </p>

          <p className="mt-3">
            <strong>Winding Short:</strong> Moisture or contamination causes internal short. Result: immediate transformer loss. Prevented by environmental control + oil maintenance.
          </p>

          <p className="mt-3">
            <strong>Protection Relay Failure:</strong> Relay doesn't detect fault. Result: cascading damage. Prevented by annual relay testing.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Integration with Backup Power</h2>

          <p>
            For mission-critical facilities, high-voltage systems often include backup generators at high-voltage level (5-10 MVA units). Cost is high (KES 15-30M+) but reliability is absolute.
          </p>

          <p className="mt-3">
            <strong>Example:</strong> Hospital or data center with redundant high-voltage connections + backup generator = zero downtime.
          </p>

          <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-6 mt-8">
            <p className="text-pink-300 mb-4">
              <strong>High-voltage systems need expert oversight.</strong> We provide maintenance, testing, and emergency support for industrial power systems.
            </p>
            <Link href="/contact?type=hv-systems" className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-all">
              Schedule HV System Service
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
