'use client';

/**
 * Security Provider Component
 *
 * COPYRIGHT NOTICE:
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 * This component provides client-side security protections.
 */

import React, { useEffect, createContext, useContext, useState } from 'react';
import {
  initializeProtection,
  generateDeviceFingerprint,
  detectScrapingAttempt,
  verifyDomain,
  SECURITY_METADATA,
} from '@/lib/security';

interface SecurityContextType {
  isSecure: boolean;
  deviceFingerprint: string;
  securityLevel: 'high' | 'medium' | 'low';
  copyrightNotice: string;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecure: true,
  deviceFingerprint: '',
  securityLevel: 'high',
  copyrightNotice: `© ${SECURITY_METADATA.copyrightYear} ${SECURITY_METADATA.copyrightHolder}. All Rights Reserved.`,
});

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: React.ReactNode;
  enableProtections?: boolean;
}

export function SecurityProvider({ children, enableProtections = true }: SecurityProviderProps) {
  const [securityState, setSecurityState] = useState<SecurityContextType>({
    isSecure: true,
    deviceFingerprint: '',
    securityLevel: 'high',
    copyrightNotice: `© ${SECURITY_METADATA.copyrightYear} ${SECURITY_METADATA.copyrightHolder}. All Rights Reserved.`,
  });

  useEffect(() => {
    // Generate device fingerprint
    const fingerprint = generateDeviceFingerprint();

    // Check for scraping attempts
    const isScraper = detectScrapingAttempt(navigator.userAgent);

    // Verify domain
    const isAuthorizedDomain = verifyDomain(window.location.hostname);

    // Initialize protections in production
    if (enableProtections && process.env.NODE_ENV === 'production') {
      initializeProtection({
        disableRightClick: false, // Can be enabled for extra protection
        disableTextSelection: false, // Can be enabled for extra protection
        blockShortcuts: true,
        protectConsole: true,
      });
    }

    // Update security state
    setSecurityState({
      isSecure: !isScraper && isAuthorizedDomain,
      deviceFingerprint: fingerprint,
      securityLevel: isScraper ? 'low' : isAuthorizedDomain ? 'high' : 'medium',
      copyrightNotice: `© ${SECURITY_METADATA.copyrightYear} ${SECURITY_METADATA.copyrightHolder}. All Rights Reserved.`,
    });

    // Add copyright watermark to page
    if (process.env.NODE_ENV === 'production') {
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        opacity: 0.1;
        pointer-events: none;
        z-index: 9999;
        font-size: 10px;
        padding: 4px;
        color: #000;
      `;
      watermark.textContent = `© ${SECURITY_METADATA.copyrightYear} ${SECURITY_METADATA.copyrightHolder}`;
      document.body.appendChild(watermark);

      return () => {
        watermark.remove();
      };
    }
  }, [enableProtections]);

  // Block rendering for detected scrapers in production
  if (!securityState.isSecure && process.env.NODE_ENV === 'production') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>Unauthorized access attempt detected.</p>
        <p>This application is protected by copyright law.</p>
        <p>© {SECURITY_METADATA.copyrightYear} {SECURITY_METADATA.copyrightHolder}. All Rights Reserved.</p>
      </div>
    );
  }

  return (
    <SecurityContext.Provider value={securityState}>
      {children}
    </SecurityContext.Provider>
  );
}

// Copyright footer component
export function CopyrightFooter({ className }: { className?: string }) {
  const { copyrightNotice } = useSecurityContext();

  return (
    <div className={`text-center text-xs text-gray-500 py-2 ${className || ''}`}>
      {copyrightNotice}
      <br />
      <span className="text-[10px]">
        Protected by international copyright law. Unauthorized use prohibited.
      </span>
    </div>
  );
}

// Security badge component
export function SecurityBadge() {
  const { securityLevel } = useSecurityContext();

  const colors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[securityLevel]}`}>
      🔒 Secured
    </span>
  );
}

export default SecurityProvider;
