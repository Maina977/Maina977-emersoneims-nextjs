import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog | Expert Insights on Generators & Solar Power in Kenya',
  description: 'Read expert articles about generator maintenance, solar power installation, energy efficiency tips, and power solutions for Kenya. Free guides from Emerson Energy.',
  keywords: 'generator blog Kenya, solar power articles, energy tips, backup power guide, generator maintenance, solar installation Kenya',
  openGraph: {
    title: 'Blog | Emerson Energy - Power Solutions Expert',
    description: 'Expert articles and guides on generators and solar power for Kenya',
    type: 'website',
  },
};

// Blog articles data
const blogArticles = [
  {
    id: 'complete-guide-generator-sizing-kenya',
    title: 'Complete Guide to Generator Sizing in Kenya',
    excerpt: 'Learn how to calculate the right generator size for your home or business. Includes formulas, examples, and expert tips for Kenyan power requirements.',
    image: '/images/generators/generator-sizing.jpg',
    category: 'Generators',
    date: '2025-01-15',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 'solar-power-investment-roi-kenya',
    title: 'Solar Power ROI: Is Solar Worth It in Kenya 2025?',
    excerpt: 'A detailed analysis of solar panel investment in Kenya. Calculate your payback period, understand tariff savings, and maximize your solar investment returns.',
    image: '/images/solar/solar-roi.jpg',
    category: 'Solar',
    date: '2025-01-12',
    readTime: '10 min read',
    featured: true,
  },
  {
    id: 'generator-maintenance-checklist',
    title: '47-Point Generator Maintenance Checklist',
    excerpt: 'The ultimate maintenance guide to extend your generator lifespan. Daily, weekly, monthly, and annual maintenance tasks explained by our expert technicians.',
    image: '/images/generators/maintenance.jpg',
    category: 'Maintenance',
    date: '2025-01-10',
    readTime: '12 min read',
    featured: true,
  },
  {
    id: 'diesel-vs-petrol-generators',
    title: 'Diesel vs Petrol Generators: Which Is Right for You?',
    excerpt: 'Compare fuel efficiency, maintenance costs, lifespan, and performance between diesel and petrol generators. Make an informed buying decision.',
    image: '/images/generators/diesel-petrol.jpg',
    category: 'Generators',
    date: '2025-01-08',
    readTime: '6 min read',
  },
  {
    id: 'solar-battery-storage-guide',
    title: 'Solar Battery Storage: Complete Kenya Guide 2025',
    excerpt: 'Everything you need to know about solar batteries in Kenya. Types, sizing, costs, and how to choose the best battery for your solar system.',
    image: '/images/solar/battery-storage.jpg',
    category: 'Solar',
    date: '2025-01-05',
    readTime: '9 min read',
  },
  {
    id: 'kenya-power-outages-solutions',
    title: 'How to Protect Your Business From Kenya Power Outages',
    excerpt: 'Strategies to minimize downtime during power cuts. UPS systems, automatic transfer switches, and hybrid power solutions explained.',
    image: '/images/solutions/power-protection.jpg',
    category: 'Solutions',
    date: '2025-01-02',
    readTime: '7 min read',
  },
];

// Categories for filtering
const categories = ['All', 'Generators', 'Solar', 'Maintenance', 'Solutions'];

export default function BlogPage() {
  const featuredArticles = blogArticles.filter(a => a.featured);
  const regularArticles = blogArticles.filter(a => !a.featured);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-orange-900/20 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expert <span className="text-orange-500">Power Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Free guides, tips, and expert articles on generators, solar power, 
            and energy solutions for Kenya. Written by our 20+ years experienced team.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured <span className="text-orange-500">Articles</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.id}`}
                className="group"
              >
                <article className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:transform hover:scale-[1.02]">
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {article.category === 'Generators' && '⚡'}
                        {article.category === 'Solar' && '☀️'}
                        {article.category === 'Maintenance' && '🔧'}
                        {article.category === 'Solutions' && '💡'}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>{new Date(article.date).toLocaleDateString('en-KE', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-400 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="mt-4 flex items-center text-orange-500 font-semibold">
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
            All <span className="text-orange-500">Articles</span>
          </h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-6 py-2 rounded-full border border-gray-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.id}`}
                className="group"
              >
                <article className="bg-black/50 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all">
                  {/* Mini Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-4xl opacity-30">
                      {article.category === 'Generators' && '⚡'}
                      {article.category === 'Solar' && '☀️'}
                      {article.category === 'Maintenance' && '🔧'}
                      {article.category === 'Solutions' && '💡'}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="text-orange-500">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get <span className="text-orange-500">Expert Tips</span> in Your Inbox
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to receive free guides, maintenance reminders, and exclusive 
            offers from Emerson Energy. No spam, unsubscribe anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Subscribe Free
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Join 2,000+ Kenyans who receive our power tips newsletter
          </p>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-12 px-4 bg-orange-500/10 border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">
            Have questions? Call us: <a href="tel:+254768860665" className="text-orange-500 font-bold hover:underline">+254 768 860 665</a>
            {' '}or{' '}
            <a href="tel:+254782914717" className="text-orange-500 font-bold hover:underline">+254782914717</a>
          </p>
        </div>
      </section>
    </main>
  );
}
