'use client';

import { useEffect, useState, useCallback } from 'react';
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

export default function ClientSideComponents() {
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
      {/* TIER 1: Essential - Cookie Consent (GDPR required) */}
      {tier1 && (
        <>
          <CookieConsent />
          <ClientWhatsApp />
        </>
      )}

      {/* TIER 2: Nice-to-have - Protection layers */}
      {tier2 && (
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

          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
        </>
      )}
    </>
  );
}