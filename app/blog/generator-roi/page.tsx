import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/blog/generator-roi' },
  title: 'Backup Power ROI: When Does It Make Financial Sense?',
  description: 'Calculate your backup power ROI. Real numbers, transparent methodology, honest assessment.',
};

export default function GeneratorRoiPost() {
  return (
    <article className="min-h-screen bg-black text-white">
      <header className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">← Back to Blog</Link>
          <h1 className="text-5xl font-bold mb-4">Backup Power ROI: When Does It Make Financial Sense?</h1>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>July 24, 2026</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Finance</span>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-3xl mx-auto prose prose-invert max-w-none">
          <h2>The ROI Question: Is Backup Power Worth the Investment?</h2>

          <p>
            The answer: <strong>almost always yes for facilities experiencing regular outages</strong>, but the calculation must be facility-specific.
          </p>

          <h2>The Math</h2>

          <ul>
            <li><strong>Typical backup power investment:</strong> KES 500K - 5M (depending on facility size)</li>
            <li><strong>Typical cost per hour of outage:</strong> KES 100K - 2M (industry/facility dependent)</li>
            <li><strong>Typical payback:</strong> One major outage prevented = ROI achieved</li>
          </ul>

          <p>
            Most facilities break even within 6-18 months. The real value compounds over years through operational reliability and competitive advantage.
          </p>

          <h2>Beyond ROI: The Strategic Value</h2>

          <ul>
            <li>Meet delivery deadlines consistently</li>
            <li>Comply with industry regulations and SLAs</li>
            <li>Protect equipment worth far more than backup power investment</li>
            <li>Improve team productivity and morale</li>
          </ul>

          <h2>The Assessment Step Matters</h2>

          <p>
            Before investing, understand: How often do you lose power? For how long? What's the real financial impact on your operation? A professional assessment answers these questions with data specific to your facility.
          </p>

          <div className="not-prose my-12">
            <Link href="/contact?type=power-assessment" className="inline-block px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg">
              Get Your ROI Assessment
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
