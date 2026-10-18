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
// TIER 1: Essential (load at 500ms) - REMOVED duplicate WhatsApp button.
// ClientWhatsApp (chat/) is already mounted by ClientSideComponents → keeping
// only one floating WhatsApp button site-wide.
// ═══════════════════════════════════════════════════════════════════════════════
// REMOVED: WhatsAppButton (was conflicting with chat/ClientWhatsApp)
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
/*
 * AdvancedSEO's default export REMOVED 2026-10-18 (SEOEventTracker, which
 * only reports engagement events, stays). After hydration it injected JSON-LD
 * that only crawlers see: 47 LocalBusiness entries, one per county, each with
 * an addressLocality and an @id on a /counties/* URL that now 308s — telling
 * Google there are premises in every county; plus FAQPage answers not visible
 * on the page with unconfirmed claims ("15 years' experience, 500+ completed
 * projects", "certified technicians on standby", selling Cummins/Perkins/FG
 * Wilson — only VOLTKA is sold new) and "numberOfEmployees: 50+". Misleading
 * structured data breaches Google's structured-data guidelines. The
 * server-rendered schema (app/layout.tsx, StructuredData) is unaffected.
 */
const SEOEventTracker = dynamic(() => import('@/components/seo/AdvancedSEO').then(mod => ({ default: mod.SEOEventTracker })), { ssr: false });
/*
 * REMOVED 2026-10-16/18: ComprehensiveKenyaSEO. Rendered in a real browser
 * (and by Google, which runs JS) it added a 1,488-word block to every page
 * inside <div className="sr-only" aria-hidden="true"> — invisible to visitors,
 * readable by crawlers: hidden text + keyword stuffing under Google's spam
 * policies. It listed every county/town and "9,458+ hospitals | 16,245+
 * hotels" (national totals that read as clients) and warranty terms that
 * contradict the owner-confirmed 2 years. It also injected seven JSON-LD
 * blocks on every page, including a site-wide FAQPage and BreadcrumbList that
 * match no page's visible content. The server-rendered schema in
 * app/layout.tsx and each page already carries the legitimate entities.
 * Do not re-mount it.
 */
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
      {/* TIER 1: REMOVED — ClientWhatsApp from ClientSideComponents covers this */}

      {/* TIER 2: REMOVED stats counter — was overlapping page content */}

      {/* TIER 3: DISABLED - All annoying popups removed */}
      {/* No exit intent, no urgency bars, no floating AI assistants */}

      {/* TIER 4: SEO only (invisible to users) */}
      {tier4 && (
        <>
          <SEOEventTracker />
        </>
      )}

      {/* TIER 5: DISABLED - No fancy cursors */}
    </>
  );
}
