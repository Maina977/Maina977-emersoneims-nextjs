import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/blog/motor-rewinding-repair-vs-replace' },
  title: 'Motor Rewinding: When to Repair vs Replace',
  description: 'Electric motor failure? Rewind repair vs new motor. Cost analysis and decision framework for different scenarios.',
};

export default function MotorRewindingBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">Motor Rewinding: When to Repair vs Replace</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 5 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Electric motor burns out. You call a technician. He tells you two options: rewind it (KES 200-400K) or replace it (KES 500-1.5M). Which is right?
          </p>

          <p>
            The answer depends on motor age, failure cause, and criticality. Here's the decision framework.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Rewinding (Repair)</h2>

          <p>
            <strong>Cost:</strong> KES 200-400K depending on motor size (5-30 kW)
          </p>

          <p className="mt-3">
            <strong>Process:</strong> Strip old windings. Inspect core for damage. Install new copper windings. Test performance.
          </p>

          <p className="mt-3">
            <strong>Timeline:</strong> 3-7 days
          </p>

          <p className="mt-3">
            <strong>Reliability after:</strong> 90-95% (new windings, but core may be aged)
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">New Motor</h2>

          <p>
            <strong>Cost:</strong> KES 500-1.5M depending on power and efficiency class
          </p>

          <p className="mt-3">
            <strong>Advantage:</strong> Latest efficiency standards (saves 10-15% energy vs 15-year-old motors)
          </p>

          <p className="mt-3">
            <strong>Timeline:</strong> 1-2 days delivery + 1 day installation
          </p>

          <p className="mt-3">
            <strong>Warranty:</strong> 1-3 years factory warranty
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Decision Framework</h2>

          <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-indigo-400 mb-4">REWIND IF:</p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Motor is less than 10 years old</li>
              <li>Failure was electrical (winding burn-out) only</li>
              <li>Core shows no heat damage</li>
              <li>Budget is tight (rewinding is 50% the cost)</li>
              <li>Motor will be retired in 3-5 years anyway</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-indigo-400 mb-4">REPLACE IF:</p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Motor is 15+ years old</li>
              <li>Core or bearing damage exists (not just windings)</li>
              <li>Motor is mission-critical (downtime = high cost)</li>
              <li>Efficiency upgrade saves money over time</li>
              <li>You need warranty protection</li>
              <li>Multiple failures in past 5 years</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real Examples</h2>

          <p>
            <strong>Scenario 1: Water pump motor (7 years old, winding failure)</strong>
          </p>
          <p className="text-sm mt-2">
            Rewind cost: KES 250K. New motor cost: KES 800K. Downtime: 5 days rewind, 2 days replace.
          </p>
          <p className="text-sm mt-2">
            <strong>Decision: REWIND</strong> — Motor has 8+ years of life left. Winding failure is rewindable. Save KES 550K.
          </p>

          <p className="mt-4">
            <strong>Scenario 2: CNC Machine spindle motor (18 years old, recurring failures)</strong>
          </p>
          <p className="text-sm mt-2">
            Previous repairs: 3 in past 6 years. Cost so far: KES 600K. Rewind cost: KES 350K. New motor: KES 1.2M.
          </p>
          <p className="text-sm mt-2">
            <strong>Decision: REPLACE</strong> — Motor is age-end-of-life. Repeated failures suggest bearing/core aging. New motor has warranty. Stop recurring repairs.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Long-Term Cost Analysis</h2>

          <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-indigo-400 mb-4">Scenario: 15 kW Motor Operating 6,000 hours/year</p>

            <p className="font-bold text-gray-300 mt-4 mb-2">Keep Rewinding Old Motor:</p>
            <div className="space-y-1 text-sm ml-4">
              <div className="flex justify-between"><span>Rewind cost:</span><span>KES 300K</span></div>
              <div className="flex justify-between"><span>Annual energy cost (old efficiency):</span><span>KES 450K</span></div>
              <div className="flex justify-between"><span>5-year total:</span><span className="text-indigo-400">KES 2.55M</span></div>
            </div>

            <p className="font-bold text-gray-300 mt-4 mb-2">Replace with New Motor:</p>
            <div className="space-y-1 text-sm ml-4">
              <div className="flex justify-between"><span>New motor cost:</span><span>KES 1M</span></div>
              <div className="flex justify-between"><span>Annual energy cost (modern, 15% efficient):</span><span>KES 382K</span></div>
              <div className="flex justify-between"><span>5-year total:</span><span className="text-indigo-400">KES 2.9M</span></div>
            </div>

            <p className="text-sm text-gray-400 mt-3">Close race. With newer motor lasting 15+ years, 10-year cost heavily favors replacement.</p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Red Flags: Don't Rewind</h2>

          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Motor shows burn marks on core (heat damage beyond windings)</li>
            <li>Bearings are seized or grinding</li>
            <li>Shaft is bent or damaged</li>
            <li>Multiple failures in 24 months (aging)</li>
            <li>Cost of downtime exceeds replacement cost</li>
          </ul>

          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6 mt-8">
            <p className="text-indigo-300 mb-4">
              <strong>Need help deciding?</strong> We inspect your motor and recommend repair vs replace based on damage, age, and operating cost.
            </p>
            <Link href="/contact?type=motor-assessment" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all">
              Get Motor Assessment
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
