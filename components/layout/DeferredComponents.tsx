'use client';

/**
 * DeferredComponents - Non-critical UI loaded AFTER page is interactive
 *
 * STREAMLINED VERSION - Removed annoying popups and heavy effects
 * Only essential, non-intrusive components remain
 */

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 1: Essential (load at 500ms) - Just WhatsApp button (non-intrusive)
// ═══════════════════════════════════════════════════════════════════════════════
const WhatsAppButton = dynamic(() => import('@/components/conversion/WhatsAppButton'), { ssr: false });
// REMOVED: StickyCallBar - Too intrusive, blocks content
// REMOVED: QuickQuoteWidget - Annoying floating widget

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 2: Important (load at 2s) - Keep stats counter only
// ═══════════════════════════════════════════════════════════════════════════════
const WebsiteStatsCounter = dynamic(() => import('@/components/social/WebsiteStatsCounter'), { ssr: false });
// REMOVED: FloatingActionBubbles - Too many floating elements

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 3: Nice-to-have (load at 4s) - DISABLED most annoying elements
// ═══════════════════════════════════════════════════════════════════════════════
// REMOVED: SallyAIAssistant - AI chat can be accessed from navbar
// REMOVED: UrgencyBar - Fake urgency is annoying and hurts trust
// REMOVED: ExitIntentPopup - These popups are extremely annoying
// REMOVED: IntelligentPersonalization - Unnecessary popups

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 4: Background (load at 6s) - SEO only (no visual impact)
// ═══════════════════════════════════════════════════════════════════════════════
const AdvancedSEO = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.default })), { ssr: false });
const SEOEventTracker = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.SEOEventTracker })), { ssr: false });
const ComprehensiveKenyaSEO = dynamic(() => import('@/components/seo/ComprehensiveKenyaSEO'), { ssr: false });
// REMOVED: UltraSpeedOptimizer - Not needed

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 5: DISABLED - Custom cursors are gimmicky and hurt UX
// ═══════════════════════════════════════════════════════════════════════════════
// REMOVED: LiquidCursor - Fancy but annoying, breaks native cursor expectations

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
      {/* TIER 1: Essential - Just WhatsApp button (non-intrusive corner button) */}
      {tier1 && (
        <WhatsAppButton />
      )}

      {/* TIER 2: Stats counter (non-intrusive) */}
      {tier2 && (
        <WebsiteStatsCounter />
      )}

      {/* TIER 3: DISABLED - All annoying popups removed */}
      {/* No exit intent, no urgency bars, no floating AI assistants */}

      {/* TIER 4: SEO only (invisible to users) */}
      {tier4 && (
        <>
          <AdvancedSEO />
          <SEOEventTracker />
          <ComprehensiveKenyaSEO />
        </>
      )}

      {/* TIER 5: DISABLED - No fancy cursors */}
    </>
  );
}
