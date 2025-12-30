'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  loadTime: number;
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    loadTime: 0,
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startTime = performance.now();

    type PerformanceWithMemory = Performance & {
      memory?: {
        usedJSHeapSize: number;
      };
    };

    // FPS monitoring
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = currentTime;

        const loadTime = performance.now() - startTime;
        const perf = performance as PerformanceWithMemory;
        const usedHeap = perf.memory?.usedJSHeapSize;
        const memory = typeof usedHeap === 'number'
          ? Math.round(usedHeap / 1048576)
          : undefined;

        setMetrics(prev => ({
          ...prev,
          fps,
          memory,
          loadTime,
        }));
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const timingEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({
            ...prev,
            fid: timingEntry.processingStart - timingEntry.startTime
          }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const shiftEntry = entry as LayoutShift;
          if (!shiftEntry.hadRecentInput) clsValue += shiftEntry.value;
        });
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Time to First Byte from navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.requestStart,
      }));
    }

    // Toggle with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) return null;

  const getScoreColor = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'text-gray-400';
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-4 z-[9999] font-mono text-xs max-w-xs">
      <div className="text-cyan-400 mb-2 font-bold">🚀 Performance Monitor</div>
      <div className="space-y-1 text-white">
        <div>FPS: <span className={metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>{metrics.fps}</span></div>
        {metrics.memory && <div>Memory: {metrics.memory} MB</div>}
        <div>Load: {Math.round(metrics.loadTime)}ms</div>

        <div className="border-t border-gray-600 my-2 pt-2">
          <div className="text-cyan-300 mb-1 font-semibold">Core Web Vitals</div>
          {metrics.fcp && (
            <div>FCP: <span className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>{Math.round(metrics.fcp)}ms</span></div>
          )}
          {metrics.lcp && (
            <div>LCP: <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>{Math.round(metrics.lcp)}ms</span></div>
          )}
          {metrics.fid && (
            <div>FID: <span className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>{Math.round(metrics.fid)}ms</span></div>
          )}
          {metrics.cls !== null && (
            <div>CLS: <span className={getScoreColor(metrics.cls, { good: 0.1, poor: 0.25 })}>{metrics.cls.toFixed(3)}</span></div>
          )}
          {metrics.ttfb && (
            <div>TTFB: <span className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}>{Math.round(metrics.ttfb)}ms</span></div>
          )}
        </div>
      </div>
    </div>
  );
}











