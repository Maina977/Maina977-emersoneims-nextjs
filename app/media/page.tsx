import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Africa Power Infrastructure Media | YouTube • Podcast • Content',
  description: 'Technical education on backup power systems. YouTube channel with real installations. Weekly podcast on African power infrastructure. Educational resources for mining, healthcare, telecom, utilities.',
  alternates: {
    canonical: 'https://www.emersoneims.com/media',
  },
};

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Africa Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Infrastructure Media
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Technical education on reliable power systems. Real installations, real solutions, real data.
          </p>
        </div>
      </section>

      {/* YouTube Channel */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">YouTube Channel</h2>
              <p className="text-lg text-gray-300 mb-6">
                <strong>Practical guidance on backup power systems.</strong> We film real installations, explain actual challenges, and show how facilities solve power reliability problems.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
                  <h3 className="text-cyan-400 font-bold mb-2">Installation Walkthroughs</h3>
                  <p className="text-gray-300 text-sm">See how backup power is actually installed, tested, and maintained at real facilities.</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
                  <h3 className="text-cyan-400 font-bold mb-2">Technical Explanations</h3>
                  <p className="text-gray-300 text-sm">Generator sizing, UPS systems, solar integration, emergency response procedures.</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
                  <h3 className="text-cyan-400 font-bold mb-2">Real Case Studies</h3>
                  <p className="text-gray-300 text-sm">How facilities reduced outage risk, improved reliability, and optimized costs.</p>
                </div>
              </div>

              <a
                href="https://youtube.com/@emersoneims"
                target="_blank"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Subscribe on YouTube
              </a>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 rounded-lg p-8">
              <div className="aspect-video bg-slate-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">▶️</div>
                  <p className="text-gray-400">Watch on YouTube</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <p className="font-bold">📺 New videos every Tuesday & Thursday</p>
                <p className="font-bold">⚙️ 10-15 min technical deep dives</p>
                <p className="font-bold">🏭 Real facilities, real challenges</p>
                <p className="font-bold">✓ Transcribed for accessibility</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg p-8">
              <div className="aspect-video bg-slate-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎙️</div>
                  <p className="text-gray-400">Listen on Spotify, Apple Podcasts</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <p className="font-bold">🎧 Weekly episodes (Mondays)</p>
                <p className="font-bold">👥 Real industry guests & operators</p>
                <p className="font-bold">💬 Honest conversation, real data</p>
                <p className="font-bold">📝 Full transcripts available</p>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">Africa Power Infrastructure Podcast</h2>
              <p className="text-lg text-gray-300 mb-6">
                <strong>Real conversations with industry leaders.</strong> Every week, we interview mining operators, healthcare administrators, telecom engineers, and government officials about Africa's power challenges and solutions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg">
                  <h3 className="text-purple-400 font-bold mb-2">Mining & Extraction</h3>
                  <p className="text-gray-300 text-sm">"How we went from 20 outages/month to zero" — actual operators share real results.</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg">
                  <h3 className="text-purple-400 font-bold mb-2">Healthcare & Critical Infrastructure</h3>
                  <p className="text-gray-300 text-sm">Why patient safety depends on reliable power — regulatory requirements and solutions.</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg">
                  <h3 className="text-purple-400 font-bold mb-2">Industry Trends & Data</h3>
                  <p className="text-gray-300 text-sm">What African power infrastructure challenges mean for business and investment.</p>
                </div>
              </div>

              <a
                href="https://podcasts.apple.com/ke/podcast/africa-power-infrastructure"
                target="_blank"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Listen on Apple Podcasts
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Episodes / Videos */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Latest Content</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="mb-4">
                <span className="text-cyan-400 font-bold text-sm">YOUTUBE</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Generator Sizing 101: How to Calculate kVA</h3>
              <p className="text-gray-300 text-sm mb-4">
                Step-by-step walkthrough of how to correctly size a backup generator for your facility. Real calculations, real examples.
              </p>
              <p className="text-xs text-gray-400">8 min • Technical • Beginner-friendly</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="mb-4">
                <span className="text-purple-400 font-bold text-sm">PODCAST</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Mining Operations: Power Reliability at Scale</h3>
              <p className="text-gray-300 text-sm mb-4">
                Interview with a mining facility manager about how they eliminated outages across 5 sites and what it meant for production and safety.
              </p>
              <p className="text-xs text-gray-400">38 min • Interview • Real data</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="mb-4">
                <span className="text-cyan-400 font-bold text-sm">YOUTUBE</span>
              </div>
              <h3 className="text-lg font-bold mb-3">UPS vs Generator: When to Use Each</h3>
              <p className="text-gray-300 text-sm mb-4">
                Understanding the difference between UPS systems and generators. Real examples of when each technology solves the problem.
              </p>
              <p className="text-xs text-gray-400">12 min • Technical • Beginner-friendly</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="mb-4">
                <span className="text-purple-400 font-bold text-sm">PODCAST</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Healthcare Administration: Backup Power and Patient Safety</h3>
              <p className="text-gray-300 text-sm mb-4">
                Hospital administrator discusses regulatory requirements, real-world outage impacts, and why backup power is non-negotiable.
              </p>
              <p className="text-xs text-gray-400">35 min • Interview • Healthcare focus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transcript Archive */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Searchable Archive</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Every video and podcast episode is fully transcribed. Search for topics, keywords, or guests.
          </p>

          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search: 'mining' 'outage' 'solar' 'healthcare' ..."
              className="w-full px-6 py-4 bg-slate-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg w-full">
              Search Content
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-8">
            Transcripts enable accessibility and help search engines find the specific topics covered in our content.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Learn. Decide. Act.</h2>
          <p className="text-lg text-gray-300 mb-10">
            Our media channel is designed to help you understand your power infrastructure challenges and make informed decisions. No sales pitch — just education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Read Blog Articles
            </a>
            <a
              href="/contact?type=assessment"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              Get Free Assessment
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
