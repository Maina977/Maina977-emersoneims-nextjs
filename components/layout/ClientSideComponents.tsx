'use client';

import { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// STABLE: Regular imports to avoid Turbopack HMR issues with lazy()
// These are small components that don't affect initial load significantly
// ═══════════════════════════════════════════════════════════════════════════════
import DMCAProtection from '@/components/security/DMCAProtection';
import ContentProtection from '@/components/security/ContentProtection';
import CookieConsent from '@/components/compliance/CookieConsent';
import ClientWhatsApp from '@/components/chat/ClientWhatsApp';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';

export default function ClientSideComponents() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render after hydration is complete
    const timer = setTimeout(() => setMounted(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything during SSR or initial hydration
  if (!mounted) return null;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          MULTI-LAYER CONTENT PROTECTION
          © 2026 EmersonEIMS. All Rights Reserved.
      ════════════════════════════════════════════════════════════════════ */}
      
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
      
      {/* GDPR Cookie Consent */}
      <CookieConsent />
      
      {/* WhatsApp Chat */}
      <ClientWhatsApp />
    </>
  );
}