import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions: Complete Power Integration',
  description: 'Comprehensive backup power system design, installation, testing, and ongoing maintenance. Real installation walkthrough.',
  // Explicit self-canonical — /videos/* bypasses middleware, so x-pathname is
  // never set and the root layout cannot derive one. See the sibling index page.
  alternates: { canonical: 'https://www.emersoneims.com/videos/youtube-episodes/solutions' },
};

export default function SolutionsEpisodePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Solutions: Complete Power Integration</h1>
          <p className="text-xl text-gray-300">Comprehensive backup power system design. Installation, testing, ongoing maintenance.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg p-8 mb-8">
            <div className="aspect-video bg-slate-700 flex items-center justify-center mb-6 rounded">
              <span className="text-8xl">▶️</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Watch the Full Episode</h2>
            <p className="text-gray-300 mb-6">This episode covers system design methodology, installation procedures, performance testing under real-world conditions, and preventive maintenance strategies for long-term reliability.</p>
            <a href="https://youtube.com/@emersoneims" target="_blank" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Watch on YouTube →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">🏗️ System Design</h3>
              <p className="text-gray-300 text-sm">Load analysis, redundancy planning, fuel consumption modeling, noise impact assessment, and cost optimization for different facility types.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">⚙️ Installation</h3>
              <p className="text-gray-300 text-sm">Foundation preparation, fuel tank installation, electrical integration, control panel setup, safety testing, and commissioning procedures.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">✓ Testing & Maintenance</h3>
              <p className="text-gray-300 text-sm">Load testing protocols, performance monitoring, scheduled maintenance intervals, fuel quality management, and emergency response procedures.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Key Topics Covered</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">System Sizing Methodology</h3>
              <p className="text-gray-300">How to calculate true load requirements, account for peak demands, size fuel storage, and select appropriate generator capacity. Real examples from healthcare and manufacturing facilities.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Installation Best Practices</h3>
              <p className="text-gray-300">Proper foundation construction, noise abatement techniques, fuel tank safety, electrical code compliance, and integration with existing building systems. Lessons from installations across Kenya.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Performance Testing</h3>
              <p className="text-gray-300">Load bank testing, transfer switch validation, automatic transfer switch tuning, runtime verification, and load shed capability. How to ensure your system will work when you need it.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Maintenance & Reliability</h3>
              <p className="text-gray-300">Preventive maintenance scheduling, fuel quality management, battery health monitoring, coolant maintenance, and documentation. How to keep systems running reliably for 15+ years.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Power System Design?</h2>
          <p className="text-lg text-gray-300 mb-8">Whether you need a backup system for critical infrastructure or emergency power for your business, our team can design and install a solution tailored to your needs.</p>
          <a href="/why-choose-us" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            Explore Our Services
          </a>
        </div>
      </section>
    </div>
  );
}
