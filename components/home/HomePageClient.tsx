'use client';

/**
 * HomePageClient - Client-side interactive sections
 * All heavy components loaded lazily after initial paint
 */

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import LazyOnVisible from '@/components/perf/LazyOnVisible';

// Lightweight loading skeleton
function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="h-4 w-24 bg-amber-500/20 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASkeleton() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="h-12 w-96 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
        <div className="h-6 w-64 bg-white/5 rounded mx-auto mb-8 animate-pulse" />
        <div className="flex gap-4 justify-center">
          <div className="h-14 w-48 bg-amber-500/30 rounded-full animate-pulse" />
          <div className="h-14 w-48 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// Lazy load all heavy sections
// NOTE: HeroSection import removed — the cinematic hero with inline autoplay
// video now lives in app/page.tsx > StaticHeroFallback so it renders at SSR.

const TestimonialsSection = dynamic(
  () => import('@/components/sections/TestimonialsSection'),
  { loading: () => <SectionSkeleton title="Testimonials" /> }
);

const CaseStudiesSection = dynamic(
  () => import('@/components/sections/CaseStudiesSection'),
  { loading: () => <SectionSkeleton title="Case Studies" /> }
);

const GeneratorOracleShowcase = dynamic(
  () => import('@/components/sections/GeneratorOracleShowcase'),
  { loading: () => <SectionSkeleton title="Generator Oracle" /> }
);

const PremiumServicesShowcase = dynamic(
  () => import('@/components/sections/PremiumServicesShowcase'),
  { loading: () => <SectionSkeleton title="Our Services" /> }
);

const TrustBadgesSection = dynamic(
  () => import('@/components/sections/TrustBadgesSection'),
  { loading: () => <SectionSkeleton title="Trust & Certifications" /> }
);

const IndustryLeadingTrust = dynamic(
  () => import('@/components/sections/IndustryLeadingTrust'),
  { loading: () => <SectionSkeleton title="Partnerships" /> }
);

const LiveOperationsDashboard = dynamic(
  () => import('@/components/sections/LiveOperationsDashboard'),
  { loading: () => <SectionSkeleton title="Live Operations" /> }
);

const CompetitiveAdvantage = dynamic(
  () => import('@/components/sections/CompetitiveAdvantage'),
  { loading: () => <SectionSkeleton title="Why Choose Us" /> }
);

const CTASection = dynamic(
  () => import('@/components/cta/UnifiedCTA').then(mod => ({ default: mod.CTASection })),
  { loading: () => <CTASkeleton /> }
);

const CumminsBanner = dynamic(
  () => import('@/components/brands/CumminsBanner'),
  { loading: () => <div className="h-96 bg-black animate-pulse border-y border-cyan-500/20" /> }
);

// Emergency CTA Floating Button - High-conversion element
const EmergencyCTA = dynamic(
  () => import('@/components/cta/EmergencyCTA'),
  { ssr: false }
);

/**
 * Solar / UPS Hub teaser — minimal, neutral link block.
 *
 * Restored under user authorization "Option B: minimal teaser using only
 * existing page title / destination / neutral link language". Title and
 * description are taken VERBATIM from the registered entry in
 * app/resources/page.tsx (Maintenance Guides → Solar / UPS Hub) so this
 * block introduces zero new marketing copy.
 */
function SolarUpsHubTeaser() {
  return (
    <section
      aria-labelledby="solar-ups-hub-teaser"
      className="py-12 bg-black border-y border-amber-500/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <a
          href="/resources/solar-ups-hub"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-500/50 transition-colors"
        >
          <div>
            <h2
              id="solar-ups-hub-teaser"
              className="text-xl font-semibold text-amber-300"
            >
              Solar / UPS Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Solar + UPS resource hub
            </p>
          </div>
          <span className="text-amber-400 text-sm font-medium">
            Open hub →
          </span>
        </a>
      </div>
    </section>
  );
}

export default function HomePageClient() {
  return (
    <>
      {/* HeroSection is no longer rendered here — the cinematic hero with
          inline autoplay video lives in app/page.tsx > StaticHeroFallback so
          it renders at SSR (no hydration wait, no duplicate hero). */}

      {/* CUMMINS/VOLTKA - Our Main Generator Brand */}
      <CumminsBanner variant="hero" showPricing={true} showCTA={true} />

      {/* GENERATOR ORACLE - Lead Generation Tool (Moved Up for Prominence) */}
      <GeneratorOracleShowcase />

      {/* Solar / UPS Hub — restores the previously-missing homepage teaser */}
      <SolarUpsHubTeaser />

      {/*
        BELOW-THE-FOLD: each heavy section is mounted only when it scrolls
        near the viewport. This reclaims a lot of main-thread time on mobile
        because hydration of these eight sections no longer competes with
        the hero image, fonts and navigation on first paint. Skeletons
        reserve enough vertical space to keep CLS near zero.
      */}
      <LazyOnVisible minHeight="min-h-[600px]">
        <PremiumServicesShowcase />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[400px]">
        <TrustBadgesSection />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[600px]">
        <CaseStudiesSection />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[500px]">
        <TestimonialsSection />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[400px]">
        <IndustryLeadingTrust />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[600px]">
        <LiveOperationsDashboard />
      </LazyOnVisible>
      <LazyOnVisible minHeight="min-h-[500px]">
        <CompetitiveAdvantage />
      </LazyOnVisible>

      {/* Final CTA */}
      <LazyOnVisible minHeight="min-h-[400px]">
        <CTASection
          title="Ready to Power Your Future?"
          subtitle="Get a free consultation with our engineering team."
          primaryAction="consultation"
          secondaryAction="diagnostic"
          showEmergency={true}
        />
      </LazyOnVisible>

      {/* Floating Emergency CTA - Always visible for quick conversion */}
      <EmergencyCTA variant="floating" />
    </>
  );
}
