import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Three-Phase Power Explained for Business Owners',
  description: 'What is three-phase power? Single-phase vs three-phase. Why industrial facilities need it. Kenya power standards.',
};

export default function ThreePhasePowerBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-violet-400 hover:text-violet-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">Three-Phase Power Explained for Business Owners</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 6 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Your facility needs industrial power. Supplier says "you need three-phase." What does that mean? Why not regular power? Why does it cost differently?
          </p>

          <p>
            Here's what every business owner should know about three-phase power.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Single-Phase (Household Power)</h2>

          <p>
            Your home runs on single-phase: one power wire delivering power in waves. Think of it as a pulsing river—up, down, up, down.
          </p>

          <p className="mt-3">
            <strong>Capacity:</strong> 6-15 kW typical home
          </p>

          <p className="mt-3">
            <strong>Voltage:</strong> 230V (Kenya standard)
          </p>

          <p className="mt-3">
            <strong>Use case:</strong> Lights, fridges, small AC units, computers
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Three-Phase Power (Industrial)</h2>

          <p>
            Three separate power wires, each delivering power at slightly different times. Result: smoother, stronger power delivery.
          </p>

          <p className="mt-3">
            <strong>Capacity:</strong> 50 kW - 500 kW+ (scalable)
          </p>

          <p className="mt-3">
            <strong>Voltage:</strong> 380V/400V (Kenya industrial standard)
          </p>

          <p className="mt-3">
            <strong>Use case:</strong> Industrial motors, heavy machinery, large AC systems, production equipment
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Why Three-Phase Is Better for Industry</h2>

          <p>
            <strong>1. More Power Capacity</strong> — Three-phase delivers 1.73× more power than single-phase at the same voltage. 400V three-phase = 100 kW. Single-phase = 57 kW max.
          </p>

          <p className="mt-3">
            <strong>2. Smoother Power Delivery</strong> — Three waves instead of one = fewer voltage dips = machines run smoother = less vibration + wear.
          </p>

          <p className="mt-3">
            <strong>3. Better for Motors</strong> — Large industrial motors MUST be three-phase. Single-phase motors above 3-5 kW become inefficient and overheat.
          </p>

          <p className="mt-3">
            <strong>4. Lower Cost Per Watt</strong> — KES 1.2-1.5 per watt three-phase vs KES 2-3 per watt single-phase.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cost: Single vs Three-Phase</h2>

          <div className="bg-slate-800/50 border border-violet-500/20 rounded-lg p-6 my-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>30 kW System (Single-Phase):</span><span className="text-violet-400">KES 90-120K</span></div>
              <div className="flex justify-between"><span>30 kW System (Three-Phase):</span><span className="text-violet-400">KES 45-60K</span></div>
              <div className="flex justify-between text-gray-400"><span className="text-sm">Savings: 40-50%</span></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">When to Use Each</h2>

          <p>
            <strong>Single-Phase:</strong> Offices, retail stores, small workshops, homes
          </p>

          <p className="mt-3">
            <strong>Three-Phase:</strong> Manufacturing, large data centers, hospitals, commercial kitchens, industrial facilities
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Converting Single to Three-Phase</h2>

          <p>
            If your facility has single-phase but needs three-phase:
          </p>

          <p className="mt-3">
            <strong>Option 1: Request from Kenya Power</strong> — If supply line is available. Cost: KES 200K-2M depending on distance. Timeline: 3-8 weeks.
          </p>

          <p className="mt-3">
            <strong>Option 2: VFD (Variable Frequency Drive)</strong> — Converts single-phase to three-phase for motors. Cost: KES 200-500K. Good for one or two motors.
          </p>

          <p className="mt-3">
            <strong>Option 3: Three-Phase Converter</strong> — Rotary converter generates three-phase from single-phase. Cost: KES 150K-400K. Maintains supply for whole facility.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Three-Phase and Backup Power</h2>

          <p>
            <strong>Generator Requirement:</strong> If you need three-phase power, your backup generator must also provide three-phase.
          </p>

          <p className="mt-3">
            <strong>Example:</strong> Industrial facility with 50 kW three-phase load needs 60-70 kVA three-phase generator (not single-phase).
          </p>

          <p className="mt-3">
            <strong>Cost Implication:</strong> Three-phase generators cost same as single-phase (no premium). But you need larger capacity for same load.
          </p>

          <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-6 mt-8">
            <p className="text-violet-300 mb-4">
              <strong>Unsure if you need three-phase?</strong> We assess your electrical requirements and recommend the right power solution.
            </p>
            <Link href="/contact?type=power-assessment" className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all">
              Get Power Assessment
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
