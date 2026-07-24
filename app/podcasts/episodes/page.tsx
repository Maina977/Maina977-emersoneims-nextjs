import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast Episodes | Power Infrastructure Conversations',
  description: 'Weekly podcast on backup power systems, solar integration, and Africa power infrastructure. Real industry guests, honest conversations.',
};

export default function PodcastEpisodesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Power Infrastructure Podcast</h1>
          <p className="text-xl text-gray-300">Weekly conversations with industry operators, engineers, and facility managers. Real challenges, real solutions, real data.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Recent Episodes</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-6xl flex-shrink-0">🎙️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Backup Power for Healthcare Facilities</h3>
                  <p className="text-gray-400 mb-4">Conversation with hospital operations director about power reliability requirements, cost-benefit analysis of different backup systems, and real experience during Kenya's grid challenges.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Healthcare</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Mission-Critical</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">ROI Analysis</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <a href="https://open.spotify.com/show/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Spotify</a>
                    <a href="https://podcasts.apple.com/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Apple Podcasts</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-6xl flex-shrink-0">🎙️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Manufacturing Power Strategy</h3>
                  <p className="text-gray-400 mb-4">Factory manager discusses load management, energy cost optimization, backup power requirements, and lessons learned from production downtime incidents.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Manufacturing</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Cost Optimization</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Load Management</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <a href="https://open.spotify.com/show/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Spotify</a>
                    <a href="https://podcasts.apple.com/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Apple Podcasts</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-6xl flex-shrink-0">🎙️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Solar Integration: From Installation to ROI</h3>
                  <p className="text-gray-400 mb-4">Engineer explains solar system design, hybrid power setups, payback periods, and why integrated solutions outperform single-technology approaches.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Solar</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Hybrid Systems</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">ROI</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <a href="https://open.spotify.com/show/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Spotify</a>
                    <a href="https://podcasts.apple.com/emersoneims" target="_blank" className="text-purple-400 hover:text-purple-300 font-bold">Apple Podcasts</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Why Listen?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">👥 Real Operators</h3>
              <p className="text-gray-300 text-sm">We interview facility managers, engineers, and operators handling real backup power systems. Not consultants—people running the equipment.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">💬 Honest Conversation</h3>
              <p className="text-gray-300 text-sm">No scripts, no marketing. We discuss real challenges: cost trade-offs, performance reality, lessons learned from failures and successes.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">📊 Data-Driven</h3>
              <p className="text-gray-300 text-sm">Every episode includes actual costs, timelines, performance metrics, and ROI calculations. Verified numbers, not estimates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Subscribe for Weekly Episodes</h2>
          <p className="text-lg text-gray-300 mb-8">Mondays: New episode. 30-45 minutes of real conversations on backup power, solar integration, and power infrastructure across Africa.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://open.spotify.com/show/emersoneims" target="_blank" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Listen on Spotify
            </a>
            <a href="https://podcasts.apple.com/emersoneims" target="_blank" className="px-8 py-4 border-2 border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500/10 transition-all">
              Apple Podcasts
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
