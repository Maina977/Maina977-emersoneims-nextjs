'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS SCREEN READER ANNOUNCER
 * WCAG 2.1 AAA Compliant - For Visually Impaired Users
 * 
 * Features:
 * - Live region announcements (polite & assertive)
 * - Page navigation announcements
 * - Form status updates
 * - Error notifications
 * - Success confirmations
 * 
 * Compatible with: NVDA, JAWS, VoiceOver, TalkBack
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';

interface AnnouncerContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announcePageChange: (pageName: string) => void;
  announceError: (error: string) => void;
  announceSuccess: (message: string) => void;
  announceLoading: (isLoading: boolean, context?: string) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export const useAnnouncer = () => {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Return a no-op version if not within provider
    return {
      announce: () => {},
      announcePageChange: () => {},
      announceError: () => {},
      announceSuccess: () => {},
      announceLoading: () => {},
    };
  }
  return context;
};

export function ScreenReaderAnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const pathname = usePathname();

  // Announce page changes
  useEffect(() => {
    const pageName = getPageNameFromPath(pathname);
    if (pageName) {
      // Small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setPoliteMessage(`Navigated to ${pageName}. Press Tab to navigate through the page content.`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  const announcePageChange = useCallback((pageName: string) => {
    announce(`Page loaded: ${pageName}. Main content begins below.`, 'polite');
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}. Please correct and try again.`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  const announceLoading = useCallback((isLoading: boolean, context?: string) => {
    if (isLoading) {
      announce(`Loading ${context || 'content'}. Please wait.`, 'polite');
    } else {
      announce(`${context || 'Content'} loaded successfully.`, 'polite');
    }
  }, [announce]);

  return (
    <AnnouncerContext.Provider value={{ announce, announcePageChange, announceError, announceSuccess, announceLoading }}>
      {children}
      
      {/* Screen Reader Live Regions */}
      <div className="sr-only" aria-hidden="false">
        {/* Polite announcements - for non-urgent updates */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-relevant="additions text"
        >
          {politeMessage}
        </div>
        
        {/* Assertive announcements - for urgent updates like errors */}
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          aria-relevant="additions text"
        >
          {assertiveMessage}
        </div>
        
        {/* Progress indicator for loading states */}
        <div
          role="progressbar"
          aria-valuetext="Loading in progress"
          id="global-loading-status"
        />
      </div>
    </AnnouncerContext.Provider>
  );
}

// Helper function to get readable page name from path
function getPageNameFromPath(path: string): string {
  const pathMap: Record<string, string> = {
    '/': 'Home - Emerson EIMS Power Solutions',
    '/about': 'About Us',
    '/about-us': 'About Our Company',
    '/contact': 'Contact Us',
    '/services': 'Our Services',
    '/generators': 'Generator Solutions',
    '/generators/maintenance': 'Generator Maintenance Services',
    '/generators/spare-parts': 'Generator Spare Parts',
    '/generators/rental': 'Generator Rental Services',
    '/generators/installation': 'Generator Installation',
    '/solar': 'Solar Energy Solutions',
    '/solutions': 'Power Solutions',
    '/solutions/ups': 'UPS Systems',
    '/solutions/motors': 'Electric Motors',
    '/solutions/hvac': 'HVAC Systems',
    '/solutions/borehole-pumps': 'Borehole Pumps',
    '/diagnostics': 'Diagnostic Tools',
    '/diagnostic-suite': 'Advanced Diagnostic Suite',
    '/diagnostic-cockpit': 'Generator Diagnostic Cockpit',
    '/blog': 'Blog Articles',
    '/calculators/generator-sizing': 'Generator Sizing Calculator',
    '/calculators/solar-roi': 'Solar ROI Calculator',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
  };

  // Direct match
  if (pathMap[path]) return pathMap[path];

  // Check for county pages
  if (path.startsWith('/counties/')) {
    const county = path.replace('/counties/', '').replace(/-/g, ' ');
    return `Services in ${county.charAt(0).toUpperCase() + county.slice(1)} County, Kenya`;
  }

  // Check for blog posts
  if (path.startsWith('/blog/')) {
    return 'Blog Article';
  }

  // Default
  return path.slice(1).replace(/-/g, ' ').replace(/\//g, ' - ') || 'Home';
}

export default ScreenReaderAnnouncerProvider;
