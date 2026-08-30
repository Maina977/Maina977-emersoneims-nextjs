import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/blog/hvac-sizing-kenya-climate' },
  title: 'HVAC Sizing for Kenya Climate: Don\'t Buy the Wrong AC Unit',
  description: 'Correct AC sizing for Kenya heat. Why oversized/undersized units fail. Cooling load calculation for different regions.',
};

export default function HVACSizingBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">HVAC Sizing for Kenya Climate: Don't Buy the Wrong AC Unit</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 8 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            You walk into a retail store. Ask for an AC unit for your office. Salesman asks one question: "How many square meters?" Then gives you a unit. Done.
          </p>

          <p>
            Six months later: The AC runs constantly but never cools the room to target temperature. Bills are sky-high. You're uncomfortable. You made a mistake: wrong-sized AC.
          </p>

          <p>
            This is the #1 HVAC mistake in Kenya. The fix: proper cooling load calculation before buying anything.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Sizing Problem</h2>

          <p>
            <strong>Undersized AC (too small):</strong> Runs 24/7. Never reaches target temperature. High power bills. Customer frustrated.
          </p>

          <p className="mt-3">
            <strong>Oversized AC (too big):</strong> Cools too fast. Cycles on/off constantly. Humidity stays high (short cycles don't remove moisture). Expensive. Wears out fast.
          </p>

          <p className="mt-3">
            <strong>Right size:</strong> Runs efficiently. Reaches temperature. Removes humidity. Lower bills. 15-20 year lifespan.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">How to Calculate Your Real Load</h2>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Factor 1: Room Size & Insulation</h3>
          <p>
            Base cooling load: 150-300 watts per square meter depending on:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Window area (more sun = more heat load)</li>
            <li>Roof exposure (top floor takes more sun)</li>
            <li>Insulation quality (poor insulation = higher load)</li>
            <li>Wall color (dark walls absorb more heat)</li>
          </ul>

          <p className="mt-3">
            <strong>Example:</strong> 100 sqm office with 30% windows on top floor = 100 × 250W = 25 kW base load
          </p>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Factor 2: Kenya Climate Region</h3>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6">
            <div className="space-y-3 text-sm">
              <p><strong>Hot-Humid (Mombasa, Kilifi):</strong> 35-40°C, high humidity. Add 30% to base load.</p>
              <p><strong>Hot-Dry (Nairobi, Kisumu):</strong> 25-30°C, moderate humidity. Base load sufficient.</p>
              <p><strong>Cool-Moderate (Nairobi CBD, Nakuru):</strong> 20-25°C. Reduce load by 20%.</p>
              <p><strong>High-Altitude (Nyeri, Kericho):</strong> 15-20°C. Reduce load by 40%.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Factor 3: Internal Heat Loads</h3>
          <p>
            People, equipment, lights generate heat:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Each person: ~100W sensible heat</li>
            <li>Computer: ~200-500W</li>
            <li>LED lights: ~10W per sqm</li>
            <li>Kitchen equipment (if applicable): varies</li>
          </ul>

          <p className="mt-3">
            <strong>Example:</strong> 20-person office + 20 computers + lighting = 20×100 + 20×250 + 10×100 = 5.5 kW additional load
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real Sizing Examples</h2>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-cyan-400 mb-4">Small Office (50 sqm, Nairobi, 8 people)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Building load:</span><span>50 × 200W = 10 kW</span></div>
              <div className="flex justify-between"><span>People heat:</span><span>8 × 100W = 0.8 kW</span></div>
              <div className="flex justify-between"><span>Equipment/lights:</span><span>2 kW</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span><span className="text-cyan-400">12.8 kW → 16 kW AC (rounded up)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-cyan-400 mb-4">Retail Store (100 sqm, Mombasa, high sun)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Building load:</span><span>100 × 280W = 28 kW</span></div>
              <div className="flex justify-between"><span>People (varying):</span><span>~2 kW avg</span></div>
              <div className="flex justify-between"><span>Lighting/equipment:</span><span>3 kW</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span><span className="text-cyan-400">33 kW → 40 kW AC system</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Converting to Tons (Tonnage)</h2>

          <p>
            AC is sold in "tons" (cooling capacity). 1 ton = 12,000 BTU/hr = 3.5 kW
          </p>

          <p className="mt-3">
            <strong>Example:</strong> 16 kW needed ÷ 3.5 = 4.6 tons → buy 5-ton AC unit
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Common Sizing Mistakes</h2>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Mistake 1: "1 Ton Per 100 sqm"</h3>
          <p>
            Old rule of thumb. Completely wrong for Kenya climate. Mombasa office needs 1 ton per 50 sqm. Nairobi needs 1 ton per 80 sqm.
          </p>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Mistake 2: Buying Split System When You Need Ducted</h3>
          <p>
            Single split AC can cool 1-2 rooms. For open offices, you need ductwork (more cost, but better cooling distribution).
          </p>

          <h3 className="text-xl font-bold text-cyan-400 mt-6 mb-3">Mistake 3: Ignoring Future Growth</h3>
          <p>
            Sizing for today only. If you'll add staff/equipment in 2 years, size for that now (slight oversizing is acceptable, major oversizing isn't).
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">How Wrong Sizing Costs Money</h2>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-cyan-400 mb-4">Undersized by 30% (3 tons instead of 4.3)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Runs continuously:</span><span>+30-50% power bills</span></div>
              <div className="flex justify-between"><span>Never reaches target temp:</span><span>Employee discomfort</span></div>
              <div className="flex justify-between"><span>Higher humidity:</span><span>Mold risk</span></div>
              <div className="flex justify-between"><span>Shorter AC lifespan:</span><span>Replacement in 8-10 years vs 15-20</span></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-cyan-400 mb-4">Oversized by 50% (6.5 tons instead of 4.3)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Extra equipment cost:</span><span>+KES 300-500K upfront</span></div>
              <div className="flex justify-between"><span>Short-cycling (on/off):</span><span>Wears compressor fast</span></div>
              <div className="flex justify-between"><span>Humidity control poor:</span><span>Damp feeling despite cold temp</span></div>
              <div className="flex justify-between"><span>Energy waste:</span><span>+20-30% unnecessary power</span></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Pro Sizing Checklist</h2>

          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li>Measure actual room/office dimensions</li>
            <li>Assess window size and orientation (north/south/east/west)</li>
            <li>Count occupants + equipment</li>
            <li>Check building insulation quality</li>
            <li>Identify room location (top floor = more heat)</li>
            <li>Plan for future growth</li>
            <li>Consider building layout (single room vs multi-room ducted)</li>
          </ul>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mt-8">
            <p className="text-cyan-300 mb-4">
              <strong>Get professional cooling load calculation.</strong> We analyze your building and recommend exact AC size. Saves money over system lifespan.
            </p>
            <Link href="/tools/pro-building-suite" className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-all">
              Calculate Your HVAC Load
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
