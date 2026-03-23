'use client';

/**
 * Service Detail Page - Client Component
 *
 * Interactive, conversion-focused service detail page
 * Phone: +254768860665 | WhatsApp: +254768860665
 */

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/lib/services/allServices';

// Dynamic import for AI Borehole Analyzer (only loads when needed)
const BoreholeAIAnalyzer = dynamic(
  () => import('@/components/borehole/BoreholeAIAnalyzer'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading AI Analyzer...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

interface ServiceDetailClientProps {
  service: Service;
  relatedServices: Service[];
  category: { id: string; name: string; icon: string } | undefined;
  trustBadges: { title: string; description: string; icon: string }[];
  contact: {
    phoneIntl: string;
    phoneDisplay: string;
    whatsappUrl: string;
    email: string;
    address: string;
    hours: { weekday: string; saturday: string; emergency: string };
  };
}

export default function ServiceDetailClient({
  service,
  relatedServices,
  category,
  trustBadges,
  contact
}: ServiceDetailClientProps) {
  // Check if this is a borehole-related service
  const isBoreholeService = service.slug?.includes('borehole') ||
                            service.name?.toLowerCase().includes('borehole') ||
                            service.category === 'water';

  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'faq' | 'ai-analyzer'>(
    isBoreholeService ? 'ai-analyzer' : 'overview'
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400 flex-wrap">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
              {category && (
                <>
                  <li>/</li>
                  <li className="text-slate-500">{category.name}</li>
                </>
              )}
              <li>/</li>
              <li className="text-white">{service.shortName}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Main Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Category Badge */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
                  <span>{service.icon}</span>
                  {category?.name}
                </span>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {service.name}
                </h1>

                {/* Tagline */}
                <p className="text-xl text-amber-400 font-medium mb-4">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-lg text-slate-300 mb-6">
                  {service.description}
                </p>

                {/* Key Benefits Quick View */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {service.benefits.slice(0, 4).map((benefit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300"
                    >
                      <span>{benefit.icon}</span>
                      {benefit.title}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`tel:${contact.phoneIntl}`}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                  >
                    <span>&#128222;</span>
                    <span>Call: {contact.phoneDisplay}</span>
                  </a>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp Quote</span>
                  </a>
                  <Link
                    href="/contact"
                    className="px-6 py-3 border-2 border-slate-600 text-white font-semibold rounded-lg hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
                  >
                    {service.primaryCTA}
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Quote Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:sticky lg:top-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Get a FREE Quote
              </h2>

              {/* Price Range */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                <div className="text-sm text-slate-400 mb-1">Price Range</div>
                <div className="text-2xl font-bold text-cyan-400">{service.priceRange}</div>
                <div className="text-sm text-slate-400 mt-1">{service.startingPrice}</div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${contact.phoneIntl}`}
                  className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all"
                >
                  <span className="text-2xl">&#128222;</span>
                  <div>
                    <div className="font-semibold text-white">Call Us Now</div>
                    <div className="text-cyan-400">{contact.phoneDisplay}</div>
                  </div>
                </a>

                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-900/30 border border-green-700/50 rounded-xl hover:bg-green-900/50 transition-all"
                >
                  <span className="text-2xl">&#128172;</span>
                  <div>
                    <div className="font-semibold text-white">WhatsApp</div>
                    <div className="text-green-400">Quick Response</div>
                  </div>
                </a>

                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${service.name}`)}`}
                  className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all"
                >
                  <span className="text-2xl">&#9993;</span>
                  <div>
                    <div className="font-semibold text-white">Email Us</div>
                    <div className="text-slate-400">{contact.email}</div>
                  </div>
                </a>
              </div>

              {/* Trust Signals */}
              <div className="space-y-2 pt-4 border-t border-slate-700">
                {service.warranties.slice(0, 3).map((warranty, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-slate-300">{warranty}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="py-6 px-4 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustBadges.slice(0, 4).map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-white font-medium">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {[
              // AI Analyzer tab only for borehole services
              ...(isBoreholeService ? [{ id: 'ai-analyzer', label: 'AI Site Analyzer', badge: 'NEW' }] : []),
              { id: 'overview', label: 'Overview' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'faq', label: 'FAQ' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? tab.id === 'ai-analyzer'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-cyan-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.id === 'ai-analyzer' && <span>🤖</span>}
                {tab.label}
                {'badge' in tab && tab.badge && (
                  <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* AI Borehole Analyzer Tab - Only for borehole services */}
        {activeTab === 'ai-analyzer' && isBoreholeService && (
          <motion.div
            key="ai-analyzer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-12 px-4">
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
                    <span className="animate-pulse">AI-POWERED</span>
                    <span>Kenya&apos;s Most Advanced Borehole Site Analysis</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    AI Borehole Site Analyzer
                  </h2>
                  <p className="text-slate-400 max-w-3xl mx-auto">
                    Upload a photo of your land and get instant AI-powered groundwater assessment using
                    satellite imagery, LiDAR, hyperspectral rock mapping, geophysics simulation, and GIS analysis.
                  </p>
                </div>

                {/* Technology Features */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-8">
                  {[
                    { icon: '🛰️', label: 'Sentinel-2' },
                    { icon: '📡', label: 'LiDAR' },
                    { icon: '💎', label: 'Hyperspectral' },
                    { icon: '⚡', label: 'Geophysics' },
                    { icon: '🗺️', label: 'GIS' },
                    { icon: '📋', label: 'EIA' },
                    { icon: '🇰🇪', label: '47 Counties' },
                  ].map((tech, i) => (
                    <div key={i} className="bg-slate-800/50 backdrop-blur rounded-lg p-2 text-center border border-slate-700">
                      <div className="text-xl mb-1">{tech.icon}</div>
                      <p className="text-white text-[10px] font-medium">{tech.label}</p>
                    </div>
                  ))}
                </div>

                {/* AI Analyzer Component */}
                <BoreholeAIAnalyzer />

                {/* AI Capabilities - Full Confidence */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30">
                    <div className="text-4xl mb-3">🛰️</div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Satellite Intelligence</h3>
                    <p className="text-sm text-slate-300">
                      Real-time Sentinel-2, Landsat-8 & MODIS satellite data. Same technology used by NASA and ESA for global water resource mapping.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Virtual Geophysics</h3>
                    <p className="text-sm text-slate-300">
                      AI-simulated VES & ERT surveys. No expensive equipment needed. Get subsurface layer analysis instantly from your desk.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-6 border border-green-500/30">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Precision Results</h3>
                    <p className="text-sm text-slate-300">
                      ML-powered analysis of 47 Kenya counties, historical borehole data, and geological formations. Make drilling decisions with confidence.
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Drill? We&apos;ve Got You Covered</h3>
                  <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                    From AI site analysis to professional drilling and pump installation - EmersonEIMS handles everything.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a href={`tel:${contact.phoneIntl}`} className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-cyan-50 transition-colors">
                      <span>📞</span> Call Now: {contact.phoneDisplay}
                    </a>
                    <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
                      <span>💬</span> WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Benefits Section */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Why Choose Our {service.shortName}?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all"
                    >
                      <div className="text-4xl mb-4">{benefit.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-slate-400">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Long Description */}
            <section className="py-16 px-4 bg-slate-900/50">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-invert prose-lg">
                  {service.longDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-slate-300 mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Features & Capabilities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center"
                    >
                      <span className="text-cyan-400">&#10003;</span>
                      <span className="ml-2 text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Target Customers */}
            <section className="py-16 px-4 bg-slate-900/50">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Who This Service Is For
                </h2>
                <p className="text-slate-400 mb-8">
                  Our {service.shortName.toLowerCase()} serve a wide range of industries and applications
                </p>
                <div className="flex flex-wrap gap-3">
                  {service.targetCustomers.map((customer, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300"
                    >
                      {customer}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {service.stats.map((stat, idx) => (
                    <div key={idx} className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <div className="text-4xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                      <div className="text-slate-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            {service.testimonials.length > 0 && (
              <section className="py-16 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-8">
                    What Our Clients Say
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {service.testimonials.map((testimonial, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl"
                      >
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-amber-400">&#9733;</span>
                          ))}
                        </div>
                        <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                        <div>
                          <div className="font-semibold text-white">{testimonial.name}</div>
                          <div className="text-sm text-slate-400">{testimonial.company}, {testimonial.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {service.shortName} Pricing
                  </h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    Transparent pricing with no hidden costs. Contact us for a detailed quote tailored to your needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {service.pricingTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`relative p-8 rounded-2xl border ${
                        tier.popular
                          ? 'bg-gradient-to-b from-cyan-900/30 to-slate-800/50 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-700'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white text-sm font-medium rounded-full">
                          Most Popular
                        </span>
                      )}

                      <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                      <p className="text-slate-400 text-sm mb-4">{tier.description}</p>

                      <div className="mb-6">
                        <div className="text-3xl font-bold text-cyan-400">{tier.price}</div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">&#10003;</span>
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-3 text-center rounded-lg font-semibold transition-all ${
                          tier.popular
                            ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                            : 'bg-slate-700 text-white hover:bg-slate-600'
                        }`}
                      >
                        Get Quote
                      </a>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <p className="text-slate-400 text-sm text-center">
                    <strong className="text-white">Note:</strong> Prices are indicative and may vary based on
                    specific requirements, site conditions, and current market rates. Contact us for an
                    accurate quote tailored to your needs.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-slate-400">
                    Common questions about our {service.shortName.toLowerCase()}
                  </p>
                </div>

                <div className="space-y-4">
                  {service.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/70 transition-colors"
                      >
                        <span className="font-semibold text-white pr-4">{faq.question}</span>
                        <span className={`text-cyan-400 transition-transform ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}>
                          &#9660;
                        </span>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-slate-300">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Still Have Questions */}
                <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Still Have Questions?</h3>
                  <p className="text-slate-300 mb-6">
                    Our team is ready to help. Contact us for personalized assistance.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href={`tel:${contact.phoneIntl}`}
                      className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-all"
                    >
                      Call {contact.phoneDisplay}
                    </a>
                    <a
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-all"
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Related Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map(related => (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all"
                >
                  <div className="text-3xl mb-3">{related.icon}</div>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {related.shortName}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started with {service.shortName}?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Contact us today for a free consultation and quote. {contact.hours.emergency}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href={`tel:${contact.phoneIntl}`}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">&#128222;</span>
              <div className="text-left">
                <div className="text-sm opacity-80">Call Now</div>
                <div className="font-bold">{contact.phoneDisplay}</div>
              </div>
            </a>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">&#128172;</span>
              <div className="text-left">
                <div className="text-sm opacity-80">WhatsApp</div>
                <div className="font-bold">Quick Quote</div>
              </div>
            </a>
          </div>

          <p className="text-slate-400">
            {contact.address}
          </p>
        </div>
      </section>
    </div>
  );
}
