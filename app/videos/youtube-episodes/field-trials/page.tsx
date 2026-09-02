import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Field Trials & Performance Testing',
  description: 'Real-world backup power system testing under load conditions. Kadence facility case study with performance data.',
  // Explicit self-canonical — /videos/* bypasses middleware, so x-pathname is
  // never set and the root layout cannot derive one. See the sibling index page.
  alternates: { canonical: 'https://www.emersoneims.com/videos/youtube-episodes/field-trials' },
};

export default function FieldTrialsEpisodePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Field Trials & Performance Testing</h1>
          <p className="text-xl text-gray-300">Real-world testing of backup power systems under load conditions. Kadence facility case study.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg p-8 mb-8">
            <div className="aspect-video bg-slate-700 flex items-center justify-center mb-6 rounded">
              <span className="text-8xl">▶️</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Watch the Full Episode</h2>
            <p className="text-gray-300 mb-6">Join us at the Kadence facility for real-world testing of backup power systems. We load the generator under realistic conditions, measure performance across different load levels, and verify that the system will work when needed.</p>
            <a href="https://youtube.com/@emersoneims" target="_blank" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Watch on YouTube →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">📊 Load Testing</h3>
              <p className="text-gray-300 text-sm">Progressive load application, voltage regulation under varying conditions, frequency stability analysis, and load shed behavior verification.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">🔄 Transfer Testing</h3>
              <p className="text-gray-300 text-sm">Automatic transfer switch validation, switchover time measurement, load continuity verification, and fault recovery procedures.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">📈 Performance Data</h3>
              <p className="text-gray-300 text-sm">Runtime verification, fuel consumption rates, thermal monitoring, emission testing, and reliability metrics collection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">The Kadence Facility Case Study</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Facility Requirements</h3>
              <p className="text-gray-300">The Kadence facility required reliable backup power for mission-critical operations. We cover system sizing, load profiling, and why integrated solutions outperform single-technology approaches.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Testing Procedures</h3>
              <p className="text-gray-300">We show step-by-step testing protocols: load bank deployment, progressive load application, switchover simulation, and emergency scenario verification. All tested under real-world conditions.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Performance Results</h3>
              <p className="text-gray-300">Actual measurements: startup time, switchover latency, frequency deviation, voltage regulation, and reliability under sustained load. Data-driven validation that the system meets specifications.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Lessons Learned</h3>
              <p className="text-gray-300">What works in field testing, unexpected challenges we encountered, tuning recommendations, and maintenance priorities based on real operational experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Want Your System Tested?</h2>
          <p className="text-lg text-gray-300 mb-8">We perform comprehensive performance testing for all installations to ensure reliability when you need it most. Our test protocols verify every aspect of your backup power system.</p>
          <a href="/why-choose-us" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            Schedule a Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
