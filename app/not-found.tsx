'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  // Popular pages for suggestions
  const popularPages = [
    { name: 'Generators', href: '/generators', icon: '⚡' },
    { name: 'Solar Power', href: '/solar', icon: '☀️' },
    { name: 'Services', href: '/services', icon: '🔧' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    { name: 'About Us', href: '/about', icon: '🏢' },
    { name: 'Blog', href: '/blog', icon: '📰' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 -z-10" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not <span className="text-orange-500">Found</span>
        </h2>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let us help you find what you need.
        </p>

        {/* Quick Search */}
        <div className="mb-8">
          <div className="flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search our site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-l-lg focus:border-orange-500 focus:outline-none transition"
            />
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}`}
              className="px-6 py-3 bg-orange-500 rounded-r-lg hover:bg-orange-600 transition"
            >
              🔍
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-8">
          <p className="text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-orange-500 hover:bg-orange-500/10 transition-all flex items-center gap-2"
              >
                <span>{page.icon}</span>
                <span>{page.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Homepage
        </Link>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 mb-4">Still can&apos;t find what you need?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a 
              href="tel:0768860655" 
              className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition"
            >
              <span>📞</span> 0768 860 655
            </a>
            <a 
              href="tel:0782914717" 
              className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition"
            >
              <span>📞</span> 0782 914 717
            </a>
            <a 
              href="https://wa.me/254768860655" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-500 hover:text-green-400 transition"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

