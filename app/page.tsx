// app/page.tsx - ULTRA FAST HOMEPAGE
// Target: <500ms FCP, <100ms TTFB, 100/100 Lighthouse
// Strategy: Static Server Component + lazy Client islands
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// Client wrapper for interactive sections
import HomePageClient from '@/components/home/HomePageClient';
import HubFeatureBlock from '@/components/home/HubFeatureBlock';
import SolutionsBySector from '@/components/home/SolutionsBySector';
import VoltkaCinematicShowcase from '@/components/home/VoltkaCinematicShowcase';
import { VoltkaBillboard, VoltkaDuoGrid } from '@/components/home/VoltkaShowroomGrid';
import CinematicVideoSection from '@/components/home/CinematicVideoSection';

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SEO METADATA - Rendered at build time
// ═══════════════════════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  metadataBase: new URL('https://www.emersoneims.com'),
  title: "EmersonEIMS | B2B Generators, Solar & Engineering Partner — Kenya | 3-Year Warranty",
  description: "EmersonEIMS — B2B power & engineering for industry, healthcare, telecom and commercial property in Kenya. Generators, solar, UPS, motors, HVAC, boreholes and incinerators. 3-year warranty, SLA-backed maintenance, 24/7 emergency response across 47 counties. Authorised Cummins / Perkins / FG Wilson dealer. Call +254768860665.",
  openGraph: {
    title: "EmersonEIMS | B2B Power & Engineering Partner — Kenya",
    description: "Engineering-grade generators, solar, UPS, motors, HVAC, boreholes & incinerators. 3-year warranty, SLA maintenance, 24/7 emergency. Authorised Cummins dealer. AI-assisted diagnostic and design tools.",
    images: ['/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'],
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.emersoneims.com',
    siteName: 'EmersonEIMS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmersonEIMS | B2B Power & Engineering — Kenya',
    description: 'Generators, solar, UPS, HVAC, boreholes, incinerators. 3-year warranty, SLA maintenance, 24/7 emergency. Authorised Cummins dealer. Call +254768860665',
    images: ['/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'],
  },
  alternates: {
    canonical: 'https://www.emersoneims.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SECTIONS - Rendered instantly at build time (no JS needed)
// ═══════════════════════════════════════════════════════════════════════════════

function StaticHeroFallback() {
  return (
    <section className="hero-full relative min-h-screen bg-black overflow-hidden content-auto">
      {/* Cinematic background — video plays inline + autoplay-muted (HTML5 native,
          no JS needed). Image stays as poster + fallback for slow connections,
          reduced-data, and SEO. Renders at SSR so the client sees the video
          immediately without waiting for hydration. */}
      <div className="absolute inset-0">
        {/* Reserve space for hero image to prevent CLS. Use explicit width/height for LCP. */}
        <Image
          src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          alt="EmersonEIMS Power Solutions — B2B Generator, Solar & Engineering Partner, Kenya"
          width={1920}
          height={1080}
          priority
          fetchPriority="high"
          quality={90}
          className="object-cover w-full h-full [filter:brightness(1.14)_contrast(1.07)_saturate(1.15)]"
          style={{ aspectRatio: '16/9', width: '100%', height: '100%' }}
          sizes="100vw"
        />
        {/* Hero video — TABLET+ ONLY (md↑, ≥768px). Most phones in
            landscape are 700-900px wide, so we now gate at `md:` instead of
            `sm:` to keep the 18 MB video off every phone, including
            landscape. Image stays as poster + fallback for phones, slow
            connections and SEO. */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block [filter:brightness(1.14)_contrast(1.07)_saturate(1.15)]"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          aria-hidden="true"
        >
          <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
        </video>
        {/* Lighter grade than before (70/40 → 55/25): keeps text legible while
            letting the 4K-graded footage read bright and cinematic. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.22),transparent_60%)]" />
      </div>

      {/* Static hero content - Apple-style typography & spacing */}
      <div className="relative z-20 h-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-section">
        <div className="max-w-content fade-in-up">
          {/* Badge - Apple-style pill */}
          <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-amber-300 tracking-wider uppercase font-medium">AI-Powered Energy & Engineering · East Africa</span>
          </div>

          {/* Hero Title - Apple-style display typography */}
          <h1 className="apple-display mb-6 sm:mb-8">
            <span className="block text-white">POWER &amp; BUILD</span>
            <span className="block text-amber-500">REDEFINED BY AI</span>
          </h1>

          {/* Subtitle - Apple-style subheadline */}
          <p className="apple-subheadline text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Generators · Solar · UPS · Boreholes · Buildings — one AI-native platform.
            <span className="text-amber-400 font-medium"> Engineering-grade</span> reliability for East Africa, now with Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro &amp; the Solar &amp; UPS Intelligence Hub.
          </p>

          {/* CTAs - Apple-style buttons with mobile optimization */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/contact?type=emergency"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 tap-scale touch-target"
            >
              Emergency Power in 48 Hours
            </Link>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20help%20with%20generator%2Fsolar%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 tap-scale touch-target flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Now
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 tap-scale touch-target"
            >
              Talk to Expert
            </Link>
          </div>

          {/* Trust Indicators — only verifiable, on-policy claims kept.
              Removed "500+ Projects" and "98.7% Uptime" — both lacked
              provenance and violate the project data policy. */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-sm">
            <span className="flex items-center justify-center gap-1">✓ 47 Counties Covered</span>
            <span className="flex items-center justify-center gap-1">✓ 24/7 Emergency Response</span>
            <span className="flex items-center justify-center gap-1">✓ 3-Year Warranty</span>
            <span className="flex items-center justify-center gap-1">✓ SLA Maintenance</span>
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
  // Data-policy compliance (audit 2026-05-09): replaced fabricated
  // headline counters ("500+ projects", "98.7% uptime", "12+ years")
  // with claims that are either contractual (warranty / SLA window) or
  // verifiable public facts (Kenya county count, kVA range we install).
  // No unlabelled estimates per /memories/data-policy.md.
  const stats = [
    { num: '47', label: 'Counties Covered', icon: '🌍' },
    { num: '24/7', label: 'Emergency Response', icon: '🚨' },
    { num: '3-Year', label: 'Warranty', icon: '🛡️' },
    { num: '20–2000', label: 'kVA Range Installed', icon: '⚡' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black content-auto">
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <p className="apple-caption text-center text-amber-500 mb-8 sm:mb-12">Service Standards</p>
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
          Powering East Africa's critical infrastructure across
          manufacturing, healthcare, telecom and commercial property.
          From <span className="text-amber-400">20kVA</span> commercial systems to <span className="text-amber-400">2000kVA</span> industrial installations,
          backed by a <span className="text-white font-semibold">3-year warranty</span> and SLA-bound maintenance.
        </p>
      </div>
    </section>
  );
}

function AITechnologyShowcase() {
  const products = [
    {
      id: 'generator-oracle',
      title: 'Generator Oracle',
      subtitle: 'AI Diagnostic System',
      description: 'AI-assisted diagnostic assistant that analyses generator symptoms, looks them up against an extensive fault-code database, and connects you with certified technicians.',
      description: 'AI-powered diagnostic assistant that analyses generator symptoms, looks them up against an extensive fault-code database and connects you with certified technicians.',
      features: ['Symptom-based Diagnosis', 'Voice-Activated', 'Fault Code Database', 'Real-time Analysis'],
      icon: '🔧',
      gradient: 'from-amber-500 to-orange-600',
      link: '/generator-oracle',
      badge: 'AI-POWERED'
    },
    {
      id: 'borehole-analyzer',
      title: 'AquaScan Pro',
      subtitle: 'AI Borehole Analyzer - 195+ Countries',
      description: 'World\'s most comprehensive AI that analyzes borehole sites remotely using NASA GLDAS, satellite imagery, LiDAR, and hyperspectral data. Global coverage - no site visits needed.',
      features: ['195+ Countries', 'NASA GLDAS Data', 'Satellite Rock Mapping', 'Virtual VES/ERT'],
      icon: '💧',
      gradient: 'from-cyan-500 to-teal-500',
      link: '/services/borehole-pumps',
      badge: "AI BOREHOLE TOOL"
    },
    {
      id: 'solar-school',
      title: 'Solar Solution School',
      subtitle: '10 AI Engines',
      description: 'Solar design platform with 3D modelling, AI-assisted optimisation and voice control. Country presets cover 15 African markets.',
      features: ['3D AI Design', 'Voice Commands', '25-Year Predictions', '15 Countries'],
      icon: '☀️',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/solar',
      badge: 'WORLD #1'
    },
    {
      id: 'building-suite-pro',
      title: 'Building Suite Pro',
      subtitle: 'AI Construction & Engineering Suite',
      description: 'Global Construction Intelligence Platform — BIM, structural & MEP engineering, QS / BOQ, healthcare & high-rise compliance, professional reports across 28 countries.',
      features: ['BIM + 3D Studio', 'AI QS / BOQ', 'MEP Clash + High-Rise', '28 Countries'],
      icon: '🏗️',
      gradient: 'from-purple-500 to-pink-500',
      link: '/solutions/building',
      badge: 'AI'
    },
    {
      id: 'solar-ups-hub',
      title: 'Solar & UPS Intelligence Hub',
      subtitle: 'Sizing · Audit · Diagnostics · UPS Cockpit',
      description: 'One workspace for solar & UPS engineers — smart sizing, quote audit, product intelligence, UPS live lab and the case library. Every value carries its unit. A–G suitability grading.',
      features: ['Smart Sizing', 'UPS Live Lab', 'Quote Audit AI', 'Diagnostics'],
      icon: '🛠️',
      gradient: 'from-emerald-500 to-cyan-500',
      link: '/hub',
      badge: 'HUB'
    }
  ];

  const achievements = [
    { number: '11', label: 'AI Engines', icon: '🤖' },
    { number: '47', label: 'Counties Covered', icon: '🌍' },
    { number: '24/7', label: 'Emergency Response', icon: '🚨' },
    { number: '3-Year', label: 'Warranty', icon: '🛡️' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Technology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Advanced Solutions
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Powered by AI
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Industry-leading AI technology built for Africa. From generator diagnostics to solar design, we&apos;re redefining what&apos;s possible.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16">
          {achievements.map((stat, i) => (
            <div key={i} className="text-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-500">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {products.map((product) => (            <Link
              key={product.id}
              href={product.link}
              className="group relative bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${product.gradient} text-white`}>
                  {product.badge}
                </span>
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Icon */}
                <div className="text-5xl sm:text-6xl mb-4">{product.icon}</div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{product.title}</h3>
                <p className={`text-sm font-medium bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent mb-3`}>
                  {product.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">{product.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent group-hover:gap-4 transition-all`}>
                  Explore {product.title}
                  <span className="text-amber-500">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Experience the future of power solutions with EmersonEIMS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Try Generator Oracle Free
            </Link>
            <Link
              href="/services/borehole-pumps"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              AI Borehole Site Analysis
            </Link>
            <Link
              href="/solar"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Explore Solar AI
            </Link>
            <Link
              href="/solutions/building"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Open Building Suite Pro
            </Link>
            <Link
              href="/hub"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Open Solar &amp; UPS Hub
            </Link>
          </div>
        </div>
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
      {/* Structured Data for SEO - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EmersonEIMS',
            description: "B2B power-engineering partner for industry, healthcare, telecom and commercial property in Kenya. Generators, solar, UPS, motors, HVAC, boreholes and incinerators with a 3-year warranty, SLA-backed maintenance and 24/7 emergency response across 47 counties. Includes engineering intelligence tools (Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro).",
            url: 'https://www.emersoneims.com',
            logo: 'https://www.emersoneims.com/logo.png',
            image: 'https://www.emersoneims.com/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
            // foundingDate, numberOfEmployees, slogan and alternateName removed
            // 2026-05-09: data-policy.md — do not assert facts that cannot be
            // independently verified by an external auditor.
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'customer service',
                availableLanguage: ['English', 'Swahili'],
                areaServed: ['KE', 'TZ', 'UG', 'RW', 'ET'],
              },
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'sales',
                availableLanguage: ['English', 'Swahili'],
              },
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'technical support',
                availableLanguage: ['English', 'Swahili'],
              }
            ],
            areaServed: [
              { '@type': 'Country', name: 'Kenya' },
              { '@type': 'Country', name: 'Tanzania' },
              { '@type': 'Country', name: 'Uganda' },
              { '@type': 'Country', name: 'Rwanda' },
              { '@type': 'Country', name: 'Ethiopia' },
              { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: -1.286389, longitude: 36.817223 }, geoRadius: '2000 km' }
            ],
            sameAs: [
              'https://www.facebook.com/emersoneims',
              'https://www.linkedin.com/company/emersoneims',
              'https://twitter.com/emersoneims'
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'EmersonEIMS Products & Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'Generator Oracle AI',
                    description: 'AI-powered generator diagnostic system with voice activation and an extensive fault-code database',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'Solar Solution School',
                    description: 'World-class solar design platform with 10 AI engines, 3D modeling, voice commands, and coverage across 15 African countries',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'AI Borehole Site Analyzer',
                    description: "Africa's first AI-powered borehole site analysis tool using satellite imagery, LiDAR, hyperspectral data, and virtual geophysical surveys. Rock mapping without site visits.",
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Generator Sales & Installation',
                    description: 'CUMMINS generators 10-2000KVA with 3-year warranty',
                    provider: { '@type': 'Organization', name: 'EmersonEIMS' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Solar Installation',
                    description: 'Complete solar PV system design and installation across East Africa',
                    provider: { '@type': 'Organization', name: 'EmersonEIMS' }
                  }
                }
              ]
            },
            knowsAbout: [
              'Artificial Intelligence',
              'Machine Learning',
              'Generator Diagnostics',
              'Solar Panel Design',
              'Power Solutions',
              'Borehole Site Analysis',
              'Remote Sensing',
              'Satellite Imagery Analysis',
              'LiDAR Terrain Mapping',
              'Geophysical Surveys',
              'Enterprise Software',
              'CRM Integration',
              'Voice Recognition'
            ],
            // 'award' array removed (audit 2026-05-09): all entries were
            // self-asserted superlatives ("Most Advanced", "World's Most
            // Comprehensive") with no third-party citation. Schema.org
            // `award` requires a verifiable issuing body — omitting until
            // a real award (e.g. KEPSA, ASNT, AHK) is documented.
          }),
        }}
      />

      {/* Structured Data - Software Applications */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Generator Oracle AI',
              applicationCategory: 'BusinessApplication',
              description: 'AI-powered generator diagnostic tool that analyses symptoms and suggests solutions, backed by an extensive fault-code database. Features voice activation and real-time analysis.',
              operatingSystem: 'Any (Web-based)',
              url: 'https://www.emersoneims.com/generator-oracle',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KES'
              },
              // aggregateRating removed (audit 2026-05-09): Google's
              // structured-data policy requires on-page user-generated
              // reviews for self-asserted ratings — we don't have them
              // yet, so emitting one is a policy violation.
              featureList: 'Voice Activation, Fault Code Database, Real-time Analysis, AI-Powered Recommendations'
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Solar Solution School',
              applicationCategory: 'BusinessApplication',
              description: 'Solar design platform featuring 10 AI engines, 3D modelling, voice commands and 25-year production projections. Country presets cover 15 African markets.',
              operatingSystem: 'Any (Web-based)',
              url: 'https://www.emersoneims.com/solar',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KES'
              },
              // aggregateRating removed (audit 2026-05-09) — see note
              // above. Self-asserted ratings without UGC violate policy.
              featureList: '10 AI Engines, 3D Design Studio, Voice Commands, 25-Year Predictions, Enterprise Integrations'
            }
          ]),
        }}
      />

      {/* FAQPage schema removed from the homepage 2026-05-09.
          Google Rich Results Test was flagging 2 of 5 entries as invalid
          because Google requires the answer text to be visibly rendered
          on the same page that declares the schema. The dedicated /faq
          route owns its own (valid) FAQPage schema; declaring a second
          one here for content that is not visible was both a duplicate
          and a policy violation. Reference:
          https://developers.google.com/search/docs/appearance/structured-data/faqpage */}

      {/* Speakable schema — flags H1 + lead paragraph as voice-friendly so
          Google Assistant / Alexa can read them aloud in audio answers.
          Targets the standard semantic landmarks present on this page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'EmersonEIMS — B2B Power & Engineering Partner Kenya',
            url: 'https://www.emersoneims.com',
            inLanguage: 'en-KE',
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['h1', '[data-speakable]'],
            },
          }),
        }}
      />

      {/* STATIC CONTENT - Renders instantly (no JS needed) */}
      <StaticHeroFallback />
      {/* VOLTKA Cummins cinematic showcase — flagship product directly
          under the hero so generator buyers see it before anything else. */}
      <VoltkaCinematicShowcase />
      <SolutionsBySector />
      <StaticFeaturesSection />
      {/* Nike-style editorial image cards — ATS commissioning + genuine
          Cummins engine, keeping the product in view mid-scroll. */}
      <VoltkaDuoGrid />
      <HubFeatureBlock />
      <StaticStatsSection />
      <AITechnologyShowcase />
      {/* Full-width night-delivery billboard — emergency-response story
          told Nike-billboard style before the services film. */}
      <VoltkaBillboard />
      {/* Services film on a dedicated stage — visible on phones too
          (the hero video is tablet-and-up only). Click-to-play. */}
      <CinematicVideoSection />
      <StaticCountiesSection />

      {/* CLIENT INTERACTIVE SECTIONS - Load after static content */}
      <HomePageClient />
    </main>
  );
}
