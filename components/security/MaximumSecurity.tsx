'use client';

import { useEffect } from 'react';

/**
 * MAXIMUM SECURITY COMPONENT
 * Provides additional client-side security measures
 */
export default function MaximumSecurity() {
  useEffect(() => {
    // Enhanced security measures
    const securityChecks = () => {
      // Check for iframe embedding
      if (window.self !== window.top) {
        document.body.innerHTML = '<h1>🚫 Access Denied</h1><p>This content cannot be embedded.</p>';
        return;
      }

      // Check for suspicious extensions
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
      const currentUrl = window.location.href.toLowerCase();

      if (suspiciousExtensions.some(ext => currentUrl.includes(ext))) {
        window.location.href = 'about:blank';
        return;
      }

      // Monitor for suspicious network requests
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0] as string;
        const suspiciousUrls = [
          'localhost', '127.0.0.1', '0.0.0.0',
          'eval(', 'javascript:', 'data:', 'vbscript:',
          'file://', 'ftp://'
        ];

        if (suspiciousUrls.some(suspicious => url.includes(suspicious))) {
          console.warn('🚨 Suspicious network request blocked:', url);
          return Promise.reject(new Error('Security violation'));
        }

        return originalFetch.apply(this, args);
      };

      // Monitor for suspicious script executions
      const originalEval = window.eval;
      window.eval = function(code: string) {
        const suspiciousPatterns = [
          'document.cookie', 'localStorage', 'sessionStorage',
          'XMLHttpRequest', 'fetch(', 'innerHTML', 'outerHTML'
        ];

        if (suspiciousPatterns.some(pattern => code.includes(pattern))) {
          console.warn('🚨 Suspicious eval execution blocked');
          throw new Error('Security violation');
        }

        return originalEval(code);
      };

      // Anti-screenshot protection (visual disruption)
      const antiScreenshot = () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.001);
          pointer-events: none;
          z-index: 10000;
          animation: security-flash 0.1s infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
          @keyframes security-flash {
            0%, 100% { opacity: 0.001; }
            50% { opacity: 0.01; }
          }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
      };

      // Only activate anti-screenshot on sensitive pages
      if (window.location.pathname.includes('admin') ||
          window.location.pathname.includes('dashboard') ||
          window.location.pathname.includes('config')) {
        antiScreenshot();
      }

      // Monitor for clipboard access
      navigator.clipboard.readText = function() {
        console.warn('🚨 Clipboard read attempt blocked');
        return Promise.reject(new Error('Security violation'));
      };

      // Enhanced anti-debugging
      let debugCount = 0;
      const originalConsole = { ...console };

      Object.keys(console).forEach(key => {
        (console as any)[key] = function(...args: any[]) {
          debugCount++;
          if (debugCount > 100) {
            console.clear();
            debugCount = 0;
            alert('🚫 Excessive debugging detected. Access restricted.');
            window.location.href = 'about:blank';
            return;
          }
          return (originalConsole as any)[key].apply(console, args);
        };
      });

      // Monitor for DOM manipulation attempts
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                  console.warn('🚨 Suspicious element injection detected');
                  element.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'onclick']
      });

      // Self-destruct mechanism for compromised sessions
      let sessionTimeout = setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          // Clear sensitive data
          localStorage.clear();
          sessionStorage.clear();

          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        }
      }, 300000); // 5 minutes

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          clearTimeout(sessionTimeout);
          sessionTimeout = setTimeout(() => {
            // Security timeout
          }, 300000);
        }
      });

      console.log('🛡️ Maximum Security Component Activated');
    };

    // Run security checks
    securityChecks();

    // Periodic security scans
    const securityInterval = setInterval(() => {
      // Check for new suspicious elements
      const suspiciousElements = document.querySelectorAll('script[src*="localhost"], iframe, object, embed');
      suspiciousElements.forEach(element => {
        console.warn('🚨 Suspicious element found and removed');
        element.remove();
      });
    }, 5000);

    return () => {
      clearInterval(securityInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}