'use client';

/**
 * Services Index Page - All EmersonEIMS Services
 *
 * Conversion-focused page displaying all services with strong CTAs
 * Phone: +254768860665 | WhatsApp: +254768860665
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ALL_SERVICES,
  SERVICE_CATEGORIES,
  TRUST_BADGES,
  BUSINESS_CONTACT
} from '@/lib/services/allServices';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? ALL_SERVICES.filter(s => s.category === selectedCategory)
    : ALL_SERVICES;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Services</li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
                Complete Power Solutions
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Professional Services for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Every Power Need
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                From generators to solar, electrical to HVAC - EmersonEIMS delivers
                reliable power solutions backed by our industry-leading{' '}
                <span className="text-amber-400 font-semibold">3-Year Warranty</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                >
                  <span>Call Now</span>
                  <span className="text-cyan-200">{BUSINESS_CONTACT.phoneDisplay}</span>
                </a>
                <a
                  href={BUSINESS_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp for Quote</span>
                </a>
                <Link
                  href="/contact"
                  className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-lg hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
                >
                  Request FREE Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 px-4 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRUST_BADGES.map((badge, idx) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-semibold text-white text-sm">{badge.title}</div>
                <div className="text-slate-400 text-xs">{badge.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Services ({ALL_SERVICES.length})
            </button>
            {SERVICE_CATEGORIES.map(cat => {
              const count = ALL_SERVICES.filter(s => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/services/${service.slug}`}>
                  <div className="group h-full bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                    {/* Service Image Header */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
                        {service.icon}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-slate-900/80 rounded-full text-xs text-slate-300">
                          {SERVICE_CATEGORIES.find(c => c.id === service.category)?.name}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-4xl">{service.icon}</span>
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Key Benefits */}
                      <div className="space-y-2 mb-4">
                        {service.benefits.slice(0, 3).map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-cyan-400">&#10003;</span>
                            <span className="text-slate-300">{benefit.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div>
                          <span className="text-xs text-slate-400">Starting from</span>
                          <div className="text-lg font-bold text-amber-400">{service.startingPrice}</div>
                        </div>
                        <div className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium group-hover:bg-cyan-500 group-hover:text-white transition-all">
                          Learn More
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured: Cummins 3-Year Warranty */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-y border-amber-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4">
                Featured Service
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Cummins Generators with{' '}
                <span className="text-amber-400">3-Year Warranty</span>
              </h2>
              <p className="text-slate-300 mb-6">
                As an authorized Cummins dealer, we offer premium generators from 10kVA to 2000kVA
                backed by the industry's best warranty. Professional installation, genuine parts,
                and 24/7 support.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">&#10003;</span>
                  <span>Industry-leading 3-Year comprehensive warranty</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">&#10003;</span>
                  <span>Professional installation and commissioning</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">&#10003;</span>
                  <span>24/7 emergency support and maintenance</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">&#10003;</span>
                  <span>Genuine Cummins spare parts availability</span>
                </li>
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/services/cummins-generators"
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
                >
                  View Cummins Generators
                </Link>
                <a
                  href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
                  className="px-6 py-3 border-2 border-amber-500 text-amber-400 font-semibold rounded-lg hover:bg-amber-500/10 transition-all"
                >
                  Call for Quote
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">⚡</div>
                  <div className="text-6xl font-bold text-amber-400">3</div>
                  <div className="text-xl font-semibold text-white">Year Warranty</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-amber-500 text-black rounded-lg font-semibold">
                Authorized Dealer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose EmersonEIMS?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Trusted by businesses across East Africa for reliable power solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15+</div>
              <div className="text-white font-medium mb-1">Years Experience</div>
              <div className="text-slate-400 text-sm">Serving Kenya since 2008</div>
            </div>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-white font-medium mb-1">Happy Clients</div>
              <div className="text-slate-400 text-sm">Across East Africa</div>
            </div>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-white font-medium mb-1">Emergency Support</div>
              <div className="text-slate-400 text-sm">Always available</div>
            </div>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">98%</div>
              <div className="text-white font-medium mb-1">Client Satisfaction</div>
              <div className="text-slate-400 text-sm">Based on feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Contact us today for a free consultation and quote. Our experts are ready to help.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">&#128222;</span>
              <div className="text-left">
                <div className="text-sm opacity-80">Call Now</div>
                <div className="font-bold">{BUSINESS_CONTACT.phoneDisplay}</div>
              </div>
            </a>
            <a
              href={BUSINESS_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">&#128172;</span>
              <div className="text-left">
                <div className="text-sm opacity-80">WhatsApp</div>
                <div className="font-bold">Chat with Us</div>
              </div>
            </a>
            <a
              href={`mailto:${BUSINESS_CONTACT.email}`}
              className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">&#9993;</span>
              <div className="text-left">
                <div className="text-sm opacity-80">Email</div>
                <div className="font-bold">{BUSINESS_CONTACT.email}</div>
              </div>
            </a>
          </div>

          <p className="text-slate-400">
            {BUSINESS_CONTACT.address} | {BUSINESS_CONTACT.hours.emergency}
          </p>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6">All Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ALL_SERVICES.map(service => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm hover:border-cyan-500 hover:text-white transition-all"
              >
                {service.icon} {service.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
