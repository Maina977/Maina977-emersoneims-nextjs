'use client';

import { useEffect } from 'react';

/**
 * MAXIMUM SECURITY COMPONENT
 * Provides additional client-side security measures
 */
export default function MaximumSecurity() {
  useEffect(() => {
    let securityInterval: ReturnType<typeof setInterval> | null = null;
    let sessionTimeout: ReturnType<typeof setTimeout> | null = null;
    let domObserver: MutationObserver | null = null;
    let visibilityChangeHandler: (() => void) | null = null;

    const win = window as unknown as {
      fetch?: typeof window.fetch;
      eval?: (code: string) => unknown;
      location: Location;
      self: Window;
      top: Window | null;
    };

    const originalFetch = win.fetch;
    const originalEval = win.eval;
    const consoleRecord = console as unknown as Record<string, (...args: unknown[]) => unknown>;
    const originalConsole: Partial<Record<string, (...args: unknown[]) => unknown>> = {};

    // Enhanced security measures
    const securityChecks = () => {
      try {
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
      if (typeof originalFetch === 'function') {
        win.fetch = function (...args) {
          const firstArg = args[0] as unknown;
          const url =
            typeof firstArg === 'string'
              ? firstArg
              : firstArg && typeof firstArg === 'object' && 'url' in (firstArg as Record<string, unknown>)
                ? String((firstArg as Record<string, unknown>).url)
                : '';
        const suspiciousUrls = [
          'localhost', '127.0.0.1', '0.0.0.0',
          'eval(', 'javascript:', 'data:', 'vbscript:',
          'file://', 'ftp://'
        ];

          const urlLower = url.toLowerCase();
        if (urlLower && suspiciousUrls.some(suspicious => urlLower.includes(suspicious))) {
          console.warn('🚨 Suspicious network request blocked:', url);
          return Promise.reject(new Error('Security violation'));
        }

          return originalFetch.apply(window, args as Parameters<typeof window.fetch>);
        };
      }

      // Monitor for suspicious script executions
      if (typeof originalEval === 'function') {
        win.eval = function (code: string) {
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
      }

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
      try {
        const clipboard = navigator.clipboard;
        if (clipboard && typeof clipboard.readText === 'function') {
          clipboard.readText = function () {
            console.warn('🚨 Clipboard read attempt blocked');
            return Promise.reject(new Error('Security violation'));
          };
        }
      } catch {
        // Ignore clipboard patch failures (not available / not writable)
      }

      // Enhanced anti-debugging
      let debugCount = 0;
      Object.keys(consoleRecord).forEach((key) => {
        if (typeof consoleRecord[key] === 'function') {
          originalConsole[key] = consoleRecord[key];
        }
      });

      Object.keys(originalConsole).forEach((key) => {
        const original = originalConsole[key];
        if (!original) return;

        consoleRecord[key] = (...args: unknown[]) => {
          debugCount++;
          if (debugCount > 100) {
            console.clear();
            debugCount = 0;
            try {
              alert('🚫 Excessive debugging detected. Access restricted.');
            } catch {
              // Ignore alert failures
            }
            window.location.href = 'about:blank';
            return;
          }
          return original(...args);
        };
      });

      // Monitor for DOM manipulation attempts
      if (typeof MutationObserver !== 'undefined' && document.body) {
        domObserver = new MutationObserver((mutations) => {
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

        domObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src', 'href', 'onclick'],
        });
      }

      // Self-destruct mechanism for compromised sessions
      const scheduleSelfDestruct = () => {
        if (sessionTimeout) clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            try {
              localStorage.clear();
              sessionStorage.clear();
            } catch {
              // Ignore storage failures
            }

            try {
              document.cookie.split(';').forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, '')
                  .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
              });
            } catch {
              // Ignore cookie clearing failures
            }
          }
        }, 300000);
      };

      visibilityChangeHandler = () => {
        if (document.visibilityState === 'visible') {
          scheduleSelfDestruct();
        }
      };

      scheduleSelfDestruct();
      document.addEventListener('visibilitychange', visibilityChangeHandler);

      console.log('🛡️ Maximum Security Component Activated');
      } catch (err) {
        console.warn('🛡️ Maximum Security disabled due to runtime error:', err);
      }
    };

    // Run security checks
    securityChecks();

    // Periodic security scans
    securityInterval = setInterval(() => {
      // Check for new suspicious elements
      try {
        const suspiciousElements = document.querySelectorAll('script[src*="localhost"], iframe, object, embed');
        suspiciousElements.forEach(element => {
          console.warn('🚨 Suspicious element found and removed');
          element.remove();
        });
      } catch {
        // Ignore scan failures
      }
    }, 5000);

    return () => {
      if (securityInterval) clearInterval(securityInterval);
      if (sessionTimeout) clearTimeout(sessionTimeout);
      if (domObserver) domObserver.disconnect();
      if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
      }

      if (originalFetch) {
        win.fetch = originalFetch;
      }
      if (originalEval) {
        win.eval = originalEval;
      }
      Object.keys(originalConsole).forEach((key) => {
        const original = originalConsole[key];
        if (original) {
          consoleRecord[key] = original;
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
}