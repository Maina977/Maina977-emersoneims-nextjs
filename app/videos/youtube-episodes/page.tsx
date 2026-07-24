import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Episodes | EmersonEIMS Power Infrastructure Channel',
  description: 'Technical deep dives on backup power systems. Real installations, honest solutions. New episodes Tuesday & Thursday.',
};

export default function YouTubeEpisodesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">YouTube Channel</h1>
          <p className="text-xl text-gray-300">Technical education on Africa's power infrastructure. Real facilities, real challenges, real solutions.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Latest Episodes</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">▶️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Solutions: Complete Power Integration</h3>
                <p className="text-gray-400 text-sm mb-4">Comprehensive backup power system design. Installation, testing, ongoing maintenance.</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Installation</span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Systems Design</span>
                </div>
                <a href="/videos/youtube-episodes/solutions" className="text-cyan-400 hover:text-cyan-300 font-bold text-sm">Watch Full Episode →</a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">▶️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Field Trials & Performance Testing</h3>
                <p className="text-gray-400 text-sm mb-4">Real-world testing of backup power systems under load conditions. Kadence facility case study.</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Testing</span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Performance</span>
                </div>
                <a href="/videos/youtube-episodes/field-trials" className="text-cyan-400 hover:text-cyan-300 font-bold text-sm">Watch Full Episode →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How Our Channel Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">📺 Real Facilities</h3>
              <p className="text-gray-300 text-sm">We film at actual installations—hospitals, manufacturing, data centers. No staged scenarios, no perfect conditions.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">🎯 Practical Solutions</h3>
              <p className="text-gray-300 text-sm">Every episode answers a real problem: sizing, installation, troubleshooting, cost optimization, emergency response.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">✓ Verified Content</h3>
              <p className="text-gray-300 text-sm">Every claim backed by field data. No marketing hype, no unverified claims. Honest assessments only.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Subscribe for New Episodes</h2>
          <p className="text-lg text-gray-300 mb-8">Tuesday & Thursday: New deep-dive episodes on backup power systems, solar integration, and power infrastructure.</p>
          <a href="https://youtube.com/@emersoneims" target="_blank" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            Watch on YouTube
          </a>
        </div>
      </section>
    </main>
  );
}
