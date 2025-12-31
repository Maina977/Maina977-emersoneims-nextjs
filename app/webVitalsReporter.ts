'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals Reporter - Performance Monitoring
 * Tracks Core Web Vitals and sends alerts if performance degrades
 * Uses INP (Interaction to Next Paint) - the new standard replacing FID
 */

function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating,
      delta: Math.round(metric.delta),
    });
  }

  // Send to Google Analytics (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Performance alerts for degraded metrics
  if (metric.name === 'LCP' && metric.value > 2500) {
    console.warn('⚠️ LCP is slow:', Math.round(metric.value), 'ms (target: <2500ms)');
  }
  
  if (metric.name === 'INP' && metric.value > 200) {
    console.warn('⚠️ INP is slow:', Math.round(metric.value), 'ms (target: <200ms)');
  }
  
  if (metric.name === 'CLS' && metric.value > 0.1) {
    console.warn('⚠️ CLS is high:', metric.value.toFixed(3), '(target: <0.1)');
  }

  if (metric.name === 'FCP' && metric.value > 1800) {
    console.warn('⚠️ FCP is slow:', Math.round(metric.value), 'ms (target: <1800ms)');
  }

  if (metric.name === 'TTFB' && metric.value > 800) {
    console.warn('⚠️ TTFB is slow:', Math.round(metric.value), 'ms (target: <800ms)');
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics); // New standard: Interaction to Next Paint (replaces FID)
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
