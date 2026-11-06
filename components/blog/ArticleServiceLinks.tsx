import Link from 'next/link';
import { articleServiceLinks } from '@/lib/content/serviceLinks';

/**
 * "Related products and services" at the end of a hand-written article
 * (external audit, Nov 2026, §6.4). Server component; links only to the main
 * commercial pages listed in lib/content/serviceLinks.ts.
 */
export default function ArticleServiceLinks({ keys }: { keys: readonly string[] }) {
  const links = articleServiceLinks(keys);
  if (!links.length) return null;
  return (
    <section className="not-prose mx-auto max-w-4xl px-4 py-12" aria-labelledby="article-service-links">
      <h2 id="article-service-links" className="mb-6 text-xl font-bold text-white">Related products and services</h2>
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-400 transition-colors hover:bg-amber-500/20"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
