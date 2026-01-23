import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_ARTICLES, BLOG_CATEGORIES, getFeaturedArticles } from '@/lib/data/blog-articles';

export const metadata: Metadata = {
  title: 'Generator & Solar Blog | Expert Insights Kenya | Emerson EiMS',
  description: 'Expert articles on generator maintenance, solar power, cost savings, and safety tips for Kenya. Free guides from 15+ years of experience. Updated weekly.',
  keywords: [
    'generator blog Kenya',
    'solar power articles Kenya',
    'generator maintenance tips',
    'diesel generator guide',
    'solar installation Kenya',
    'power solutions blog',
    'generator safety tips',
    'generator buying guide Kenya',
  ].join(', '),
  openGraph: {
    title: 'Generator & Solar Power Blog | Emerson EiMS Kenya',
    description: 'Expert articles and guides on generators and solar power for Kenya. Free tips from industry professionals.',
    type: 'website',
    url: 'https://www.emersoneims.com/blog',
    siteName: 'Emerson EiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/blog',
  },
};

export default function BlogPage() {
  const featuredArticles = getFeaturedArticles();
  const allArticles = BLOG_ARTICLES;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Schema.org JSON-LD for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Emerson EiMS Power Solutions Blog',
            description: 'Expert articles on generators, solar power, and energy solutions in Kenya',
            url: 'https://www.emersoneims.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Emerson EiMS',
              url: 'https://www.emersoneims.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.emersoneims.com/logo.png'
              }
            },
            blogPost: allArticles.slice(0, 10).map(article => ({
              '@type': 'BlogPosting',
              headline: article.title,
              description: article.description,
              datePublished: article.date,
              author: {
                '@type': 'Organization',
                name: article.author
              },
              url: `https://www.emersoneims.com/blog/${article.slug}`
            }))
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-amber-900/20 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm mb-4">
            Expert Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Power Solutions <span className="text-amber-500">Knowledge Base</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Free guides, tips, and expert articles on generators, solar power,
            and energy solutions for Kenya. Written by our 15+ years experienced team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {allArticles.length} Expert Articles
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Updated Weekly
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Kenya-Focused Content
            </span>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured <span className="text-amber-500">Articles</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group"
              >
                <article className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all duration-300 hover:transform hover:scale-[1.02] h-full flex flex-col">
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {article.category === 'Generators' && '⚡'}
                        {article.category === 'Solar' && '☀️'}
                        {article.category === 'Maintenance' && '🔧'}
                        {article.category === 'Safety' && '🛡️'}
                        {article.category === 'Buying Guide' && '🛒'}
                        {article.category === 'Cost Savings' && '💰'}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-black text-sm font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>{new Date(article.date).toLocaleDateString('en-KE', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-amber-500 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-400 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="mt-4 flex items-center text-amber-500 font-semibold">
                      Read Article
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            All <span className="text-amber-500">Articles</span>
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {BLOG_CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-5 py-2 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300 text-sm cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group"
              >
                <article className="bg-black/50 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all h-full flex flex-col">
                  {/* Mini Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-4xl opacity-30">
                      {article.category === 'Generators' && '⚡'}
                      {article.category === 'Solar' && '☀️'}
                      {article.category === 'Maintenance' && '🔧'}
                      {article.category === 'Safety' && '🛡️'}
                      {article.category === 'Buying Guide' && '🛒'}
                      {article.category === 'Cost Savings' && '💰'}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="text-amber-500">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-bold mb-2 group-hover:text-amber-500 transition-colors line-clamp-2 flex-1">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics / Internal Links */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Popular <span className="text-amber-500">Topics</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Generator Maintenance', href: '/blog/generator-maintenance-tips-kenya' },
              { label: 'Solar Installation', href: '/blog/solar-energy-solutions-kenya' },
              { label: 'Cost Savings', href: '/blog/generator-cost-saving-strategies' },
              { label: 'Buying Guide', href: '/blog/generator-buying-guide-kenya' },
              { label: 'Safety Tips', href: '/blog/generator-safety-tips-kenya' },
              { label: 'Fire Prevention', href: '/blog/generator-fire-safety-prevention' },
            ].map(topic => (
              <Link
                key={topic.href}
                href={topic.href}
                className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service Links for SEO */}
      <section className="py-12 px-4 bg-gradient-to-r from-amber-500/10 to-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Our Services Across Kenya</h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/kenya/nairobi/generator-companies" className="text-gray-400 hover:text-amber-400">Generator Companies Nairobi</Link>
            <span className="text-gray-600">|</span>
            <Link href="/kenya/mombasa/generator-repairs" className="text-gray-400 hover:text-amber-400">Generator Repairs Mombasa</Link>
            <span className="text-gray-600">|</span>
            <Link href="/kenya/kisumu/generator-maintenance" className="text-gray-400 hover:text-amber-400">Maintenance Kisumu</Link>
            <span className="text-gray-600">|</span>
            <Link href="/kenya/nakuru/solar-installation" className="text-gray-400 hover:text-amber-400">Solar Nakuru</Link>
            <span className="text-gray-600">|</span>
            <Link href="/kenya" className="text-amber-400 hover:text-amber-300">All 47 Counties</Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get <span className="text-amber-500">Expert Tips</span> in Your Inbox
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to receive free guides, maintenance reminders, and exclusive
            offers from Emerson EiMS. No spam, unsubscribe anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:opacity-90 transition-opacity text-black">
              Subscribe Free
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Join 2,000+ Kenyans who receive our power tips newsletter
          </p>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-12 px-4 bg-amber-500/10 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Need Expert Help?</h3>
              <p className="text-gray-400">Our team is ready to assist with your power needs</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254768860665"
                className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
              >
                Call +254 768 860 665
              </a>
              <a
                href="https://wa.me/254768860665"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors"
              >
                WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
