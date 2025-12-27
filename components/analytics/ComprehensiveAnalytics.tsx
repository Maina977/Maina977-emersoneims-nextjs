'use client';

/**
 * COMPREHENSIVE ANALYTICS SYSTEM
 * Premium visitor tracking, engagement, and conversion analytics
 * Better than Rybbit AppSumo - All-in-one solution
 */

import { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface VisitorData {
  id: string;
  sessionId: string;
  timestamp: number;
  page: string;
  referrer: string;
  userAgent: string;
  ip?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
  behavior: {
    timeOnPage: number;
    scrollDepth: number;
    clicks: number;
    formInteractions: number;
    exitIntent: boolean;
  };
  engagement: {
    score: number;
    isHotLead: boolean;
    interests: string[];
  };
  conversion: {
    stage: 'visitor' | 'engaged' | 'lead' | 'client';
    probability: number;
  };
}

interface PageAnalytics {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  performance: {
    lcp: number;
    fid: number;
    cls: number;
    inp: number;
  };
}

function ComprehensiveAnalyticsContent() {
  const pathname = usePathname();
  // Note: useSearchParams is not critical for analytics, so we'll make it optional
  // This prevents build errors during static generation
  const searchParams = useSearchParams();
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const sessionStartTime = useRef<number>(0);
  const scrollDepth = useRef<number>(0);
  const clickCount = useRef<number>(0);
  const formInteractions = useRef<number>(0);
  const exitIntentDetected = useRef<boolean>(false);

  // Initialize visitor tracking - only on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsClientReady(true);
    sessionStartTime.current = Date.now();

    const initializeVisitor = async () => {
      // Generate or retrieve visitor ID - client side only
      let visitorId: string | null = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitor_id', visitorId);
      }

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);

      // Detect device type
      const userAgent = navigator.userAgent;
      const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent)
        ? 'mobile'
        : /Tablet|iPad/.test(userAgent)
        ? 'tablet'
        : 'desktop';

      // Get location data (using IP geolocation API)
      let locationData: { country?: string; city?: string; timezone?: string } = {};
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        locationData = {
          country: ipData.country_name,
          city: ipData.city,
          timezone: ipData.timezone,
        };
      } catch (error) {
        // Fallback: use browser timezone
        locationData = {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      const visitor: VisitorData = {
        id: visitorId || 'unknown',
        sessionId,
        timestamp: Date.now(),
        page: pathname,
        referrer: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'direct',
        userAgent,
        location: locationData,
        device: {
          type: deviceType,
          os: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
          browser: getBrowserName(userAgent),
        },
        behavior: {
          timeOnPage: 0,
          scrollDepth: 0,
          clicks: 0,
          formInteractions: 0,
          exitIntent: false,
        },
        engagement: {
          score: 0,
          isHotLead: false,
          interests: [],
        },
        conversion: {
          stage: 'visitor',
          probability: 0,
        },
      };

      setVisitorData(visitor);
      
      // Send initial visitor data to analytics API
      trackVisitor(visitor, 'page_view');
    };

    initializeVisitor();
  }, []);

  // Track page views
  useEffect(() => {
    if (!visitorData || typeof window === 'undefined') return;

    const pageData = {
      ...visitorData,
      page: pathname,
      timestamp: Date.now(),
      queryParams: searchParams ? Object.fromEntries(searchParams.entries()) : {},
    };

    trackVisitor(pageData, 'page_view');
    
    // Reset session metrics for new page
    scrollDepth.current = 0;
    sessionStartTime.current = Date.now();
  }, [pathname, searchParams, visitorData]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      if (scrollPercentage > scrollDepth.current) {
        scrollDepth.current = scrollPercentage;
        
        if (visitorData) {
          trackEvent('scroll', {
            depth: scrollPercentage,
            page: pathname,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, visitorData]);

  // Track clicks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClick = (e: MouseEvent) => {
      clickCount.current += 1;
      
      const target = e.target as HTMLElement;
      const elementData = {
        tag: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent?.substring(0, 50),
        href: (target as HTMLAnchorElement).href,
      };

      trackEvent('click', {
        element: elementData,
        page: pathname,
        clickCount: clickCount.current,
      });

      // Detect CTA clicks (potential conversion)
      if (target.closest('button, a[href*="contact"], a[href*="quote"], a[href*="call"]')) {
        trackConversion('cta_click', {
          element: elementData,
          page: pathname,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // Track form interactions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFormInteraction = (e: Event) => {
      formInteractions.current += 1;
      const target = e.target as HTMLInputElement;
      
      trackEvent('form_interaction', {
        type: e.type,
        field: target.name || target.id,
        page: pathname,
      });

      // Track form submissions
      if (e.type === 'submit') {
        trackConversion('form_submit', {
          formId: (target.closest('form') as HTMLFormElement)?.id,
          page: pathname,
        });
      }
    };

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('focus', handleFormInteraction, true);
      form.addEventListener('input', handleFormInteraction, true);
      form.addEventListener('submit', handleFormInteraction);
    });

    return () => {
      forms.forEach(form => {
        form.removeEventListener('focus', handleFormInteraction, true);
        form.removeEventListener('input', handleFormInteraction, true);
        form.removeEventListener('submit', handleFormInteraction);
      });
    };
  }, [pathname]);

  // Track exit intent
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentDetected.current) {
        exitIntentDetected.current = true;
        
        trackEvent('exit_intent', {
          page: pathname,
          timeOnPage: Date.now() - sessionStartTime.current,
        });

        // Trigger exit intent popup or offer
        if (visitorData && visitorData.behavior.timeOnPage > 30) {
          triggerExitIntentOffer();
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [pathname, visitorData]);

  // Track time on page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      if (visitorData) {
        const timeOnPage = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        
        setVisitorData(prev => prev ? {
          ...prev,
          behavior: {
            ...prev.behavior,
            timeOnPage,
            scrollDepth: scrollDepth.current,
            clicks: clickCount.current,
            formInteractions: formInteractions.current,
            exitIntent: exitIntentDetected.current,
          },
        } : null);

        // Calculate engagement score
        const engagementScore = calculateEngagementScore({
          timeOnPage,
          scrollDepth: scrollDepth.current,
          clicks: clickCount.current,
          formInteractions: formInteractions.current,
        });

        // Update engagement and conversion probability
        if (visitorData) {
          const isHotLead = engagementScore > 70;
          const conversionProbability = calculateConversionProbability(engagementScore, visitorData);
          
          setVisitorData(prev => prev ? {
            ...prev,
            engagement: {
              score: engagementScore,
              isHotLead,
              interests: extractInterests(pathname, clickCount.current),
            },
            conversion: {
              stage: determineConversionStage(engagementScore, formInteractions.current),
              probability: conversionProbability,
            },
          } : null);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [pathname, visitorData]);

  // Track Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function sendToAnalytics(metric: Metric) {
      trackEvent('web_vital', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }

    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Replaces FID in web-vitals v4
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  // Send visitor data to API
  const trackVisitor = async (data: Partial<VisitorData>, event: string) => {
    try {
      await fetch('/api/analytics/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          data,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  // Track events
  const trackEvent = async (eventName: string, data: Record<string, any>) => {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          data,
          visitorId: visitorData?.id,
          sessionId: visitorData?.sessionId,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  };

  // Track conversions
  const trackConversion = async (conversionType: string, data: Record<string, any>) => {
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: conversionType,
          data,
          visitorId: visitorData?.id,
          sessionId: visitorData?.sessionId,
          timestamp: Date.now(),
        }),
      });

      // Send notification
      await fetch('/api/notifications/new-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: visitorData?.id,
          conversionType,
          data,
        }),
      });
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
    }
  };

  // Helper functions
  function getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  function calculateEngagementScore(metrics: {
    timeOnPage: number;
    scrollDepth: number;
    clicks: number;
    formInteractions: number;
  }): number {
    let score = 0;
    
    // Time on page (max 30 points)
    score += Math.min(metrics.timeOnPage / 2, 30);
    
    // Scroll depth (max 25 points)
    score += (metrics.scrollDepth / 100) * 25;
    
    // Clicks (max 25 points)
    score += Math.min(metrics.clicks * 5, 25);
    
    // Form interactions (max 20 points)
    score += Math.min(metrics.formInteractions * 10, 20);
    
    return Math.min(Math.round(score), 100);
  }

  function calculateConversionProbability(engagementScore: number, visitor: VisitorData): number {
    let probability = engagementScore;
    
    // Boost for form interactions
    if (visitor.behavior.formInteractions > 0) {
      probability += 20;
    }
    
    // Boost for multiple pages visited
    const pagesVisited = typeof window !== 'undefined' 
      ? parseInt(sessionStorage.getItem('pages_visited') || '1')
      : 1;
    if (pagesVisited > 3) {
      probability += 15;
    }
    
    // Boost for CTA clicks
    if (visitor.behavior.clicks > 5) {
      probability += 10;
    }
    
    return Math.min(Math.round(probability), 100);
  }

  function determineConversionStage(
    engagementScore: number,
    formInteractions: number
  ): 'visitor' | 'engaged' | 'lead' | 'client' {
    if (formInteractions > 0) return 'lead';
    if (engagementScore > 70) return 'engaged';
    if (engagementScore > 30) return 'engaged';
    return 'visitor';
  }

  function extractInterests(page: string, clicks: number): string[] {
    const interests: string[] = [];
    
    if (page.includes('solar')) interests.push('solar');
    if (page.includes('generator')) interests.push('generators');
    if (page.includes('diagnostic')) interests.push('diagnostics');
    if (page.includes('service')) interests.push('services');
    if (page.includes('contact')) interests.push('contact');
    
    return interests;
  }

  function triggerExitIntentOffer() {
    // This will be handled by the AI Engagement component
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('exit-intent-detected', {
        detail: { visitorData }
      }));
    }
  }

  return null; // This component doesn't render anything
}

// Client-only wrapper to prevent SSR issues
function ComprehensiveAnalyticsClient() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <ComprehensiveAnalyticsContent />;
}

export default function ComprehensiveAnalytics() {
  return (
    <Suspense fallback={null}>
      <ComprehensiveAnalyticsClient />
    </Suspense>
  );
}
