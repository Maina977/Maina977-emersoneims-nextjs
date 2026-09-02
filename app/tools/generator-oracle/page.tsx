import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/tools/generator-oracle' },
  title: 'Generator Oracle | AI Fault Diagnosis Tool',
  description: 'AI-powered generator fault diagnosis. 400K+ diesel engine fault codes database. Instant troubleshooting for Caterpillar, Cummins, Perkins, FG Wilson generators.',
};

export default function GeneratorOraclePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Generator Oracle</h1>
          <p className="text-2xl text-gray-300 mb-8">AI-Powered Generator Fault Diagnosis</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Diagnose generator problems in minutes, not hours. Access curated diesel engine fault codes across all major brands.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What Makes Generator Oracle Different</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-cyan-400 mb-3">400K+ Fault Codes</h3>
              <p className="text-gray-300">Complete database covering Caterpillar, Cummins, Perkins, FG Wilson, and all other major generator brands.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-5xl mb-4">⚡</p>
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Instant Results</h3>
              <p className="text-gray-300">No waiting for phone calls or emails. Get diagnosis within seconds of entering engine parameters.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-5xl mb-4">🎯</p>
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Verified Solutions</h3>
              <p className="text-gray-300">Not just fault codes—detailed repair steps, parts lists, and preventive maintenance guidance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="text-4xl font-bold text-cyan-400 flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enter Engine Details</h3>
                <p className="text-gray-300">Select your generator brand, model, and engine type (Caterpillar C7, Cummins 6BT, etc.)</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="text-4xl font-bold text-cyan-400 flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Describe the Symptom</h3>
                <p className="text-gray-300">Won't start? Overheating? Low power output? Tell us what you're experiencing</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="text-4xl font-bold text-cyan-400 flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Get Instant Diagnosis</h3>
                <p className="text-gray-300">AI analyzes 400K+ fault codes and returns likely causes with step-by-step repair procedures</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="text-4xl font-bold text-cyan-400 flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Follow Verified Solutions</h3>
                <p className="text-gray-300">Get parts lists, torque specs, timing procedures, and preventive maintenance plans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Who Uses Generator Oracle</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">🏭 Facility Managers</h3>
              <p className="text-gray-300">Diagnose backup generator issues before calling for emergency service. Reduce downtime and emergency repair costs by 40%+.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">🔧 Technicians</h3>
              <p className="text-gray-300">Speed up diagnosis, access complete fault code database, improve accuracy, build confidence in repairs.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">💼 Service Companies</h3>
              <p className="text-gray-300">Deliver faster, more accurate service to your customers. Reduce callbacks. Improve customer satisfaction.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">📚 Training Institutes</h3>
              <p className="text-gray-300">Comprehensive fault code database for training technicians on real-world diagnostic scenarios.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Supported Generators</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-800/30 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Prime Brands</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Caterpillar (C7, C9, C11, C13, C15)</li>
                <li>✓ Cummins (6BT, ISBe, QSB)</li>
                <li>✓ Perkins (400, 500 series)</li>
                <li>✓ FG Wilson (Caterpillar powered)</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/30 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">More Brands</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Volvo/Penta</li>
                <li>✓ Detroit Diesel</li>
                <li>✓ Daimler/MTU</li>
                <li>✓ +50 more brands</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Diagnose Faster?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Stop waiting for technicians. Get instant diagnosis with 400K+ fault codes at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/generator-oracle?action=launch" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Launch Generator Oracle
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
