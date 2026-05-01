'use client';

/**
 * Service Detail Page - Client Component
 *
 * Interactive, conversion-focused service detail page
 * Phone: +254768860665 | WhatsApp: +254768860665
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/lib/services/allServices';
import type { ServiceDiagnostics } from '@/lib/services/serviceDiagnostics';
import type { ServiceBible } from '@/lib/services/serviceBibles';
import ServiceDiagnosticsPanel from '@/components/services/ServiceDiagnosticsPanel';
import ServiceBiblePanel from '@/components/services/ServiceBiblePanel';
import ServiceWidgetsPanel from '@/components/services/ServiceWidgetsPanel';
import { SERVICE_WIDGETS } from '@/lib/services/serviceWidgets';

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
  diagnostics: ServiceDiagnostics | null;
  bible: ServiceBible | null;
}

type TabId = 'overview' | 'pricing' | 'faq' | 'ai-analyzer' | 'calculator' | 'bible';

export default function ServiceDetailClient({
  service,
  relatedServices,
  category,
  trustBadges,
  contact,
  diagnostics,
  bible,
}: ServiceDetailClientProps) {
  // Check if this is a borehole-related service
  const isBoreholeService = service.slug?.includes('borehole') ||
                            service.name?.toLowerCase().includes('borehole') ||
                            service.category === 'water';

  const hasDiagnostics = diagnostics !== null;
  const hasBible = bible !== null;

  const [activeTab, setActiveTab] = useState<TabId>(
    isBoreholeService ? 'ai-analyzer' : 'overview'
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Deep-link: /services/<slug>#calculator opens the embedded calculator tab.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#calculator' && hasDiagnostics) {
      setActiveTab('calculator');
      requestAnimationFrame(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (window.location.hash === '#bible' && hasBible) {
      setActiveTab('bible');
      requestAnimationFrame(() => {
        document.getElementById('bible')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hasDiagnostics, hasBible]);

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

                {/* Primary CTAs — kept tight: one quote action + one phone */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    {service.primaryCTA}
                  </Link>
                  <a
                    href={`tel:${contact.phoneIntl}`}
                    className="px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:border-cyan-500 hover:bg-cyan-500/10 transition-all flex items-center gap-2"
                  >
                    <span aria-hidden="true">&#128222;</span>
                    <span>{contact.phoneDisplay}</span>
                  </a>
                </div>

                {/* Secondary in-page links — quieter inline style */}
                {(hasDiagnostics || hasBible || SERVICE_WIDGETS[service.slug]) && (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {SERVICE_WIDGETS[service.slug] && (
                      <a href="#widgets" className="text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline">
                        Live engineering tools ↓
                      </a>
                    )}
                    {hasDiagnostics && (
                      <a href="#calculator" className="text-amber-300 hover:text-amber-200 underline-offset-4 hover:underline">
                        Sizing calculator ↓
                      </a>
                    )}
                    {hasBible && (
                      <a href="#bible" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline">
                        Technical reference ↓
                      </a>
                    )}
                  </div>
                )}
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
              ...(hasBible ? [{ id: 'bible', label: 'Technical Bible', badge: 'PRO' }] : []),
              ...(hasDiagnostics ? [{ id: 'calculator', label: 'Calculator & Diagnostics', badge: 'TOOLS' }] : []),
              { id: 'pricing', label: 'Pricing' },
              { id: 'faq', label: 'FAQ' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? tab.id === 'ai-analyzer'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : tab.id === 'calculator'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                        : tab.id === 'bible'
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black'
                          : 'bg-cyan-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.id === 'ai-analyzer' && <span>🤖</span>}
                {tab.id === 'calculator' && <span>🧮</span>}
                {tab.id === 'bible' && <span>📖</span>}
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
                  {/* World's First Badge */}
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg shadow-amber-500/30">
                    <span className="text-xl">🏆</span>
                    <span>WORLD&apos;S #1 AI BOREHOLE ANALYZER</span>
                    <span className="text-xl">🌍</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4 ml-2">
                    <span className="animate-pulse">26 AI ENGINES</span>
                    <span>•</span>
                    <span>195+ COUNTRIES</span>
                    <span>•</span>
                    <span>FREE</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    AquaScan Pro™ AI Borehole Analyzer
                  </h2>
                  <p className="text-slate-400 max-w-3xl mx-auto">
                    The world&apos;s most advanced AI platform for groundwater exploration.
                    195+ countries coverage. Same satellite technology used by NASA and ESA.
                  </p>
                </div>

                {/* Technology Features */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-8">
                  {[
                    { icon: '🛰️', label: 'Sentinel-2' },
                    { icon: '📡', label: 'LiDAR' },
                    { icon: '💎', label: 'Hyperspectral' },
                    { icon: '⚡', label: 'VES/ERT/TDEM' },
                    { icon: '🛸', label: 'NASA GRACE' },
                    { icon: '🌐', label: 'Google Earth' },
                    { icon: '🌍', label: '195+ Countries' },
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

        {activeTab === 'calculator' && diagnostics && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceDiagnosticsPanel
              serviceShortName={service.shortName}
              diagnostics={diagnostics}
              contactPhone={contact.phoneIntl}
              contactWhatsapp={contact.whatsappUrl}
            />
          </motion.div>
        )}

        {activeTab === 'bible' && bible && (
          <motion.div
            key="bible"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceBiblePanel
              bible={bible}
              contactPhoneDisplay={contact.phoneDisplay}
              contactWhatsappUrl={contact.whatsappUrl}
            />
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
            {/* NOTE: Why-Choose, Long-Description, Features and Who-For sections
                were moved OUTSIDE this tab (rendered always-visible after
                </AnimatePresence>) so they remain visible even when the
                default tab is AI-Analyzer (e.g. borehole pages). */}

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

            {/* Testimonials section removed per requirement: no fake/synthetic client quotes. */}
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

      {/* ====================================================================
           ALWAYS-VISIBLE SECTIONS (render regardless of active tab so the
           default AI-Analyzer tab on borehole pages does not hide content)
           ==================================================================== */}

      {/* Why Choose — always visible */}
      <section id="why-choose" className="py-16 px-4 scroll-mt-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Why Choose Our {service.shortName}?
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Tap any card to jump straight to the matching section on this page — no other pages, no extra clicks.
              </p>
            </div>
            {hasBible && (
              <a href="#bible" className="text-emerald-300 text-sm font-semibold hover:text-emerald-200 underline-offset-4 hover:underline">
                Open Technical Bible →
              </a>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.benefits.map((benefit, idx) => {
              const jumpTargets = hasBible
                ? ['#bible-intro', '#bible-brands', '#bible-install', '#bible-repair', '#bible-roi', '#bible-quality']
                : hasDiagnostics
                ? ['#calculator', '#troubleshooting']
                : ['#features'];
              const target = jumpTargets[idx % jumpTargets.length];
              const targetLabel = hasBible
                ? ['Engineering brief', 'Top 10 brands', 'Installation phases', 'Repair manual', 'ROI tables', 'Quality checks'][idx % 6]
                : hasDiagnostics
                ? ['Open calculator', 'Troubleshoot Q&A'][idx % 2]
                : 'See features';
              return (
                <a
                  key={idx}
                  href={target}
                  className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/60 hover:bg-slate-800 transition-all flex flex-col"
                >
                  <div className="text-4xl mb-4" aria-hidden="true">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{benefit.description}</p>
                  <div className="mt-4 text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    {targetLabel} <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Long description — always visible */}
      <section className="py-16 px-4 bg-slate-900/50 border-t border-slate-800">
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

      {/* Features & Capabilities — always visible */}
      <section id="features" className="py-16 px-4 scroll-mt-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Features &amp; Capabilities</h2>
              <p className="text-slate-400 mt-2 text-sm">
                {service.features.length} engineered capabilities — each opens the matching technical content on this page.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {hasDiagnostics && (
                <a href="#calculator" className="px-3 py-1.5 text-xs font-bold rounded-full border border-amber-500/60 text-amber-300 hover:bg-amber-500/10">🧮 Calculator</a>
              )}
              {hasBible && (
                <>
                  <a href="#bible-parts" className="px-3 py-1.5 text-xs font-bold rounded-full border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/10">🧰 Parts Manual</a>
                  <a href="#bible-repair" className="px-3 py-1.5 text-xs font-bold rounded-full border border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10">🛠️ Repair Manual</a>
                  <a href="#bible-errors" className="px-3 py-1.5 text-xs font-bold rounded-full border border-red-500/60 text-red-300 hover:bg-red-500/10">⚠️ Error Codes</a>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {service.features.map((feature, idx) => {
              const featureTargets = hasBible
                ? ['#bible-install', '#bible-parts', '#bible-repair', '#bible-errors', '#bible-quality', '#bible-diagrams', '#bible-brands', '#bible-roi']
                : hasDiagnostics
                ? ['#calculator', '#troubleshooting']
                : ['#why-choose'];
              const target = featureTargets[idx % featureTargets.length];
              const sectionLabel = hasBible
                ? ['Installation', 'Parts list', 'Repair steps', 'Error codes', 'Quality checks', 'Diagrams', 'Brand specs', 'ROI'][idx % 8]
                : hasDiagnostics
                ? ['Calculator', 'Diagnostic Q&A'][idx % 2]
                : 'Details';
              return (
                <a
                  key={idx}
                  href={target}
                  className="group p-5 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/60 hover:bg-slate-800 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-100 text-sm font-semibold leading-snug">{feature}</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1 mt-auto">
                    {sectionLabel} <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who This Service Is For — always visible */}
      <section id="who-for" className="py-16 px-4 bg-slate-900/50 scroll-mt-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Who This Service Is For</h2>
          <p className="text-slate-400 mb-8 text-sm md:text-base">
            {service.targetCustomers.length} industries we serve across Kenya — tap a card to message us about that specific use-case.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {service.targetCustomers.map((customer, idx) => {
              const useCase = service.useCases[idx % Math.max(service.useCases.length, 1)];
              const waText = encodeURIComponent(
                `Hello, I am from a ${customer} and I need a quote for ${service.name}.`
              );
              return (
                <a
                  key={idx}
                  href={`https://wa.me/${contact.whatsappUrl.split('/').pop()?.split('?')[0] || '254768860665'}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-emerald-500/60 hover:bg-slate-800 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl" aria-hidden="true">{category?.icon ?? '🏢'}</span>
                    <h3 className="text-white font-bold text-base group-hover:text-emerald-300 transition-colors">{customer}</h3>
                  </div>
                  {useCase && (
                    <p className="text-slate-400 text-xs leading-relaxed flex-1">Typical project: {useCase}</p>
                  )}
                  <div className="mt-4 text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                    💬 WhatsApp us <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${contact.phoneIntl}`} className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm">
              📞 Call {contact.phoneDisplay}
            </a>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Always-visible Interactive Engineering Widgets (per-service) */}
      {SERVICE_WIDGETS[service.slug] && (
        <ServiceWidgetsPanel slug={service.slug} serviceName={service.shortName} />
      )}

      {/* Always-visible Calculator & Diagnostics section */}
      {diagnostics && (
        <section className="border-t border-slate-800 bg-slate-950">
          <ServiceDiagnosticsPanel
            serviceShortName={service.shortName}
            diagnostics={diagnostics}
            contactPhone={contact.phoneIntl}
            contactWhatsapp={contact.whatsappUrl}
          />
        </section>
      )}

      {/* Always-visible Technical Bible section */}
      {bible && (
        <section className="border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
          <ServiceBiblePanel
            bible={bible}
            contactPhoneDisplay={contact.phoneDisplay}
            contactWhatsappUrl={contact.whatsappUrl}
          />
        </section>
      )}

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
