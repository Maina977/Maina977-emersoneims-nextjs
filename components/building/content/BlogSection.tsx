'use client';

/**
 * BLOG/CONTENT SECTION
 * SEO-optimized blog with articles
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import OptimizedImage from '@/components/media/OptimizedImage';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
  slug: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  featured?: boolean;
}

export default function BlogSection({ posts, featured = false }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Latest Insights
          </h2>
          <p className="text-xl text-gray-400">
            Expert articles on energy infrastructure and solutions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-brand-gold text-black font-semibold'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featured && filteredPosts.length > 0 && (
          <motion.div
            className="mb-12 bg-gradient-to-r from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-64 md:h-full min-h-[400px]">
                <OptimizedImage
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-brand-gold text-sm font-semibold mb-2">
                  {filteredPosts[0].category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {filteredPosts[0].title}
                </h3>
                <p className="text-gray-400 mb-6">{filteredPosts[0].excerpt}</p>
                <Link
                  href={`/blog/${filteredPosts[0].slug}`}
                  className="cta-button-primary inline-block"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(featured ? 1 : 0).map((post) => (
            <motion.article
              key={post.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-gold/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48">
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-brand-gold text-sm font-semibold">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

