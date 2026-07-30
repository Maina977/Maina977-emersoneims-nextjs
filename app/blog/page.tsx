import Link from 'next/link';
import { Metadata } from 'next';
import { BLOG_ARTICLES } from '@/lib/data/blog-articles';

/**
 * Blog index.
 *
 * WHY THIS WAS REWRITTEN (2026-07-31): this page displayed a "Coming Soon"
 * heading and linked to nothing, while 22 articles existed in
 * lib/data/blog-articles.ts, every one returning HTTP 200, 22 of them listed in
 * the sitemap, and at least one — the cost-per-kWh guide — among the better
 * performing pages on the whole site by real visitors.
 *
 * So Google was indexing the articles and sending people to them, while anyone
 * who clicked through to browse the blog was told there was nothing to read.
 *
 * The newsletter form at the bottom was removed at the same time. It was a bare
 * <form> with a submit button, no onSubmit handler and no endpoint — pressing
 * Subscribe did nothing whatsoever. Asking for an email address and discarding
 * it is worse than not asking, so it is replaced with routes that work.
 */

export const metadata: Metadata = {
  title: 'Blog | Power Infrastructure Insights | EmersonEIMS Africa',
  description:
    'Expert insights on generators, solar, backup power and electrical infrastructure in Kenya — buying guides, running costs, maintenance and safety, written by working engineers.',
  alternates: {
    canonical: 'https://www.emersoneims.com/blog',
  },
};

export default function BlogPage() {
  const articles = [...BLOG_ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
  const featured = articles.filter(a => a.featured).slice(0, 2);
  const featuredSlugs = new Set(featured.map(a => a.slug));
  const rest = articles.filter(a => !featuredSlugs.has(a.slug));
  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://www.emersoneims.com/blog#blog',
        name: 'EmersonEIMS Blog',
        description:
          'Power infrastructure insights for Kenya — generators, solar, backup power, running costs and safety.',
        url: 'https://www.emersoneims.com/blog',
        blogPost: articles.map(a => ({
          '@type': 'BlogPosting',
          headline: a.title,
          url: `https://www.emersoneims.com/blog/${a.slug}`,
          datePublished: a.date,
          author: { '@type': 'Organization', name: a.author || 'EmersonEIMS' },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.emersoneims.com/blog' },
        ],
      },
    ],
  };

  return (
    <>
      <script
        id="blog-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <main className="min-h-screen bg-black text-white">
        <section className="relative py-16 px-4 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              <span className="text-white">Power Infrastructure</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                Insights
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
              Buying guides, running costs, maintenance and safety — written by the engineers who do
              the work, for Kenyan conditions. {articles.length} articles.
            </p>
            {categories.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {categories.map(c => (
                  <li
                    key={c}
                    className="text-xs px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-300 bg-cyan-500/5"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="px-4 pt-14">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-sm uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-5">
                Start here
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {featured.map(a => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="group rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-7 hover:border-cyan-400/60 transition-colors"
                  >
                    <p className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
                      {a.category}
                    </p>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                      {a.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{a.excerpt}</p>
                    <p className="text-xs text-gray-500">
                      {a.date}
                      {a.readTime ? ` · ${a.readTime}` : ''}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 py-14">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">All articles</h2>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(a => (
                <li key={a.slug}>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="group block h-full rounded-xl border border-slate-700 bg-slate-900/50 p-6 hover:border-cyan-500/60 transition-colors"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-cyan-400 mb-2">
                      {a.category}
                    </p>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                      {a.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{a.excerpt}</p>
                    <p className="text-xs text-gray-500">
                      {a.date}
                      {a.readTime ? ` · ${a.readTime}` : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Real routes, not a subscribe box with nothing behind it. */}
        <section className="px-4 py-14 border-t border-slate-800 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Got a fault rather than a question?
            </h2>
            <p className="text-gray-300 mb-7">
              The Repair Centre carries 60 free diagnostic guides across 15 equipment categories, and
              our engineers cover all 47 counties.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/repair-centre"
                className="px-6 py-3 rounded-lg border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/10 transition-colors font-semibold"
              >
                Repair Centre
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
              >
                Talk to an engineer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
