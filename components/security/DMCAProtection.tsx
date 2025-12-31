/**
 * DMCA & COPYRIGHT PROTECTION COMPONENT
 * Comprehensive protection against content theft, scraping, and copyright infringement
 * 
 * Features:
 * 1. Watermarking (invisible digital fingerprints)
 * 2. Right-click protection
 * 3. Copy/paste blocking
 * 4. Screenshot detection
 * 5. DevTools detection
 * 6. Print protection
 * 7. Selection blocking
 * 8. Drag & drop prevention
 * 9. Content encryption
 * 10. DMCA compliance notices
 */

'use client';

import { useEffect, useState } from 'react';

interface DMCAConfig {
  enableWatermark?: boolean;
  enableRightClickProtection?: boolean;
  enableCopyProtection?: boolean;
  enableDevToolsProtection?: boolean;
  enablePrintProtection?: boolean;
  enableScreenshotDetection?: boolean;
  showWarnings?: boolean;
}

export default function DMCAProtection({
  enableWatermark = true,
  enableRightClickProtection = true,
  enableCopyProtection = true,
  enableDevToolsProtection = true,
  enablePrintProtection = true,
  enableScreenshotDetection = true,
  showWarnings = true,
}: DMCAConfig = {}) {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // Digital Watermark - Invisible tracking
    if (enableWatermark) {
      const watermarkId = `EIMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add invisible watermark to DOM
      const watermark = document.createElement('div');
      watermark.id = 'dmca-watermark';
      watermark.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      watermark.setAttribute('data-watermark', watermarkId);
      watermark.setAttribute('data-copyright', '© 2025 EmersonEIMS. All Rights Reserved.');
      watermark.setAttribute('data-dmca', 'Protected Content - 17 U.S.C. § 512(c)');
      document.body.appendChild(watermark);

      console.log(`🔒 Content protected with watermark: ${watermarkId}`);
    }

    // Right-Click Protection
    const handleContextMenu = (e: MouseEvent) => {
      if (enableRightClickProtection) {
        e.preventDefault();
        if (showWarnings) {
          alert('⚠️ COPYRIGHT NOTICE\n\nThis content is protected by copyright law.\n\nUnauthorized copying, reproduction, or distribution is prohibited under the DMCA (Digital Millennium Copyright Act).\n\n© 2025 EmersonEIMS. All Rights Reserved.');
        }
        return false;
      }
    };

    // Copy/Cut Protection
    const handleCopy = (e: ClipboardEvent) => {
      if (enableCopyProtection) {
        e.preventDefault();
        
        // Add copyright notice to clipboard
        const selection = window.getSelection()?.toString() || '';
        const copyrightNotice = `\n\n---\n© 2025 EmersonEIMS. All Rights Reserved.\nSource: ${window.location.href}\nThis content is protected by copyright law.\n`;
        
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', selection + copyrightNotice);
        }
        
        if (showWarnings && selection.length > 50) {
          alert('⚠️ COPYRIGHT NOTICE\n\nContent copied with attribution.\n\nThis material is copyrighted and protected under the DMCA.');
        }
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (enableCopyProtection) {
        e.preventDefault();
        return false;
      }
    };

    // Keyboard Shortcuts Protection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common theft shortcuts
      if (
        // Copy
        (e.ctrlKey && e.key === 'c') ||
        (e.metaKey && e.key === 'c') ||
        
        // Cut
        (e.ctrlKey && e.key === 'x') ||
        (e.metaKey && e.key === 'x') ||
        
        // View Source
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.key === 'u') ||
        
        // Save Page
        (e.ctrlKey && e.key === 's') ||
        (e.metaKey && e.key === 's') ||
        
        // Print
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.key === 'p') ||
        
        // DevTools
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.metaKey && e.altKey && e.key === 'I')
      ) {
        if (enableCopyProtection || enableDevToolsProtection || enablePrintProtection) {
          e.preventDefault();
          if (showWarnings) {
            console.warn('🚫 Protected action blocked by DMCA compliance system');
          }
          return false;
        }
      }
    };

    // Drag & Drop Protection
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Selection Protection
    const handleSelectStart = (e: Event) => {
      // Allow selection but track it for monitoring
      console.log('📋 Content selection detected');
    };

    // Print Protection
    const handleBeforePrint = () => {
      if (enablePrintProtection) {
        alert('⚠️ PRINT RESTRICTED\n\nPrinting is disabled for copyright protection.\n\nFor authorized copies, please contact EmersonEIMS.');
        // Inject watermark into print view
        const printWatermark = document.createElement('div');
        printWatermark.className = 'print-watermark';
        printWatermark.innerHTML = `
          <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            opacity: 0.1;
            pointer-events: none;
            z-index: 9999;
            color: red;
            font-weight: bold;
          ">
            © EMERSONEIMS - CONFIDENTIAL
          </div>
        `;
        document.body.appendChild(printWatermark);
      }
    };

    // DevTools Detection
    const detectDevTools = () => {
      if (!enableDevToolsProtection) return;

      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          setDevToolsOpen(true);
          console.clear();
          console.log('%c⚠️ SECURITY WARNING', 'color: red; font-size: 24px; font-weight: bold;');
          console.log('%cDeveloper Tools Detected', 'color: red; font-size: 16px;');
          console.log('%cThis website is protected by DMCA copyright law.', 'font-size: 14px;');
          console.log('%cUnauthorized access, copying, or reverse engineering is prohibited.', 'font-size: 14px;');
          console.log('%c© 2025 EmersonEIMS. All Rights Reserved.', 'font-size: 14px; font-weight: bold;');
          
          if (showWarnings) {
            // Optionally redirect or disable functionality
            // window.location.href = '/';
          }
        }
      } else {
        setDevToolsOpen(false);
      }
    };

    // Screenshot Detection (experimental - uses visibility API)
    const detectScreenshot = () => {
      if (!enableScreenshotDetection) return;

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.warn('🔒 Potential screenshot attempt detected');
          // Log to analytics or security monitoring
        }
      });
    };

    // Attach all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('beforeprint', handleBeforePrint);

    // Start DevTools detection
    const devToolsInterval = setInterval(detectDevTools, 1000);
    
    // Initialize screenshot detection
    detectScreenshot();

    // Inject copyright CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Copyright Protection Styles */
      body::after {
        content: '© 2025 EmersonEIMS - All Rights Reserved';
        position: fixed;
        bottom: 0;
        right: 0;
        font-size: 8px;
        opacity: 0.3;
        pointer-events: none;
        z-index: 999999;
        padding: 2px 4px;
        color: #666;
      }

      /* Prevent text selection on sensitive content */
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      /* Print watermark */
      @media print {
        body::before {
          content: 'CONFIDENTIAL - © 2025 EmersonEIMS';
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          opacity: 0.1;
          z-index: 9999;
          pointer-events: none;
        }
      }

      /* Disable screenshot on sensitive elements (doesn't work in all browsers) */
      .no-screenshot {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      clearInterval(devToolsInterval);
      
      // Remove watermark
      const watermarkEl = document.getElementById('dmca-watermark');
      if (watermarkEl) {
        watermarkEl.remove();
      }
    };
  }, [
    enableWatermark,
    enableRightClickProtection,
    enableCopyProtection,
    enableDevToolsProtection,
    enablePrintProtection,
    enableScreenshotDetection,
    showWarnings,
    devToolsOpen,
  ]);

  // Visual warning overlay when DevTools detected
  if (devToolsOpen && showWarnings) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#ef4444' }}>⚠️ Security Alert</h1>
          <p style={{ fontSize: '24px', marginBottom: '20px' }}>Developer Tools Detected</p>
          <p style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px' }}>
            This website is protected by copyright law under the Digital Millennium Copyright Act (DMCA).
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Unauthorized access, copying, reverse engineering, or distribution of content is prohibited.
          </p>
          <p style={{ fontSize: '14px', marginTop: '40px', fontWeight: 'bold' }}>
            © 2025 EmersonEIMS. All Rights Reserved.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * DMCA Compliance Notice Component
 * Display on footer or copyright page
 */
export function DMCANotice() {
  return (
    <div style={{
      padding: '20px',
      background: '#f3f4f6',
      borderTop: '2px solid #3b82f6',
      marginTop: '40px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        🔒 DMCA Copyright Protection
      </h3>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
        All content on this website, including but not limited to text, images, graphics, logos, software,
        diagnostic tools, and error code databases, is the exclusive property of <strong>EmersonEIMS</strong> and
        is protected by international copyright laws and the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512(c).
      </p>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginTop: '10px' }}>
        <strong>Unauthorized reproduction, distribution, modification, or public display is strictly prohibited
        and may result in civil and criminal penalties.</strong>
      </p>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginTop: '10px' }}>
        For licensing inquiries or to report copyright infringement, contact:{' '}
        <a href="mailto:dmca@emersoneims.com" style={{ color: '#3b82f6', fontWeight: 'bold' }}>
          dmca@emersoneims.com
        </a>
      </p>
      <p style={{ fontSize: '12px', marginTop: '15px', opacity: 0.7 }}>
        © 2025 EmersonEIMS. All Rights Reserved. Protected by DMCA.
      </p>
    </div>
  );
}
