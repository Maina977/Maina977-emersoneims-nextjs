import type { Metadata } from 'next';
import Script from 'next/script';
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

  // SOFT-404 FIX (2026-07-27): returning a "Not found" metadata object while
  // the page body called notFound() left Next.js serving HTTP 200 — verified
  // live on /repair-centre/ups/this-article-does-not-exist-xyz. Calling
  // notFound() HERE too makes the 404 status authoritative. The hub check
  // matters as well: a real slug under the wrong hub would otherwise emit a
  // canonical pointing somewhere the reader did not request. Same defect and
  // same fix as app/locations/[location]/[service]/page.tsx (2026-07-18).
  if (!a || a.hub !== hub) notFound();

  const url = `https://www.emersoneims.com/repair-centre/${a.hub}/${a.slug}`;
  const description = a.directAnswer.slice(0, 300);

  return {
    title: `${a.header.title} | EmersonEIMS`,
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
      <Script id={`article-ld-${article.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="min-h-screen bg-slate-950">
        <RepairArticleView article={article} />
      </main>
    </>
  );
}
