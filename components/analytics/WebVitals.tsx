'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface WebVitalsProps {
  analyticsId?: string;
}

export default function WebVitals({ analyticsId }: WebVitalsProps) {
  useEffect(() => {
    function sendToAnalytics(metric: Metric) {
      // Send to your analytics service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(metric);
      }

      // Send to custom endpoint if needed
      if (analyticsId) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: analyticsId,
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
          }),
        }).catch(() => {
          // Silently fail if analytics endpoint is unavailable
        });
      }
    }

    // Measure all Core Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Replaces FID in web-vitals v4
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, [analyticsId]);

  return null;
}








