import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllRepairArticleSlugs, getRepairArticle } from '@/lib/repair-centre';
import RepairArticleView from '@/components/repair-centre/RepairArticleView';

interface Props { params: Promise<{ hub: string; slug: string }> }

// Every published article is enumerable from the registry below, so any other
// (hub, slug) pair must be a hard 404 rather than a 200 carrying a
// "Not found" body.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllRepairArticleSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub, slug } = await params;
  const a = getRepairArticle(slug);

  // Unknown or mismatched params must not render. Note that neither this call
  // nor dynamicParams=false actually produces a 404 STATUS on Next 16 + Vercel
  // — both were tried and /repair-centre/ups/this-article-does-not-exist-xyz
  // still answered HTTP 200. The authoritative 404 comes from guard 0f in
  // middleware.ts; keep the article list there in sync with the registry.
  // The hub check matters too: a real slug under the wrong hub would otherwise
  // emit a canonical pointing somewhere the reader never requested.
  if (!a || a.hub !== hub) notFound();

  const url = `https://www.emersoneims.com/repair-centre/${a.hub}/${a.slug}`;
  const description = a.directAnswer.slice(0, 300);

  /*
   * Article headlines are written for the page, not for a search result:
   * "ATS Contactor, Motor Operator and Interlock Faults — When the Switch
   * Itself Fails" is 80 characters before the root layout appends
   * " | EmersonEIMS Kenya", so every one of these 76 pages was truncated in
   * the SERP — and truncated mid-subtitle, where the useful words are not.
   *
   * The em-dash separates topic from subtitle in this collection, so the part
   * before it IS the searchable topic. The full headline stays exactly as it
   * is on the page and in the H1; only the <title> is shortened. Titles with
   * no em-dash are left untouched rather than cut at an arbitrary width.
   */
  const seoTitle = a.header.title.split('—')[0].trim() || a.header.title;

  return {
    title: seoTitle,
    description,
    keywords: [a.header.equipmentCategory, a.header.title, 'fault diagnosis', 'repair guide', 'Kenya'],
    alternates: { canonical: url },
    openGraph: { title: a.header.title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title: a.header.title, description },
  };
}

export default async function RepairArticlePage({ params }: Props) {
  const { hub, slug } = await params;
  const article = getRepairArticle(slug);
  if (!article || article.hub !== hub) notFound();

  const url = `https://www.emersoneims.com/repair-centre/${article.hub}/${article.slug}`;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: article.header.title,
        description: article.directAnswer.slice(0, 300),
        url,
        datePublished: article.header.published,
        dateModified: article.header.lastReviewed,
        author: { '@type': 'Organization', name: article.header.author },
        publisher: {
          '@type': 'Organization',
          name: 'Emerson Industrial Maintenance Services',
          url: 'https://www.emersoneims.com',
        },
        proficiencyLevel: article.header.difficulty,
        dependencies: article.tools.map(t => t.tool).join(', '),
        articleSection: article.header.equipmentCategory,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Repair Centre', item: 'https://www.emersoneims.com/repair-centre' },
          { '@type': 'ListItem', position: 3, name: article.hub, item: `https://www.emersoneims.com/repair-centre/${article.hub}` },
          { '@type': 'ListItem', position: 4, name: article.header.title, item: url },
        ],
      },
      ...(article.faq.length
        ? [{
            '@type': 'FAQPage',
            mainEntity: article.faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script id={`article-ld-${article.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="min-h-screen bg-slate-950">
        <RepairArticleView article={article} />
      </main>
    </>
  );
}
