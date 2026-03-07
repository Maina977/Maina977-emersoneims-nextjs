'use client';

/**
 * DeferredComponents - Non-critical UI loaded AFTER page is interactive
 * These components enhance UX but are NOT needed for first render
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load ALL non-critical components
const SallyAIAssistant = dynamic(() => import('@/components/ai/SallyAIAssistant'), { ssr: false });
const FloatingActionBubbles = dynamic(() => import('@/components/conversion/FloatingActionBubbles'), { ssr: false });
const UrgencyBar = dynamic(() => import('@/components/conversion/UrgencyBar'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/conversion/ExitIntentPopup'), { ssr: false });
const StickyCallBar = dynamic(() => import('@/components/conversion/StickyCallBar'), { ssr: false });
const WhatsAppButton = dynamic(() => import('@/components/conversion/WhatsAppButton'), { ssr: false });
const IntelligentPersonalization = dynamic(() => import('@/components/ai/IntelligentPersonalization'), { ssr: false });
const AdvancedSEO = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.default })), { ssr: false });
const SEOEventTracker = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.SEOEventTracker })), { ssr: false });
const ComprehensiveKenyaSEO = dynamic(() => import('@/components/seo/ComprehensiveKenyaSEO'), { ssr: false });
const UltraSpeedOptimizer = dynamic(() => import('@/components/performance/UltraSpeedOptimizer'), { ssr: false });
const LiquidCursor = dynamic(() => import('@/components/awwwards/LiquidCursor'), { ssr: false });
const WebsiteStatsCounter = dynamic(() => import('@/components/social/WebsiteStatsCounter'), { ssr: false });

export default function DeferredComponents() {
  const [mounted, setMounted] = useState(false);
  const [loadExtras, setLoadExtras] = useState(false);

  useEffect(() => {
    // Wait for page to be fully interactive before loading extras
    setMounted(true);

    // Load extra components after 2 seconds (user has started reading)
    const timer = setTimeout(() => {
      setLoadExtras(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Essential conversion tools - load immediately after mount */}
      <WhatsAppButton />
      <StickyCallBar />

      {/* Non-essential - load after 2 seconds */}
      {loadExtras && (
        <>
          <WebsiteStatsCounter />
          <SallyAIAssistant />
          <FloatingActionBubbles />
          <UrgencyBar />
          <ExitIntentPopup />
          <IntelligentPersonalization />
          <AdvancedSEO />
          <SEOEventTracker />
          <ComprehensiveKenyaSEO />
          <UltraSpeedOptimizer />
          <LiquidCursor />
        </>
      )}
    </>
  );
}
