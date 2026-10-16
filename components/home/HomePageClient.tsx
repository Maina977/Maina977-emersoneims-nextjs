'use client';

/**
 * HomePageClient - Client-side interactive sections
 * All heavy components loaded lazily after initial paint
 *
 * HOMEPAGE MERGE, 2026-10-16 (owner decision). This file used to mount ten
 * more sections — CumminsBanner, GeneratorOracleShowcase, a Solar / UPS Hub
 * teaser, PremiumServicesShowcase, TrustBadgesSection, CaseStudiesSection,
 * TestimonialsSection, IndustryLeadingTrust, LiveOperationsDashboard and
 * CompetitiveAdvantage. Each repeated something app/page.tsx already shows:
 * the Cummins range (CumminsShopNowReal), the AI tools (AIToolsPromo), the
 * hub (HubFeatureBlock), the service list (ServicesLeadershipMatrix,
 * CompleteCapability) and the client names — all eight confirmed clients
 * are in ClientTestimonials, server-rendered. Together they made up about
 * 30,000px of a 79,000px phone page. The components still exist; see the
 * note in app/page.tsx for how links and clients were checked.
 */

import dynamic from 'next/dynamic';
import LazyOnVisible from '@/components/perf/LazyOnVisible';

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

const CTASection = dynamic(
  () => import('@/components/cta/UnifiedCTA').then(mod => ({ default: mod.CTASection })),
  { loading: () => <CTASkeleton /> }
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
 * block introduces zero new marketing copy. Kept through the 2026-10-16
 * merge: tests/regression/site-invariants.test.ts #9 protects it.
 */
function SolarUpsHubTeaser() {
  return (
    <section
      aria-labelledby="solar-ups-hub-teaser"
      className="py-12 bg-black border-y border-amber-500/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <a
          href="/hub"
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
      {/* Solar / UPS Hub — restores the previously-missing homepage teaser */}
      <SolarUpsHubTeaser />

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
