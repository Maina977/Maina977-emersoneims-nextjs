'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS SKIP NAVIGATION - WCAG 2.1 AAA Compliant
 * 
 * Provides multiple skip links for:
 * - Main content
 * - Navigation
 * - Contact section
 * - Accessibility settings
 * 
 * Supports keyboard navigation for visually impaired users
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function SkipToContent() {
  return (
    <nav 
      aria-label="Skip navigation" 
      className="skip-navigation"
    >
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black focus:text-lg"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      {/* Skip to Navigation */}
      <a
        href="#main-navigation"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-[220px] focus:z-[9999] focus:px-6 focus:py-3 focus:bg-amber-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black focus:text-lg"
        tabIndex={0}
      >
        Skip to navigation
      </a>
      
      {/* Skip to Contact */}
      <a
        href="#contact-section"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-[430px] focus:z-[9999] focus:px-6 focus:py-3 focus:bg-green-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black focus:text-lg"
        tabIndex={0}
      >
        Skip to contact
      </a>
      
      {/* Accessibility Help */}
      <a
        href="#accessibility-settings"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-[610px] focus:z-[9999] focus:px-6 focus:py-3 focus:bg-purple-500 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black focus:text-lg"
        tabIndex={0}
      >
        Accessibility (Alt+A)
      </a>
    </nav>
  );
}








