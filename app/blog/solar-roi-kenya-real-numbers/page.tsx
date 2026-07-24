import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar ROI in Kenya: Real Numbers, Not Hype',
  description: 'Honest solar ROI analysis for Kenya. Transparent costs, realistic savings, payback periods. Based on actual installation data.',
};

export default function SolarROIBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-emerald-400 hover:text-emerald-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Solar ROI in Kenya: Real Numbers, Not Hype</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 8 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Everyone wants to talk about solar energy in Kenya. "Switch to solar," they say, "and save money forever." But what's the real number? What actually happens to your electricity bill? Let's look at honest data, not marketing hype.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Numbers Everyone Should Know</h2>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 my-6">
            <h3 className="text-emerald-400 font-bold mb-4">Small Office (5 kWh/day)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>System Cost:</span><span className="text-emerald-400">KES 800K-1.2M</span></div>
              <div className="flex justify-between"><span>Monthly Electricity Bill (before):</span><span>KES 15K-25K</span></div>
              <div className="flex justify-between"><span>Monthly Bill (after, grid-tied):</span><span className="text-emerald-400">KES 2K-5K</span></div>
              <div className="flex justify-between"><span>Monthly Savings:</span><span className="text-emerald-400">KES 10K-20K</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Payback Period:</span><span className="text-emerald-400">48-60 months (4-5 years)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 my-6">
            <h3 className="text-emerald-400 font-bold mb-4">Medium Factory (30 kWh/day)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>System Cost:</span><span className="text-emerald-400">KES 4-6M</span></div>
              <div className="flex justify-between"><span>Monthly Bill (before):</span><span>KES 80K-150K</span></div>
              <div className="flex justify-between"><span>Monthly Bill (after):</span><span className="text-emerald-400">KES 15K-30K</span></div>
              <div className="flex justify-between"><span>Monthly Savings:</span><span className="text-emerald-400">KES 50K-120K</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Payback Period:</span><span className="text-emerald-400">36-50 months (3-4 years)</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">What Changes Your ROI</h2>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">1. Your Current Electricity Bill</h3>
          <p>
            Higher bills = faster payback. If you're paying KES 200K/month, solar makes sense faster than someone paying KES 30K/month. Simple math: more savings = quicker ROI.
          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">2. System Type (Grid-Tied vs Hybrid)</h3>
          <p>
            <strong>Grid-tied (cheapest):</strong> KES 800K-1.2M for 5kW system. No battery. Feed excess to grid. Payback: 4-5 years. Problem: no backup during outages.
          </p>
          <p className="mt-3">
            <strong>Hybrid (recommended):</strong> KES 1.5-2.5M for 5kW + 10kWh battery. Solar + grid + backup. Payback: 5-7 years. Benefit: power during blackouts.
          </p>
          <p className="mt-3">
            <strong>Off-grid (expensive):</strong> KES 3-5M for 5kW + 50kWh battery. Total independence. Payback: 7-10 years. Only makes sense in remote areas without grid connection.
          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-3">3. Electricity Rate Increases</h3>
          <p>
            Kenya Power raises rates ~5-8% per year. Your solar investment locks in savings today. In 10 years, as grid rates climb, your savings grow while solar cost stays fixed.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Hidden Costs Nobody Mentions</h2>

          <ul className="space-y-3 ml-4">
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">•</span>
              <span><strong>Inverter replacement (10-15 years):</strong> KES 300K-800K. Plan for this.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">•</span>
              <span><strong>Battery replacement (5-10 years, if hybrid):</strong> KES 500K-2M. Budget accordingly.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">•</span>
              <span><strong>Panel cleaning & maintenance:</strong> KES 5K-20K/year. Dust reduces efficiency 15-25%.</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">10-Year Financial Picture</h2>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-emerald-400 mb-4">5kW System Example (Small Office)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Initial investment:</span><span>KES 1M</span></div>
              <div className="flex justify-between"><span>Maintenance (10 years):</span><span>KES 100K</span></div>
              <div className="flex justify-between"><span>Total cost:</span><span>KES 1.1M</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2"></div>
              <div className="flex justify-between text-emerald-400"><span>Savings (10 years):</span><span>KES 1.5-2.5M</span></div>
              <div className="flex justify-between font-bold text-emerald-400"><span>Net gain:</span><span>KES 400K-1.4M</span></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Honest Truth</h2>

          <p>
            Solar makes financial sense for most Kenyan businesses. But it's not "free electricity." It's an investment with a 4-7 year payback and 10-15 year useful life. After that, you save money for years.
          </p>

          <p className="mt-3">
            Best use case: Companies paying KES 50K+ per month on electricity. Payback in 3-5 years. Clear ROI.
          </p>

          <p className="mt-3">
            Worse use case: Small shops paying KES 10K/month. ROI takes 8-10 years. Works, but slow.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">What We Recommend</h2>

          <ol className="space-y-3 ml-4">
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">1.</span>
              <span>Audit your actual electricity usage (get last 12 months of bills)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">2.</span>
              <span>Get a site assessment (roof condition, shading, orientation)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">3.</span>
              <span>Calculate your specific ROI (not generic numbers)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">4.</span>
              <span>Choose system type based on budget and backup power needs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 flex-shrink-0">5.</span>
              <span>Plan for inverter/battery replacement costs in budget</span>
            </li>
          </ol>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6 mt-8">
            <p className="text-emerald-300 mb-4">
              <strong>Want your specific solar ROI?</strong> We analyze your actual bills and building conditions to give you honest numbers—not estimates.
            </p>
            <Link href="/tools/solar-genius-pro" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all">
              Try Solar Genius Pro
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
