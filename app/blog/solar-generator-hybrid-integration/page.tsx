import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar + Generator Hybrid Integration: Best of Both Worlds',
  description: 'Hybrid power systems combining solar + generator + battery. How they work, when to use them, cost analysis for Kenya.',
};

export default function SolarGeneratorBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-emerald-400 hover:text-emerald-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Solar + Generator Hybrid Integration: Best of Both Worlds</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 10 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Solar can't work at night. Generators are expensive to run. What if they worked together? Solar during day. Battery backup for evening/night. Generator as final backup. Result: lowest cost, zero downtime.
          </p>

          <p>
            This is hybrid power. And it's the smartest choice for most Kenyan businesses.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">How Hybrid Systems Work</h2>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-emerald-400 mb-4">Typical Hybrid Setup</p>
            <div className="space-y-3 text-sm">
              <p>1. <strong>Solar panels</strong> (on roof) generate power during day</p>
              <p>2. <strong>Hybrid inverter</strong> (brain of system) decides where power goes</p>
              <p>3. <strong>Battery bank</strong> (ground level) stores excess solar</p>
              <p>4. <strong>Grid connection</strong> (optional) sells excess power or draws when needed</p>
              <p>5. <strong>Generator</strong> (backup) starts if battery depletes</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Power Flow Throughout the Day</h2>

          <p>
            <strong>6 AM - 10 AM (Morning, Strong Solar):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Solar powers building directly</li>
            <li>Excess charges battery</li>
            <li>Grid/generator OFF</li>
            <li>Cost: Minimal (only solar)</li>
          </ul>

          <p className="mt-4">
            <strong>10 AM - 4 PM (Peak Solar):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Solar provides all power</li>
            <li>Battery fully charged</li>
            <li>Excess fed to grid (if applicable) OR wasted</li>
            <li>Cost: Zero</li>
          </ul>

          <p className="mt-4">
            <strong>4 PM - 6 PM (Afternoon, Declining Solar):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Solar declining but still strong</li>
            <li>Battery provides supplement if needed</li>
            <li>Building mostly solar-powered</li>
            <li>Cost: Minimal</li>
          </ul>

          <p className="mt-4">
            <strong>6 PM - 10 PM (Evening, No Solar):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Solar dead</li>
            <li>Battery powers building</li>
            <li>Inverter drawing from battery bank</li>
            <li>Cost: Free (battery is stored solar)</li>
          </ul>

          <p className="mt-4">
            <strong>10 PM - 6 AM (Night, Battery Depleting):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Battery still providing power</li>
            <li>When battery hits 20% → generator auto-starts</li>
            <li>Generator charges battery while powering building</li>
            <li>Cost: Fuel for generator (if solar is insufficient)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Financial Advantage Over Generator-Only</h2>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-emerald-400 mb-4">Comparison: Generator Only vs Hybrid</p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold">Generator Only (20 kVA):</p>
                <div className="space-y-1 ml-4 text-gray-400">
                  <div className="flex justify-between"><span>Equipment cost:</span><span>KES 1.2M</span></div>
                  <div className="flex justify-between"><span>Monthly fuel:</span><span>KES 80-120K</span></div>
                  <div className="flex justify-between"><span>Maintenance/year:</span><span>KES 100-200K</span></div>
                  <div className="border-t border-slate-600 pt-1 mt-1 flex justify-between">
                    <span>1-year cost:</span><span className="text-emerald-400">KES 2.3-2.5M</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold">Hybrid (Solar + Battery + Generator):</p>
                <div className="space-y-1 ml-4 text-gray-400">
                  <div className="flex justify-between"><span>Solar (10 kW):</span><span>KES 1.5M</span></div>
                  <div className="flex justify-between"><span>Battery (20 kWh):</span><span>KES 1.5M</span></div>
                  <div className="flex justify-between"><span>Small generator (5 kVA):</span><span>KES 400K</span></div>
                  <div className="flex justify-between"><span>Monthly fuel:</span><span>KES 15-25K</span></div>
                  <div className="border-t border-slate-600 pt-1 mt-1 flex justify-between">
                    <span>1-year cost:</span><span className="text-emerald-400">KES 3.5-3.7M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm">
            <strong>Year 1 looks expensive.</strong> But over 5 years:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Generator-only: KES 2.5M + KES 5M fuel = KES 7.5M</li>
            <li>Hybrid: KES 3.7M + KES 1.5M fuel = KES 5.2M</li>
            <li><strong>5-Year Savings: KES 2.3M with hybrid</strong></li>
          </ul>

          <p className="mt-3 text-sm">
            Plus: Hybrid is quieter (smaller generator), more reliable (solar + backup), and better for environment.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Hybrid System Types</h2>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">Type 1: Solar + Battery Only (No Generator)</h3>
          <p>
            Best for: Businesses with predictable daytime usage, good solar resource, willing to accept rare evening outages.
          </p>
          <p className="mt-2">
            <strong>Cost:</strong> KES 2.5-4M | <strong>Battery size:</strong> 10-30 kWh | <strong>Limitation:</strong> No backup if battery depletes during extended cloud
          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">Type 2: Solar + Battery + Generator (Full Hybrid)</h3>
          <p>
            Best for: Most businesses. Solar handles day. Battery handles evening. Generator handles night/emergencies.
          </p>
          <p className="mt-2">
            <strong>Cost:</strong> KES 3.5-6M | <strong>Battery size:</strong> 15-40 kWh | <strong>Generator:</strong> 5-15 kVA | <strong>Advantage:</strong> Zero downtime, lowest fuel cost
          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">Type 3: Solar + Grid (No Battery or Generator)</h3>
          <p>
            Best for: Facilities with strong grid connection, want to sell excess power to utility.
          </p>
          <p className="mt-2">
            <strong>Cost:</strong> KES 1.5-3M | <strong>Benefit:</strong> Lowest upfront cost, can earn money selling excess | <strong>Risk:</strong> Vulnerable to outages
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Battery Technology (Important Choice)</h2>

          <p>
            <strong>Lithium-Ion (Best):</strong> KES 120-150K per kWh, 10-15 year lifespan, 95% efficiency
          </p>

          <p className="mt-3">
            <strong>Lithium Phosphate (Better):</strong> KES 80-100K per kWh, 12-20 year lifespan, safer than Li-Ion
          </p>

          <p className="mt-3">
            <strong>Lead-Acid (Cheaper):</strong> KES 30-50K per kWh, 5-8 year lifespan, 80% efficiency, needs maintenance
          </p>

          <p className="mt-3">
            <strong>Recommendation:</strong> For most businesses, lithium phosphate is the sweet spot—good lifespan, safe, reasonable cost.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Design Considerations</h2>

          <p>
            <strong>1. Roof space:</strong> 10 kW solar = ~60-80 sqm of roof. South-facing preferred.
          </p>

          <p className="mt-3">
            <strong>2. Battery placement:</strong> Ground level. Climate-controlled room preferred (heat reduces lifespan).
          </p>

          <p className="mt-3">
            <strong>3. Generator location:</strong> Separate shed recommended (noise isolation).
          </p>

          <p className="mt-3">
            <strong>4. Electrical infrastructure:</strong> May require panel upgrade, new breakers, grounding modifications.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Is Hybrid Right for You?</h2>

          <p>
            <strong>YES if:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>High electricity bills (KES 50K+/month)</li>
            <li>Frequent/long power outages</li>
            <li>Cannot afford downtime</li>
            <li>Budget for upfront investment exists</li>
            <li>Planning 10+ year operation</li>
          </ul>

          <p className="mt-4">
            <strong>MAYBE if:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Moderate bills (KES 20-50K/month)</li>
            <li>Occasional outages</li>
            <li>Limited upfront budget</li>
            <li>Can phase approach (solar now, battery later)</li>
          </ul>

          <p className="mt-4">
            <strong>NO if:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Low usage (KES 10K/month or less)</li>
            <li>Grid is 99% reliable</li>
            <li>No upfront capital</li>
            <li>Only need backup for 1-2 hours</li>
          </ul>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6 mt-8">
            <p className="text-emerald-300 mb-4">
              <strong>Want a hybrid design for your facility?</strong> We analyze your load, location, climate, and budget to recommend the right solar/battery/generator mix.
            </p>
            <Link href="/contact" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all">
              Get Hybrid System Design
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
