import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Generator Emergency Response Guide | What To Do When Power Fails | EmersonEIMS',
  description: 'Step-by-step emergency response guide when your generator fails. Quick troubleshooting checklist, who to call, and what information to have ready. 24/7 emergency support in Kenya.',
};

export default function EmergencyResponseGuide() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="font-bold text-lg">Power Emergency Right Now?</p>
              <p className="text-sm text-red-100">We respond within 2 hours in Nairobi</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="tel:+254768860665"
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              📞 Call Now: 0768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=EMERGENCY%20-%20My%20generator%20has%20failed"
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-400 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Generator Emergency
            <span className="block text-red-500">Response Guide</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your step-by-step guide when power fails. Stay calm, follow these steps, and we'll get you back online.
          </p>
        </div>

        {/* Step 1: Safety First */}
        <section className="mb-12 p-8 bg-slate-800/50 border border-red-500/30 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-2xl font-bold">1</div>
            <h2 className="text-2xl font-bold">SAFETY FIRST</h2>
          </div>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p><strong>Do NOT touch</strong> any electrical connections if you smell burning or see sparks</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p><strong>Turn OFF the main breaker</strong> to isolate the generator from the load</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p><strong>Ensure good ventilation</strong> - open doors if the generator is in an enclosure</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p><strong>Keep fire extinguisher ready</strong> - Class ABC or CO2 type</p>
            </div>
          </div>
        </section>

        {/* Step 2: Quick Checks */}
        <section className="mb-12 p-8 bg-slate-800/50 border border-amber-500/30 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">2</div>
            <h2 className="text-2xl font-bold">QUICK CHECKS (2 Minutes)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-400">Check These First:</h3>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Fuel level (is there fuel?)</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Oil level (check dipstick)</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Coolant level (if applicable)</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Battery terminals (clean and tight?)</span>
              </label>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-400">Look For:</h3>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Error codes on display panel</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Warning lights (red/amber)</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Visible leaks (oil, fuel, coolant)</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Unusual sounds or smells</span>
              </label>
            </div>
          </div>
        </section>

        {/* Step 3: Gather Information */}
        <section className="mb-12 p-8 bg-slate-800/50 border border-cyan-500/30 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">3</div>
            <h2 className="text-2xl font-bold">GATHER THIS INFORMATION</h2>
          </div>
          <p className="text-slate-300 mb-6">Have this ready when you call - it helps us respond faster:</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400 mb-3">Generator Details:</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Brand and Model (e.g., Cummins C150D5)</li>
                <li>• kVA Rating (e.g., 150 kVA)</li>
                <li>• Serial Number (on nameplate)</li>
                <li>• Hours Run (from control panel)</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400 mb-3">Problem Details:</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• What happened? (stopped suddenly, won't start, etc.)</li>
                <li>• Any error codes displayed?</li>
                <li>• When did it last work?</li>
                <li>• Any recent maintenance?</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 4: Call Us */}
        <section className="mb-12 p-8 bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/50 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">4</div>
            <h2 className="text-2xl font-bold">CALL EMERSONEIMS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">Emergency Line (24/7)</h3>
              <a
                href="tel:+254768860665"
                className="inline-flex items-center gap-3 text-3xl font-bold text-white hover:text-green-400 transition-colors"
              >
                📞 0768 860 665
              </a>
              <p className="text-slate-400 mt-2">Response within 2 hours in Nairobi</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">WhatsApp (Fastest)</h3>
              <a
                href="https://wa.me/254768860665?text=EMERGENCY%20-%20Generator%20down.%20Need%20immediate%20assistance."
                className="inline-flex items-center gap-3 px-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors"
              >
                💬 WhatsApp Emergency
              </a>
              <p className="text-slate-400 mt-2">Send photos of error codes</p>
            </div>
          </div>
        </section>

        {/* Response Times */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Response Times</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-green-400 mb-2">&lt;2 hrs</div>
              <div className="text-slate-300">Nairobi CBD & Suburbs</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-amber-400 mb-2">&lt;6 hrs</div>
              <div className="text-slate-300">Greater Nairobi, Kiambu, Machakos</div>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;24 hrs</div>
              <div className="text-slate-300">All 47 Counties Nationwide</div>
            </div>
          </div>
        </section>

        {/* Use Generator Oracle */}
        <section className="mb-12 p-8 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Try Self-Diagnosis First?</h2>
            <p className="text-slate-300 mb-6">
              Use our free Generator Oracle tool to decode error codes and get instant troubleshooting steps.
            </p>
            <Link
              href="/generator-oracle"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              🔮 Open Generator Oracle
            </Link>
          </div>
        </section>

        {/* What We Bring */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What Our Emergency Team Brings</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🔧', text: 'Full tool kit' },
              { icon: '🔋', text: 'Jump starter' },
              { icon: '⛽', text: 'Emergency fuel' },
              { icon: '🛢️', text: 'Oil & coolant' },
              { icon: '🔌', text: 'Diagnostic equipment' },
              { icon: '📋', text: 'Common spare parts' },
              { icon: '📱', text: 'Direct line to parts' },
              { icon: '🚚', text: 'Equipped service vehicle' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center p-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Don't Wait - Every Minute Counts</h2>
          <p className="text-xl text-red-100 mb-6">
            Power outages cost businesses KES 50,000+ per hour. Call now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-gray-100 transition-colors"
            >
              📞 Call: 0768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-full hover:bg-green-400 transition-colors"
            >
              💬 WhatsApp Now
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
