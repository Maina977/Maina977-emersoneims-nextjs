/**
 * Repair Centre article metadata description and JSON-LD.
 *
 * Extracted from app/repair-centre/[hub]/[slug]/page.tsx (content-safety
 * withdrawal, 2026-11-25) so the structured data can be tested against the
 * visible article: whatever is withdrawn from the article data is withdrawn
 * from the markup too. Output is unchanged for articles without a
 * metaDescription override.
 */
import type { RepairArticle } from './types';

/** Meta, OG, Twitter and TechArticle description for an article. */
export function repairArticleDescription(article: RepairArticle): string {
  return article.metaDescription ?? article.directAnswer.slice(0, 300);
}

export function repairArticleUrl(article: RepairArticle): string {
  return `https://www.emersoneims.com/repair-centre/${article.hub}/${article.slug}`;
}

export function buildRepairArticleJsonLd(article: RepairArticle, url: string = repairArticleUrl(article)) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: article.header.title,
        description: repairArticleDescription(article),
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
}
