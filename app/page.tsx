// app/page.tsx - ULTRA FAST HOMEPAGE
// Target: <500ms FCP, <100ms TTFB, 100/100 Lighthouse
// Strategy: Static Server Component + lazy Client islands
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// Client wrapper for interactive sections
import HomePageClient from '@/components/home/HomePageClient';

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SEO METADATA - Rendered at build time
// ═══════════════════════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: "Cummins Generators Kenya | Authorized Voltka Dealer | 3-YEAR WARRANTY | EmersonEIMS",
  description: "Kenya's Authorized CUMMINS Generator Dealer by VOLTKA. 10-2000KVA diesel generators with 3-YEAR WARRANTY + 1 YEAR FREE SERVICE. Genuine parts, 24/7 support. Call +254793573208",
  keywords: "Cummins generators Kenya, Voltka generators, authorized Cummins dealer Kenya, Cummins generator price Kenya, diesel generators Kenya, 3 year warranty generators, industrial generators Nairobi",
  openGraph: {
    title: "CUMMINS Generators Kenya | Authorized Voltka Dealer | EmersonEIMS",
    description: "Authorized CUMMINS dealer in Kenya. 10-2000KVA generators with 3-year warranty + 1 year free service. Genuine Voltka/Cummins generators.",
    images: ['/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SECTIONS - Rendered instantly at build time (no JS needed)
// ═══════════════════════════════════════════════════════════════════════════════

function StaticHeroFallback() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden content-auto">
      {/* Static hero image - loads INSTANTLY with optimized loading */}
      <div className="absolute inset-0">
        <Image
          src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          alt="EmersonEIMS Power Solutions - Kenya's #1 Generator Company"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
      </div>

      {/* Static hero content - Apple-style typography & spacing */}
      <div className="relative z-20 h-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-section">
        <div className="max-w-content fade-in-up">
          {/* Badge - Apple-style pill */}
          <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-amber-300 tracking-wider uppercase font-medium">East Africa's #1 Power Solutions</span>
          </div>

          {/* Hero Title - Apple-style display typography */}
          <h1 className="apple-display mb-6 sm:mb-8">
            <span className="block text-white">POWER</span>
            <span className="block text-amber-500">REDEFINED</span>
          </h1>

          {/* Subtitle - Apple-style subheadline */}
          <p className="apple-subheadline text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Premium Energy Solutions. Engineering-Grade Reliability.
            <span className="text-amber-400 font-medium"> 12+ Years</span> Powering East Africa.
          </p>

          {/* CTAs - Apple-style buttons with mobile optimization */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/contact?type=emergency"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 tap-scale touch-target"
            >
              Emergency Power in 48 Hours
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 tap-scale touch-target"
            >
              Talk to Expert
            </Link>
          </div>

          {/* Trust Indicators - Mobile optimized grid */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-sm">
            <span className="flex items-center justify-center gap-1">✓ 500+ Projects</span>
            <span className="flex items-center justify-center gap-1">✓ 98.7% Uptime</span>
            <span className="flex items-center justify-center gap-1">✓ 47 Counties</span>
            <span className="flex items-center justify-center gap-1">✓ 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function StaticStatsSection() {
  const stats = [
    { num: '500+', label: 'Projects Delivered', icon: '🔧' },
    { num: '98.7%', label: 'System Uptime', icon: '📊' },
    { num: '47', label: 'Counties Served', icon: '🌍' },
    { num: '12+', label: 'Years Experience', icon: '🏆' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black content-auto">
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <p className="apple-caption text-center text-amber-500 mb-8 sm:mb-12">By The Numbers</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block" aria-hidden="true">{stat.icon}</span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-500 mb-1 sm:mb-2 tracking-tight">{stat.num}</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticFeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black content-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <p className="apple-caption text-amber-500 mb-4 sm:mb-6">Our Promise</p>
        <h2 className="apple-headline text-white mb-6 sm:mb-8">
          Engineering Excellence
          <br />
          <span className="text-amber-500">Meets Reliability</span>
        </h2>
        <p className="apple-body text-gray-300 max-w-3xl">
          Over <span className="text-white font-semibold">12 years</span> powering East Africa's critical infrastructure.
          From <span className="text-amber-400">20kVA</span> residential systems to <span className="text-amber-400">2000kVA</span> industrial installations.
          <span className="text-white font-semibold"> 98.7%</span> uptime guaranteed.
        </p>
      </div>
    </section>
  );
}

function StaticCountiesSection() {
  const counties = [
    { name: 'Nairobi', slug: 'nairobi', highlight: true },
    { name: 'Mombasa', slug: 'mombasa', highlight: true },
    { name: 'Kisumu', slug: 'kisumu', highlight: true },
    { name: 'Nakuru', slug: 'nakuru', highlight: true },
    { name: 'Kiambu', slug: 'kiambu' },
    { name: 'Machakos', slug: 'machakos' },
    { name: 'Kilifi', slug: 'kilifi' },
    { name: 'Uasin Gishu', slug: 'uasin-gishu' },
    { name: 'Kajiado', slug: 'kajiado' },
    { name: 'Nyeri', slug: 'nyeri' },
    { name: 'Meru', slug: 'meru' },
    { name: 'Kakamega', slug: 'kakamega' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-black to-gray-900/50 content-auto">
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="apple-caption text-cyan-400 mb-3 sm:mb-4 block">Nationwide Coverage</span>
          <h2 className="apple-headline text-white">
            Generator Services Across <span className="text-amber-500">All 47 Counties</span>
          </h2>
        </div>

        {/* Mobile-optimized county grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {counties.map((county) => (
            <Link
              key={county.slug}
              href={`/kenya/${county.slug}`}
              className={`block p-3 sm:p-4 rounded-xl border text-center transition-all duration-300 tap-scale touch-target ${
                county.highlight
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/15'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10'
              }`}
            >
              <span className={`text-sm sm:text-base font-medium ${county.highlight ? 'text-amber-400' : 'text-white'}`}>
                {county.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/kenya"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 tap-scale touch-target"
          >
            View All 47 Counties
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT - Server Component (instant render)
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  return (
    <main className="bg-black">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Emerson EiMS',
            description: "Kenya's #1 Generator & Solar Company with 3-Year Warranty",
            url: 'https://www.emersoneims.com',
            logo: 'https://www.emersoneims.com/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+254768860665',
              contactType: 'customer service',
              availableLanguage: ['English', 'Swahili'],
            },
            areaServed: 'Kenya',
          }),
        }}
      />

      {/* STATIC CONTENT - Renders instantly (no JS needed) */}
      <StaticHeroFallback />
      <StaticFeaturesSection />
      <StaticStatsSection />
      <StaticCountiesSection />

      {/* CLIENT INTERACTIVE SECTIONS - Load after static content */}
      <HomePageClient />
    </main>
  );
}
