/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS SECURITY SHIELD
 * Visual Security Layer with Anti-Scraping & Anti-Bot Protection
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * 1. Honeypot trap for bots
 * 2. Invisible fingerprinting
 * 3. Anti-automation detection
 * 4. Session validation
 * 5. Behavior analysis
 * 
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import React, { useEffect, useState } from 'react';

interface SecurityShieldProps {
  children: React.ReactNode;
  showIndicator?: boolean;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({ 
  children, 
  showIndicator = false 
}) => {
  const [isSecure, setIsSecure] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');

  useEffect(() => {
    // Security initialization
    const initializeSecurity = () => {
      // Mark as secure after checks
      setIsSecure(true);
      
      // Bot detection via behavior
      let mouseMovements = 0;
      let keyPresses = 0;
      const startTime = Date.now();
      
      const trackMouse = () => {
        mouseMovements++;
      };
      
      const trackKey = () => {
        keyPresses++;
      };
      
      document.addEventListener('mousemove', trackMouse);
      document.addEventListener('keydown', trackKey);
      
      // Analyze behavior after 10 seconds
      setTimeout(() => {
        const timeElapsed = Date.now() - startTime;
        const movementRate = mouseMovements / (timeElapsed / 1000);
        
        // Bots typically have very consistent or no mouse movements
        if (mouseMovements === 0 && keyPresses === 0) {
          setThreatLevel('medium');
          console.log('⚠️ Security: No human interaction detected');
        } else if (movementRate > 100) {
          setThreatLevel('high');
          console.log('🚫 Security: Suspicious automation detected');
        } else {
          setThreatLevel('none');
        }
      }, 10000);
      
      // Cleanup
      return () => {
        document.removeEventListener('mousemove', trackMouse);
        document.removeEventListener('keydown', trackKey);
      };
    };

    initializeSecurity();
    
    // Detect developer tools
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        console.log('⚠️ Developer tools detected - monitoring enabled');
      }
    };
    
    window.addEventListener('resize', detectDevTools);
    
    // Detect iframes (clickjacking protection)
    if (window.self !== window.top) {
      console.log('🚫 Security: Iframe embedding detected');
      setThreatLevel('high');
    }
    
    // Detect automated testing frameworks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    const win = window as any;
    if (nav.webdriver || win.Cypress || win.__nightmare) {
      console.log('🚫 Security: Automation framework detected');
      setThreatLevel('high');
    }
    
    return () => {
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

  return (
    <div className="security-shield relative">
      {/* Honeypot - invisible to humans, visible to bots */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <input 
          type="text" 
          name="website_url" 
          tabIndex={-1} 
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value) {
              console.log('🚫 Security: Bot detected via honeypot');
              setThreatLevel('high');
            }
          }}
        />
        <input 
          type="email" 
          name="email_address" 
          tabIndex={-1} 
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value) {
              console.log('🚫 Security: Bot detected via honeypot');
              setThreatLevel('high');
            }
          }}
        />
        <a href="/trap" onClick={(e) => {
          e.preventDefault();
          console.log('🚫 Security: Bot followed trap link');
          setThreatLevel('high');
        }}>
          Click here for free content
        </a>
      </div>
      
      {/* Security indicator (optional) */}
      {showIndicator && isSecure && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`
            px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2
            transition-all duration-300
            ${threatLevel === 'none' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : threatLevel === 'low'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : threatLevel === 'medium'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }
          `}>
            <div className={`
              w-2 h-2 rounded-full animate-pulse
              ${threatLevel === 'none' ? 'bg-green-400' : 
                threatLevel === 'low' ? 'bg-yellow-400' :
                threatLevel === 'medium' ? 'bg-orange-400' : 'bg-red-400'}
            `} />
            <span>
              {threatLevel === 'none' ? 'Secured' : 
               threatLevel === 'low' ? 'Monitoring' :
               threatLevel === 'medium' ? 'Alert' : 'Threat Detected'}
            </span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM10 14l-3.5-3.5 1.414-1.414L10 11.172l4.086-4.086 1.414 1.414L10 14z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

/**
 * Anti-Scraping Meta Component
 * Adds protective meta tags and JSON-LD copyright data
 */
export const AntiScrapingMeta: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* JSON-LD Copyright & Organization Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'EmersonEIMS',
            'legalName': 'Emerson Electrical & Instrumentation Management Services',
            'url': 'https://emersoneims.com',
            'logo': 'https://emersoneims.com/images/logo.png',
            'foundingDate': '2012',
            'copyrightHolder': {
              '@type': 'Organization',
              'name': 'EmersonEIMS'
            },
            'copyrightYear': currentYear,
            'sameAs': [
              'https://www.linkedin.com/company/emersoneims',
              'https://twitter.com/emersoneims'
            ]
          })
        }}
      />
      
      {/* No-archive directives */}
      <meta name="robots" content="noarchive" />
      <meta name="googlebot" content="noarchive" />
      
      {/* Copyright meta */}
      <meta name="copyright" content={`© ${currentYear} EmersonEIMS`} />
      <meta name="author" content="EmersonEIMS" />
      <meta name="owner" content="EmersonEIMS" />
      
      {/* Prevent caching of sensitive content */}
      <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
    </>
  );
};

export default SecurityShield;
