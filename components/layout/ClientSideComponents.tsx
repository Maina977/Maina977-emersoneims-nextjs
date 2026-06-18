'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZED: Dynamic imports with staggered loading
// Reduces initial JS bundle and prevents main thread blocking
// ═══════════════════════════════════════════════════════════════════════════════
const ContentProtection = dynamic(() => import('@/components/security/ContentProtection'), { ssr: false });
const DMCAProtection = dynamic(() => import('@/components/security/DMCAProtection'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/compliance/CookieConsent'), { ssr: false });
const ClientWhatsApp = dynamic(() => import('@/components/chat/ClientWhatsApp'), { ssr: false });
const PWAInstallPrompt = dynamic(() => import('@/components/pwa/PWAInstallPrompt'), { ssr: false });
// Accessibility toolbar (font size / contrast / spacing / cursor / link highlight).
// Mounted site-wide so the visually-impaired support we advertise is REAL: the
// Alt+A shortcut and the "Accessibility" skip link both target the button this
// renders (aria-label="Open accessibility settings", id="accessibility-settings").
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), { ssr: false });
// Service worker registration — makes the offline/PWA capability REAL. Deferred
// to tier-2 so it never competes with first paint. sw.js uses network-first for
// HTML (always fresh when online) so it cannot serve stale chunks.
const ServiceWorkerRegistration = dynamic(() => import('@/components/pwa/ServiceWorkerRegistration'), { ssr: false });

export default function ClientSideComponents() {
  const pathname = usePathname() || '';
  // The Solar & UPS Intelligence Hub is a focused engineering workspace.
  // Suppress the global WhatsApp/PWA floating widgets on /hub/* so they
  // never overlap simulator inputs, KPI cards, or the governance strip.
  const isHub = pathname === '/hub' || pathname.startsWith('/hub/');

  const [tier1, setTier1] = useState(false); // Essential (1s)
  const [tier2, setTier2] = useState(false); // Nice-to-have (3s)

  // Non-blocking idle callback wrapper
  const scheduleIdle = useCallback((fn: () => void, delay: number) => {
    return setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, options?: { timeout: number }) => void })
          .requestIdleCallback(fn, { timeout: 2000 });
      } else {
        fn();
      }
    }, delay);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Tier 1: Essential (1 second) - Cookie consent required by law
    timers.push(scheduleIdle(() => setTier1(true), 1000));

    // Tier 2: Nice-to-have (3 seconds) - Protection, PWA
    timers.push(scheduleIdle(() => setTier2(true), 3000));

    return () => timers.forEach(clearTimeout);
  }, [scheduleIdle]);

  return (
    <>
      {/* TIER 1: Essential - Cookie Consent (GDPR required) + Accessibility.
          The accessibility toolbar is mounted on EVERY page (including /hub) so
          visually-impaired users always have it; it sits bottom-left and does
          not overlap the bottom-right hub widgets. */}
      {tier1 && (
        <>
          <CookieConsent />
          <AccessibilityWidget />
          {!isHub && <ClientWhatsApp />}
        </>
      )}

      {/* TIER 2: Nice-to-have - Protection layers (suppressed on /hub
          engineering workspace so right-click, Ctrl+C and selection remain
          available to operators copying values out of the simulator). */}
      {tier2 && !isHub && (
        <>
          {/* Layer 1: Basic Content Protection (keyboard, right-click, drag) */}
          <ContentProtection />

          {/* Layer 2: DMCA Protection (watermark, clipboard, advanced) */}
          <DMCAProtection
            enableWatermark={false}
            enableRightClickProtection={true}
            enableCopyProtection={true}
            enableDevToolsProtection={false}
            enablePrintProtection={false}
            enableScreenshotDetection={false}
            showWarnings={false}
          />

          <PWAInstallPrompt />
        </>
      )}

      {/* Service worker — registered on every page (tier 2) so offline support
          works site-wide, not just where the protection layers are active. */}
      {tier2 && <ServiceWorkerRegistration />}
    </>
  );
}