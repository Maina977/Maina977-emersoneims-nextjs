import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Power Infrastructure Insights | EmersonEIMS Africa',
  description: 'Expert insights on power solutions, backup generators, mining infrastructure across Africa. Case studies, technical guides, ROI analysis.',
  alternates: {
    canonical: 'https://www.emersoneims.com/blog',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Power Infrastructure</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              Insights & Case Studies
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn from Africa's leading power experts. Real case studies, technical guides, ROI analysis.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Coming Soon</h2>
          <p className="text-center text-gray-300 text-lg">
            The blog infrastructure is ready. Case studies and technical articles coming across all industries and regions.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get Infrastructure Insights</h2>
          <p className="text-gray-300 mb-8">Be first to access new technical guides and case studies.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white" required />
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
