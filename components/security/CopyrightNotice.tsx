/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS COPYRIGHT & LEGAL NOTICE COMPONENT
 * Professional Legal Protection for All Content
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This component adds:
 * - Dynamic copyright year
 * - Comprehensive legal notices
 * - DMCA protection statements
 * - Terms of use reminders
 * 
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';

interface CopyrightNoticeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export const CopyrightNotice: React.FC<CopyrightNoticeProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2012;
  const yearDisplay = currentYear > startYear ? `${startYear}-${currentYear}` : startYear;

  if (variant === 'minimal') {
    return (
      <span className={`text-gray-500 text-xs ${className}`}>
        © {yearDisplay} EmersonEIMS
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        <p>© {yearDisplay} EmersonEIMS. All Rights Reserved.</p>
        <p className="text-xs mt-1 text-gray-500">
          Protected by International Copyright Law | DMCA Protected
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`text-gray-400 ${className}`}>
      <div className="border-t border-gray-800 pt-6 mt-6">
        {/* Main Copyright */}
        <p className="text-sm font-semibold text-white mb-2">
          © {yearDisplay} EmersonEIMS - Emerson Electrical & Instrumentation Management Services
        </p>
        
        {/* Legal Statement */}
        <p className="text-xs text-gray-500 mb-3">
          All content, including but not limited to text, graphics, logos, images, audio clips, 
          video clips, data compilations, software, and the design, selection, and arrangement thereof, 
          are the exclusive property of EmersonEIMS or its content suppliers and are protected by 
          international copyright laws.
        </p>
        
        {/* Protection Badges */}
        <div className="flex flex-wrap gap-3 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
            DMCA Protected
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Copyright Secured
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            SSL Encrypted
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
            Enterprise Security
          </span>
        </div>
        
        {/* Legal Links */}
        <div className="text-xs text-gray-500 space-x-4">
          <span>Privacy Policy</span>
          <span>|</span>
          <span>Terms of Service</span>
          <span>|</span>
          <span>DMCA Policy</span>
          <span>|</span>
          <span>Cookie Policy</span>
        </div>
        
        {/* DMCA Notice */}
        <p className="text-xs text-gray-600 mt-3 border-t border-gray-800 pt-3">
          <strong>DMCA Notice:</strong> EmersonEIMS respects the intellectual property rights of others. 
          If you believe any content on this website infringes upon your copyright, please contact us 
          with relevant documentation for immediate review and action.
        </p>
      </div>
    </div>
  );
};

/**
 * Invisible copyright watermark that gets embedded in the page
 * Using static year to prevent hydration mismatch
 */
export const InvisibleWatermark: React.FC = () => {
  // Static year to prevent hydration issues
  const currentYear = 2026;
  
  return (
    <>
      {/* HTML comment watermark */}
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <!--
            ═══════════════════════════════════════════════════════════════════════════════
            
            ██████████████████████████████████████████████████████████████████████████████
            ██                                                                          ██
            ██   EMERSONEIMS - PROPRIETARY & CONFIDENTIAL                              ██
            ██                                                                          ██
            ██   © ${currentYear} EmersonEIMS. All Rights Reserved.                           ██
            ██                                                                          ██
            ██   This website and all its contents are protected by international       ██
            ██   copyright law. Unauthorized copying, reproduction, distribution,       ██
            ██   or any form of exploitation of this material without express           ██
            ██   written consent from EmersonEIMS is strictly prohibited.               ██
            ██                                                                          ██
            ██   DMCA Protected | SSL Encrypted | Enterprise Security                   ██
            ██                                                                          ██
            ██   Contact: info@emersoneims.com                                          ██
            ██   Website: https://emersoneims.com                                       ██
            ██                                                                          ██
            ██   Violation of these rights may result in severe civil and criminal      ██
            ██   penalties, and will be prosecuted to the maximum extent possible       ██
            ██   under the law.                                                         ██
            ██                                                                          ██
            ██████████████████████████████████████████████████████████████████████████████
            
            ═══════════════════════════════════════════════════════════════════════════════
            -->
          `
        }}
        style={{ display: 'none' }}
      />
      
      {/* CSS-hidden metadata */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        data-copyright={`© ${currentYear} EmersonEIMS`}
        data-dmca="protected"
        data-security="enterprise"
      >
        © {currentYear} EmersonEIMS - All Rights Reserved - DMCA Protected - 
        Unauthorized reproduction prohibited - Contact: info@emersoneims.com
      </div>
    </>
  );
};

export default CopyrightNotice;
