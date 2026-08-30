import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/blog/generator-wont-start-5-fixes' },
  title: 'Why Your Generator Won\'t Start: 5 Common Causes & Quick Fixes',
  description: 'Generator won\'t start? Troubleshooting guide. Battery, fuel, fuel solenoid, starter, compression issues. When to call a technician.',
};

export default function GeneratorWontStartBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Why Your Generator Won't Start: 5 Common Causes & Quick Fixes</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 6 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Power goes out. You flip the switch on your generator. Nothing happens. No cranking. No fuel ignition. Just silence. What now?
          </p>

          <p>
            Generator won't start. It's the worst timing—always when you need it most. But here's the good news: 80% of generator start failures have simple causes you can check yourself in 10 minutes.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cause #1: Dead or Weak Battery (Most Common)</h2>

          <p>
            <strong>Symptom:</strong> Generator cranks slowly or doesn't crank at all. You hear clicking sounds.
          </p>

          <p className="mt-3">
            <strong>Why it happens:</strong> Batteries discharge over time (even when not used). Cold weather drains them faster. Corroded battery terminals block current flow.
          </p>

          <p className="mt-3">
            <strong>Quick check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Look at battery terminals (should be shiny, not white/blue corrosion)</li>
            <li>Try hand-cranking if available (manual backup start)</li>
            <li>Listen for clicks when you try to start (click = weak battery)</li>
          </ul>

          <p className="mt-3">
            <strong>Fix it:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Clean battery terminals with baking soda + water (remove corrosion)</li>
            <li>Tighten battery connections</li>
            <li>Charge battery (12V charger, 4-8 hours)</li>
            <li>If battery won't hold charge → replace it (KES 8K-15K for quality battery)</li>
          </ul>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 my-6">
            <p className="text-sm text-cyan-300">
              <strong>Pro tip:</strong> Most generators should have a maintenance charger connected during downtime. This keeps the battery topped up and ready.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cause #2: No Fuel (You'd Be Surprised)</h2>

          <p>
            <strong>Symptom:</strong> Engine cranks fine, but won't ignite. No fuel smell.
          </p>

          <p className="mt-3">
            <strong>Why it happens:</strong> Fuel gauge broken. Someone used fuel without telling you. Fuel line disconnected. Tank never filled.
          </p>

          <p className="mt-3">
            <strong>Quick check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Open fuel cap and look inside (is there actually fuel?)</li>
            <li>Smell the fuel fill opening (no smell = empty tank)</li>
            <li>Check for fuel leaks under the generator</li>
          </ul>

          <p className="mt-3">
            <strong>Fix it:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Add fuel (premium diesel recommended for generators)</li>
            <li>Wait 1-2 minutes for fuel to reach carburetor</li>
            <li>Try starting again</li>
          </ul>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 my-6">
            <p className="text-sm text-cyan-300">
              <strong>Important:</strong> Always fill your generator before you need it. Weekly checks prevent emergency fuel runs.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cause #3: Fuel Solenoid Stuck or Failed</h2>

          <p>
            <strong>Symptom:</strong> Battery is good. Engine cranks. But fuel doesn't flow to engine.
          </p>

          <p className="mt-3">
            <strong>Why it happens:</strong> Fuel solenoid (electric valve controlling fuel flow) gets stuck from stale fuel. Electrical connection corroded. Component failed.
          </p>

          <p className="mt-3">
            <strong>Quick check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Listen for a clicking sound from fuel solenoid when you try to start</li>
            <li>Check fuel line (should have pressure when cranking)</li>
            <li>Smell for fuel at the carburetor (no smell = solenoid blocked)</li>
          </ul>

          <p className="mt-3">
            <strong>Fix it:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Check electrical connection to solenoid (is it loose?)</li>
            <li>Clean solenoid terminals</li>
            <li>If solenoid still won't click → it's failed, needs replacement (KES 3K-8K)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cause #4: Spark Plug Carbon Buildup</h2>

          <p>
            <strong>Symptom:</strong> Fuel reaches engine. Cranks fine. But no ignition spark.
          </p>

          <p className="mt-3">
            <strong>Why it happens:</strong> Old fuel leaves carbon deposits on spark plug. Plug can't fire. Happens especially with dirty fuel or long storage.
          </p>

          <p className="mt-3">
            <strong>Quick check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Remove spark plug (wrench, 16-19mm)</li>
            <li>Look at electrode tip (should be shiny, light gray/brown)</li>
            <li>If black & gunked up → spark plug issue</li>
          </ul>

          <p className="mt-3">
            <strong>Fix it:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Clean spark plug with wire brush (or replace it, KES 500-1.5K)</li>
            <li>Check gap (should be 0.7-0.8mm, manufacturer specs)</li>
            <li>Reinstall & try starting</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cause #5: Low Compression (Engine Problem)</h2>

          <p>
            <strong>Symptom:</strong> All the above are fine. Battery good, fuel flowing, spark plug fires. But engine still won't start.
          </p>

          <p className="mt-3">
            <strong>Why it happens:</strong> Compression is the force pushing fuel/air mixture into the cylinder. Low compression = fuel won't ignite. Caused by worn piston rings, valve leaks, or bent valves.
          </p>

          <p className="mt-3">
            <strong>Quick check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Manual hand-crank (should feel resistance)</li>
            <li>If it spins freely with no resistance → compression is gone</li>
          </ul>

          <p className="mt-3">
            <strong>When to call a technician:</strong> Compression problems need professional diagnosis (compression test). This is engine work, not DIY.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Quick Troubleshooting Flowchart</h2>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6 space-y-3 text-sm">
            <p><strong>Engine won't crank?</strong> → Check battery (Cause #1)</p>
            <p><strong>Engine cranks but won't ignite?</strong> → Check fuel (Cause #2) → Check solenoid (Cause #3) → Check spark plug (Cause #4)</p>
            <p><strong>Everything looks fine but still won't start?</strong> → Low compression (Cause #5) → Call technician</p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">When to Call Us</h2>

          <p>
            If you've checked all 5 causes and it still won't start:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Engine compression is low (need professional test)</li>
            <li>Controller module failed (electrical diagnosis needed)</li>
            <li>Fuel pump failed (internal engine part)</li>
            <li>Multiple systems failing at once (full system check)</li>
          </ul>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mt-8">
            <p className="text-cyan-300 mb-4">
              <strong>Emergency generator won't start?</strong> We diagnose in 30-60 minutes and repair same-day if possible.
            </p>
            <a href="tel:+254768860665" className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-all">
              Call Emergency Service: +254 768 860 665
            </a>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Prevention: The Best Fix</h2>

          <p>
            Most generator start failures are preventable:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li><strong>Weekly fuel check:</strong> Keep tank at least 3/4 full</li>
            <li><strong>Monthly battery charge:</strong> Use maintenance charger</li>
            <li><strong>Monthly dry run:</strong> Start generator monthly for 10 minutes (even if no power outage)</li>
            <li><strong>Annual service:</strong> Professional maintenance catches issues early</li>
          </ul>

          <p className="mt-3">
            Generators are like cars—neglect them, they'll fail when you need them most. Maintain them, they'll start reliably every time.
          </p>
        </div>
      </article>
    </div>
  );
}
