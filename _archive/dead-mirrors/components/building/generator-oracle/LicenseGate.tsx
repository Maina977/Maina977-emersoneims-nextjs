'use client';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                               ║
 * ║   GENERATOR ORACLE™ - Proprietary Diagnostic System                          ║
 * ║   Copyright © 2024-2026 EmersonEIMS. All Rights Reserved.                    ║
 * ║                                                                               ║
 * ║   NOTICE: This software is the exclusive property of EmersonEIMS.            ║
 * ║   Unauthorized copying, modification, distribution, or use of this           ║
 * ║   software, in whole or in part, is strictly prohibited.                     ║
 * ║                                                                               ║
 * ║   This software is protected by international copyright laws and treaties.   ║
 * ║   Violators will be prosecuted to the fullest extent of the law.             ║
 * ║                                                                               ║
 * ║   Licensed exclusively to: EmersonEIMS                                        ║
 * ║   Website: https://www.emersoneims.com                                        ║
 * ║                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * GENERATOR ORACLE provides FULL DIAGNOSTIC ACCESS to authorized users.
 * All ECM, calibration, and programming features are fully unlocked for
 * professional generator diagnostics and servicing.
 */

import { ReactNode, useEffect } from 'react';

interface LicenseGateProps {
  children: ReactNode;
}

// Product identification
const PRODUCT_NAME = 'Generator Oracle™';
const COPYRIGHT_HOLDER = 'EmersonEIMS';
const COPYRIGHT_YEAR = '2024-2026';
const PRODUCT_VERSION = '3.0';

export default function LicenseGate({ children }: LicenseGateProps) {
  useEffect(() => {
    // Console copyright notice - warns against unauthorized use
    console.log(
      `%c
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ${PRODUCT_NAME} v${PRODUCT_VERSION}                                                           ║
║   Copyright © ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}. All Rights Reserved.                    ║
║                                                                               ║
║   ⚠️  PROPRIETARY SOFTWARE - DO NOT COPY OR MODIFY                            ║
║                                                                               ║
║   This diagnostic system is protected intellectual property.                  ║
║   Unauthorized reproduction or distribution is strictly prohibited            ║
║   and may result in severe civil and criminal penalties.                      ║
║                                                                               ║
║   For licensing inquiries: info@emersoneims.com                               ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`,
      'color: #22d3ee; font-family: monospace; font-size: 11px;'
    );

    // Disable right-click context menu on Generator Oracle
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-generator-oracle]')) {
        e.preventDefault();
        console.warn('🔒 Generator Oracle™ content is protected by copyright.');
      }
    };

    // Detect dev tools opening (basic deterrent)
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        console.warn(
          '%c⚠️ Generator Oracle™ is proprietary software. Reverse engineering is prohibited.',
          'color: #f59e0b; font-weight: bold; font-size: 14px;'
        );
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('resize', detectDevTools);

    // Initial check
    detectDevTools();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

  // Full access to all diagnostic features - no restrictions on generator work
  return (
    <div data-generator-oracle="true" data-copyright={`© ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}`}>
      {children}
    </div>
  );
}

// Export product info for use in other components
export const GeneratorOracleBranding = {
  name: PRODUCT_NAME,
  copyright: `© ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}`,
  version: PRODUCT_VERSION,
  tagline: 'Professional Generator Diagnostic System',
  legal: 'All Rights Reserved. Unauthorized copying or modification prohibited.',
};
