import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UPS vs Generator: Which Backup Power Is Right for You?',
  description: 'Compare UPS systems and generators. Cost, runtime, use cases. When to choose UPS, when to choose generator, when to use both.',
};

export default function UPSVsGeneratorBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-amber-400 hover:text-amber-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">UPS vs Generator: Which Backup Power Is Right for You?</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 7 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Power goes out. You need backup power fast. Two options appear: UPS (Uninterruptible Power Supply) or generator. Which one?
          </p>

          <p>
            The honest answer: they're not competing. They're complementary. UPS is the sprinter. Generator is the marathon runner. Smart businesses use both.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Quick Comparison</h2>

          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 my-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/20">
                  <th className="text-left py-2 text-amber-400">Feature</th>
                  <th className="text-left py-2 text-amber-400">UPS</th>
                  <th className="text-left py-2 text-amber-400">Generator</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr>
                  <td className="py-2">Startup time</td>
                  <td>Instant (milliseconds)</td>
                  <td>3-10 seconds</td>
                </tr>
                <tr>
                  <td className="py-2">Runtime</td>
                  <td>30 min - 8 hours</td>
                  <td>8 hours - continuous</td>
                </tr>
                <tr>
                  <td className="py-2">Cost (typical)</td>
                  <td>KES 100K-500K</td>
                  <td>KES 500K-3M+</td>
                </tr>
                <tr>
                  <td className="py-2">Maintenance</td>
                  <td>Battery replacement (5yr)</td>
                  <td>Monthly service, fuel</td>
                </tr>
                <tr>
                  <td className="py-2">Noise level</td>
                  <td>Silent</td>
                  <td>80-90 dB (loud)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">When UPS Is Better</h2>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Hospitals & Medical Equipment</h3>
          <p>
            Patients on monitors. Operating rooms. Medical equipment can't tolerate power gaps. UPS handles instant switchover. Generator takes 3-10 seconds to start—too long for critical care.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Data Centers & Server Rooms</h3>
          <p>
            Computers crash on sudden power loss. UPS bridges the gap while generator starts up. Typical setup: UPS (5-10 min runtime) buys time for generator to start safely.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Banks & Financial Systems</h3>
          <p>
            Transaction systems need uninterrupted power. Power blinks = lost transactions = regulatory fines. UPS handles the blink. Generator handles longer outages.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Home Office & Small IT Setups</h3>
          <p>
            For laptops, WiFi routers, monitors: UPS is perfect. Cost is low. Runtime is enough. No need for expensive generator.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">When Generator Is Better</h2>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Long Outages (Hours)</h3>
          <p>
            UPS runs out in 30 min - 8 hours. Generator runs as long as you have fuel. For events lasting 2+ hours, generator is cheaper than UPS batteries.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">High Power Loads (AC Units, Machinery)</h3>
          <p>
            Large AC systems need 30-50 kW. UPS at that scale costs millions. Generator costs KES 2-5M. Economics favor generator.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Manufacturing & Industrial</h3>
          <p>
            Production lines running hours = generator needed. UPS just buys time to shut down safely.
          </p>

          <h3 className="text-xl font-bold text-amber-400 mt-6 mb-3">Frequent Long Outages</h3>
          <p>
            If your area loses power multiple times per month for 1-4 hours, generator pays for itself vs. replacing UPS batteries repeatedly.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Hybrid Approach (Best Practice)</h2>

          <p>
            Top organizations use both:
          </p>

          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-amber-400 mb-4">Typical Setup:</p>
            <div className="space-y-3">
              <p>• <strong>UPS (5-10 min runtime):</strong> Handles instant power loss. Protects critical systems. Costs KES 200K-400K.</p>
              <p>• <strong>Generator (backup):</strong> Starts automatically when UPS is about to run out. Takes over for long outages. Costs KES 1-3M.</p>
              <p>• <strong>Controller (ATS):</strong> Automatically transfers between grid → UPS → generator. Hands-off operation. Costs KES 100-300K.</p>
            </div>
          </div>

          <p className="mt-4">
            <strong>Total cost:</strong> KES 1.5-3.7M
          </p>

          <p className="mt-3">
            <strong>Benefit:</strong> Zero downtime for hours-long outages. Systems never crash. Automatic switchover.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real-World Scenario</h2>

          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-amber-400 mb-4">Hospital Power Failure (4-Hour Outage)</p>
            <div className="space-y-3">
              <p><strong>T=0 sec:</strong> Grid power fails. UPS kicks in instantly. Monitors keep running. Surgeons continue safely.</p>
              <p><strong>T=3 sec:</strong> Generator starts automatically (ATS controlled). UPS stops discharging.</p>
              <p><strong>T=10 sec:</strong> Generator reaches full power. Seamless transition.</p>
              <p><strong>T=4 hours:</strong> Grid power returns. ATS switches back to grid. Generator shuts down.</p>
              <p><strong>Result:</strong> Zero downtime. Zero patient risk. Zero data loss.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cost Analysis: UPS vs Generator vs Both</h2>

          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-amber-400 mb-4">Medium Office (20 kW critical load)</p>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Option A: UPS Only</p>
                <p className="text-sm">Capacity: 5 kW UPS, 2-hour runtime</p>
                <p className="text-sm">Cost: KES 300K | Solves: Short outages only</p>
                <p className="text-sm">Problem: Dies after 2 hours</p>
              </div>
              <div>
                <p className="font-bold">Option B: Generator Only</p>
                <p className="text-sm">Capacity: 25 kVA generator</p>
                <p className="text-sm">Cost: KES 1.5M | Solves: Long outages</p>
                <p className="text-sm">Problem: 5-second startup gap = system crashes</p>
              </div>
              <div>
                <p className="font-bold">Option C: UPS + Generator (Recommended)</p>
                <p className="text-sm">UPS (5 kW, 10-min): KES 300K</p>
                <p className="text-sm">Generator (25 kVA): KES 1.5M</p>
                <p className="text-sm">ATS Controller: KES 150K</p>
                <p className="text-sm">Total: KES 1.95M | Result: Zero downtime, seamless operation</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Maintenance Reality</h2>

          <p>
            <strong>UPS:</strong> Replace battery every 5 years (KES 200K-500K). Otherwise minimal maintenance.
          </p>

          <p className="mt-3">
            <strong>Generator:</strong> Monthly service, fuel cost, oil changes, filter replacement. Annual maintenance: KES 100-300K.
          </p>

          <p className="mt-3">
            <strong>Both:</strong> Generator needs more maintenance, but both are necessary for true reliability.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Decision Framework</h2>

          <p>
            <strong>Use UPS if:</strong> Outages typically short (under 30 min), critical systems (servers/medical), silent operation required, budget limited.
          </p>

          <p className="mt-3">
            <strong>Use Generator if:</strong> Outages typically 1+ hours, high power loads (AC/machinery), cost is priority, noise acceptable.
          </p>

          <p className="mt-3">
            <strong>Use Both if:</strong> Cannot tolerate ANY downtime, mission-critical operations, mixed loads, and budget allows.
          </p>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 mt-8">
            <p className="text-amber-300 mb-4">
              <strong>Need help designing your backup power system?</strong> We analyze your outage patterns, load requirements, and budget to recommend the right solution.
            </p>
            <Link href="/contact" className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all">
              Get Free Power Assessment
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
