'use client';

/**
 * DeferredComponents - Non-critical UI loaded AFTER page is interactive
 *
 * PERFORMANCE OPTIMIZED:
 * - Staggered loading to prevent main thread blocking
 * - Connection-aware loading (skip heavy components on slow connections)
 * - requestIdleCallback for non-blocking execution
 * - Reduced motion support
 */

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 1: Essential (load at 500ms) - Critical for conversions
// ═══════════════════════════════════════════════════════════════════════════════
const WhatsAppButton = dynamic(() => import('@/components/conversion/WhatsAppButton'), { ssr: false });
const StickyCallBar = dynamic(() => import('@/components/conversion/StickyCallBar'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 2: Important (load at 2s) - Enhance UX
// ═══════════════════════════════════════════════════════════════════════════════
const WebsiteStatsCounter = dynamic(() => import('@/components/social/WebsiteStatsCounter'), { ssr: false });
const FloatingActionBubbles = dynamic(() => import('@/components/conversion/FloatingActionBubbles'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 3: Nice-to-have (load at 4s) - AI and personalization
// ═══════════════════════════════════════════════════════════════════════════════
const SallyAIAssistant = dynamic(() => import('@/components/ai/SallyAIAssistant'), { ssr: false });
const UrgencyBar = dynamic(() => import('@/components/conversion/UrgencyBar'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/conversion/ExitIntentPopup'), { ssr: false });
const IntelligentPersonalization = dynamic(() => import('@/components/ai/IntelligentPersonalization'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 4: Background (load at 6s) - SEO and analytics
// ═══════════════════════════════════════════════════════════════════════════════
const AdvancedSEO = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.default })), { ssr: false });
const SEOEventTracker = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.SEOEventTracker })), { ssr: false });
const ComprehensiveKenyaSEO = dynamic(() => import('@/components/seo/ComprehensiveKenyaSEO'), { ssr: false });
const UltraSpeedOptimizer = dynamic(() => import('@/components/performance/UltraSpeedOptimizer'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 5: Optional (load at 8s) - Visual effects (skip on slow connections)
// ═══════════════════════════════════════════════════════════════════════════════
const LiquidCursor = dynamic(() => import('@/components/awwwards/LiquidCursor'), { ssr: false });

export default function DeferredComponents() {
  const [tier1, setTier1] = useState(false);
  const [tier2, setTier2] = useState(false);
  const [tier3, setTier3] = useState(false);
  const [tier4, setTier4] = useState(false);
  const [tier5, setTier5] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect connection quality and motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check connection quality
    const connection = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    const slow = connection?.effectiveType === '2g' ||
                 connection?.effectiveType === 'slow-2g' ||
                 connection?.saveData === true;
    setIsSlowConnection(slow);

    // Check motion preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Non-blocking idle callback wrapper
  const scheduleIdle = useCallback((fn: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, options?: { timeout: number }) => void })
          .requestIdleCallback(fn, { timeout: 1000 });
      } else {
        fn();
      }
    }, delay);
    return timeoutId;
  }, []);

  // Staggered loading with idle callbacks
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Tier 1: Essential (500ms) - Always load
    timers.push(scheduleIdle(() => setTier1(true), 500));

    // Tier 2: Important (2s)
    timers.push(scheduleIdle(() => setTier2(true), 2000));

    // Tier 3: Nice-to-have (4s) - Skip on very slow connections
    if (!isSlowConnection) {
      timers.push(scheduleIdle(() => setTier3(true), 4000));
    }

    // Tier 4: Background (6s) - Always load (SEO important)
    timers.push(scheduleIdle(() => setTier4(true), 6000));

    // Tier 5: Visual effects (8s) - Skip on slow connections or reduced motion
    if (!isSlowConnection && !prefersReducedMotion) {
      timers.push(scheduleIdle(() => setTier5(true), 8000));
    }

    return () => timers.forEach(clearTimeout);
  }, [isSlowConnection, prefersReducedMotion, scheduleIdle]);

  return (
    <>
      {/* TIER 1: Essential conversion tools */}
      {tier1 && (
        <>
          <WhatsAppButton />
          <StickyCallBar />
        </>
      )}

      {/* TIER 2: Important UX enhancements */}
      {tier2 && (
        <>
          <WebsiteStatsCounter />
          <FloatingActionBubbles />
        </>
      )}

      {/* TIER 3: AI and personalization */}
      {tier3 && (
        <>
          <SallyAIAssistant />
          <UrgencyBar />
          <ExitIntentPopup />
          <IntelligentPersonalization />
        </>
      )}

      {/* TIER 4: SEO and analytics */}
      {tier4 && (
        <>
          <AdvancedSEO />
          <SEOEventTracker />
          <ComprehensiveKenyaSEO />
          <UltraSpeedOptimizer />
        </>
      )}

      {/* TIER 5: Visual effects (conditional) */}
      {tier5 && <LiquidCursor />}
    </>
  );
}
