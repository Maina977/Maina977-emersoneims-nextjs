'use client';

/**
 * HomePageClient - Client-side interactive sections
 * All heavy components loaded lazily after initial paint
 */

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

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
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), {
  loading: () => null, // Static hero shown in server component
});

const TestimonialsSection = dynamic(
  () => import('@/components/sections/TestimonialsSection'),
  { loading: () => <SectionSkeleton title="Testimonials" /> }
);

const CaseStudiesSection = dynamic(
  () => import('@/components/sections/CaseStudiesSection'),
  { loading: () => <SectionSkeleton title="Case Studies" /> }
);

const DiagnosticModuleShowcase = dynamic(
  () => import('@/components/sections/DiagnosticModuleShowcase'),
  { loading: () => <SectionSkeleton title="Diagnostic Tools" /> }
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

export default function HomePageClient() {
  return (
    <>
      {/* Hero with animations */}
      <HeroSection />

      {/* Lazy loaded sections */}
      <TestimonialsSection />
      <CaseStudiesSection />
      <DiagnosticModuleShowcase />
      <GeneratorOracleShowcase />
      <PremiumServicesShowcase />
      <TrustBadgesSection />
      <IndustryLeadingTrust />
      <LiveOperationsDashboard />
      <CompetitiveAdvantage />

      {/* Final CTA */}
      <CTASection
        title="Ready to Power Your Future?"
        subtitle="Get a free consultation with our engineering team."
        primaryAction="consultation"
        secondaryAction="diagnostic"
        showEmergency={true}
      />
    </>
  );
}
