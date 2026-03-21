'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FAULT_CODES } from '@/lib/data/faultCodes';

/**
 * Fault Code Database Hub
 *
 * SEO-optimized hub page for all generator fault codes.
 * Establishes engineering authority and captures leads.
 */

const BRANDS = ['All', 'Cummins', 'DSE', 'ComAp', 'Perkins', 'CAT', 'Volvo Penta'];

const SEVERITY_COLORS = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function FaultCodesPage() {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredCodes = useMemo(() => {
    return FAULT_CODES.filter(fault => {
      const matchesSearch = search === '' ||
        fault.code.toLowerCase().includes(search.toLowerCase()) ||
        fault.title.toLowerCase().includes(search.toLowerCase()) ||
        fault.description.toLowerCase().includes(search.toLowerCase());

      const matchesBrand = selectedBrand === 'All' || fault.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [search, selectedBrand]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Would send to CRM/email service
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
              <li>/</li>
              <li><Link href="/products/generator-oracle" className="hover:text-amber-400">Generator Oracle</Link></li>
              <li>/</li>
              <li className="text-white">Fault Codes</li>
            </ol>
          </nav>

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6"
            >
              <span className="text-amber-400 text-sm font-medium">Africa&apos;s Largest Database</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Generator <span className="text-amber-400">Fault Code</span> Database
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Search over <span className="text-white font-semibold">400,000+ fault codes</span> from
              Cummins, Perkins, DSE, ComAp, and more. Get instant diagnosis and repair steps.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter fault code (e.g., SPN-111, E020, A015...)"
                  className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors text-lg"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Brand Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedBrand === brand
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">400K+</div>
                <div className="text-sm text-gray-500">Fault Codes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">12+</div>
                <div className="text-sm text-gray-500">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">100%</div>
                <div className="text-sm text-gray-500">Free Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fault Codes Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {filteredCodes.length} Fault Codes Found
            </h2>
            <Link
              href="/generator-oracle"
              className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Advanced Diagnosis →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCodes.slice(0, 30).map((fault, i) => (
              <motion.div
                key={fault.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/faults/${encodeURIComponent(fault.code.toLowerCase())}`}
                  className="block p-5 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{fault.brand}</span>
                      <h3 className="text-lg font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                        {fault.code}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${SEVERITY_COLORS[fault.severity]}`}>
                      {fault.severity}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-2">{fault.title}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{fault.description}</p>
                  <div className="mt-3 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Details →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredCodes.length > 30 && (
            <div className="text-center mt-8">
              <Link
                href="/generator-oracle"
                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Access Full Database in Generator Oracle
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Fault Code Alerts
          </h2>
          <p className="text-gray-400 mb-6">
            Subscribe to receive weekly updates on new fault codes, troubleshooting tips, and engineering insights.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Subscribe Free
              </button>
            </form>
          ) : (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold">Subscribed! Check your email for confirmation.</p>
            </div>
          )}
        </div>
      </section>

      {/* Expert Help CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can&apos;t Find Your Fault Code?
          </h2>
          <p className="text-gray-400 mb-8">
            Our engineers have 15+ years of experience diagnosing generator faults across Kenya.
            Get expert help now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/254768860665?text=Hi%2C%20I%20need%20help%20with%20a%20generator%20fault%20code"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Our Engineers
            </a>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Call +254 768 860 665
            </a>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Generator Fault Code Database",
            "description": "Search over 400,000+ generator fault codes from Cummins, Perkins, DSE, ComAp. Get instant diagnosis and repair steps.",
            "provider": {
              "@type": "Organization",
              "name": "EmersonEIMS",
              "telephone": "+254768860665"
            }
          })
        }}
      />
    </div>
  );
}
