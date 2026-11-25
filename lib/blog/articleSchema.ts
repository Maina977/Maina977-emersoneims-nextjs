/**
 * JSON-LD for /blog/[slug] (Article, FAQPage when the article has FAQs,
 * BreadcrumbList). Extracted from app/blog/[slug]/page.tsx on 2026-11-25 so
 * the content-safety withdrawal tests can prove the structured data matches
 * the visible page. Output is identical to the former inline objects.
 */
import type { BlogArticle } from '@/lib/data/blog-articles';

export function buildBlogArticleSchema(article: BlogArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || 'https://www.emersoneims.com/images/blog-default.jpg',
    author: {
      '@type': 'Organization',
      name: article.author,
      url: 'https://www.emersoneims.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Emerson EiMS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emersoneims.com/emerson-eims-logo.png'
      }
    },
    datePublished: article.date,
    dateModified: article.updatedDate || article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.emersoneims.com/blog/${article.slug}`
    }
  };
}

/** null when the article has no FAQs (the page then emits no FAQPage). */
export function buildBlogFaqSchema(article: BlogArticle) {
  if (!article.faqs || article.faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function buildBlogBreadcrumbSchema(article: BlogArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.emersoneims.com/blog' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://www.emersoneims.com/blog/${article.slug}` }
    ]
  };
}

/** Every JSON-LD object the page emits, in page order. */
export function buildBlogArticleJsonLd(article: BlogArticle) {
  const faq = buildBlogFaqSchema(article);
  return [buildBlogArticleSchema(article), ...(faq ? [faq] : []), buildBlogBreadcrumbSchema(article)];
}
