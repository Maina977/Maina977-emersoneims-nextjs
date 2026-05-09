import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, BLOG_ARTICLES } from '@/lib/data/blog-articles';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | Emerson EiMS Blog`,
    description: article.description,
    keywords: article.tags.join(', '),
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.updatedDate || article.date,
      authors: [article.author],
      tags: article.tags,
      url: `https://www.emersoneims.com/blog/${article.slug}`,
      siteName: 'Emerson EiMS',
      images: [
        {
          url: article.image || 'https://www.emersoneims.com/images/blog-default.jpg',
          width: 1200,
          height: 630,
          alt: article.imageAlt,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `https://www.emersoneims.com/blog/${article.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

// Simple markdown-like content renderer
function renderContent(content: string) {
  // Split content into sections
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <ListTag key={elements.length} className={listType === 'ol' ? 'list-decimal' : 'list-disc'}>
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      );
      currentList = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={elements.length} className="overflow-x-auto my-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {tableRows[0]?.map((cell, i) => (
                  <th key={i} className="border border-gray-700 bg-gray-800 px-4 py-2 text-left font-semibold">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).filter(row => !row[0]?.includes('---')).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-700 px-4 py-2">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Table row
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      flushList();
      inTable = true;
      const cells = trimmedLine.split('|').filter(c => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-white border-b border-gray-800 pb-2">
          {trimmedLine.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-bold mt-8 mb-3 text-white">
          {trimmedLine.replace('### ', '')}
        </h3>
      );
      return;
    }

    // List items
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      listType = 'ul';
      const content = trimmedLine.replace(/^[-*] /, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-500">$1</strong>');
      currentList.push(content);
      return;
    }

    if (/^\d+\. /.test(trimmedLine)) {
      listType = 'ol';
      const content = trimmedLine.replace(/^\d+\. /, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-500">$1</strong>');
      currentList.push(content);
      return;
    }

    // Flush list if we hit a non-list line
    flushList();

    // Horizontal rule
    if (trimmedLine === '---') {
      elements.push(<hr key={index} className="border-gray-700 my-8" />);
      return;
    }

    // Empty line
    if (trimmedLine === '') {
      return;
    }

    // Regular paragraph
    const formattedLine = trimmedLine
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-500">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    elements.push(
      <p key={index} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
    );
  });

  flushList();
  flushTable();

  return elements;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Schema.org Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                url: 'https://www.emersoneims.com/logo.png'
              }
            },
            datePublished: article.date,
            dateModified: article.updatedDate || article.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.emersoneims.com/blog/${article.slug}`
            }
          })
        }}
      />

      {/* FAQ Schema if article has FAQs */}
      {article.faqs && article.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.emersoneims.com/blog' },
              { '@type': 'ListItem', position: 3, name: article.title, item: `https://www.emersoneims.com/blog/${article.slug}` }
            ]
          })
        }}
      />

      {/* Article Header */}
      <header className="relative py-16 px-4 bg-gradient-to-b from-amber-900/30 to-black">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-amber-500">{article.category}</span>
          </nav>

          <span className="inline-block px-3 py-1 bg-amber-500 text-black text-sm font-medium rounded-full mb-4">
            {article.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-300 mb-6">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.date).toLocaleDateString('en-KE', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-amber prose-lg">
          {renderContent(article.content)}
        </div>
      </article>

      {/* FAQ Section */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="py-12 px-4 bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked <span className="text-amber-500">Questions</span>
            </h2>
            <div className="space-y-6">
              {article.faqs.map((faq, index) => (
                <div key={index} className="bg-black/50 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {article.relatedServices && article.relatedServices.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Related Services</h2>
            <div className="flex flex-wrap gap-3">
              {article.relatedServices.map(service => (
                <Link
                  key={service}
                  href={`/kenya/nairobi/${service}`}
                  className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Counties */}
      {article.relatedCounties && article.relatedCounties.length > 0 && (
        <section className="py-8 px-4 bg-gradient-to-r from-cyan-500/10 to-amber-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold mb-4">Available in These Counties</h2>
            <div className="flex flex-wrap gap-2">
              {article.relatedCounties.map(county => (
                <Link
                  key={county}
                  href={`/kenya/${county}`}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  {county.charAt(0).toUpperCase() + county.slice(1)}
                </Link>
              ))}
              <Link
                href="/kenya"
                className="px-3 py-1 bg-cyan-500/20 rounded-full text-sm text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                + All 47 Counties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">
              Related <span className="text-amber-500">Articles</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <article className="bg-gray-900/50 rounded-lg p-5 border border-gray-800 hover:border-amber-500/50 transition-colors h-full">
                    <span className="text-xs text-amber-500">{related.category}</span>
                    <h3 className="font-bold mt-2 group-hover:text-amber-500 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">{related.readTime}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500/20 to-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need Expert Help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team of experienced engineers is ready to help with your generator and solar power needs.
            Contact us for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-amber-500 text-black rounded-xl font-bold hover:bg-amber-400 transition-colors"
            >
              Call +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              Request a Quote
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            <p>Email: info@emersoneims.com | Website: www.emersoneims.com</p>
            <p className="mt-1">Serving all 47 counties in Kenya</p>
          </div>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </section>
    </main>
  );
}

export const revalidate = 86400; // Revalidate every 24 hours
