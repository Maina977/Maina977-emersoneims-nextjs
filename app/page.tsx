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
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Static hero image - loads INSTANTLY */}
      <div className="absolute inset-0">
        <Image
          src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          alt="EmersonEIMS Power Solutions"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
      </div>

      {/* Static hero content - no JS needed */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-7xl">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-amber-300 tracking-wider uppercase">East Africa's #1 Power Solutions</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9] tracking-tighter">
            <span className="block text-white">POWER</span>
            <span className="block text-amber-500">REDEFINED</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-200 font-light mb-12 max-w-4xl mx-auto">
            Premium Energy Solutions. Engineering-Grade Reliability.
            <span className="text-amber-400"> 12+ Years</span> Powering East Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact?type=emergency"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-full hover:scale-105 transition-transform"
            >
              ⚡ Emergency Power in 48 Hours
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              💬 Talk to Expert
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <span>✓ 500+ Projects</span>
            <span>✓ 98.7% Uptime</span>
            <span>✓ 47 Counties</span>
            <span>✓ 24/7 Support</span>
          </div>
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
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-amber-500 text-sm uppercase tracking-widest mb-12">By The Numbers</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-4xl mb-4 block">{stat.icon}</span>
              <div className="text-5xl lg:text-6xl font-bold text-amber-500 mb-2">{stat.num}</div>
              <div className="text-lg text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticFeaturesSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-amber-500 text-sm uppercase tracking-widest mb-6">Our Promise</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          Engineering Excellence
          <br />
          <span className="text-amber-500">Meets Reliability</span>
        </h2>
        <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
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
    <section className="py-24 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm uppercase tracking-widest mb-4 block">Nationwide Coverage</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Generator Services Across <span className="text-amber-500">All 47 Counties</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {counties.map((county) => (
            <Link
              key={county.slug}
              href={`/kenya/${county.slug}`}
              className={`block p-4 rounded-xl border text-center transition-all ${
                county.highlight
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <span className={county.highlight ? 'text-amber-400' : 'text-white'}>{county.name}</span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/kenya"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
          >
            View All 47 Counties →
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
