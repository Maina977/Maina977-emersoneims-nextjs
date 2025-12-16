'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  loadTime: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const startTime = performance.now();

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
        const memory = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : undefined;

        setMetrics({ fps, memory, loadTime });
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();

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

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-4 z-[9999] font-mono text-xs">
      <div className="text-cyan-400 mb-2 font-bold">Performance Monitor</div>
      <div className="space-y-1 text-white">
        <div>FPS: <span className={metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>{metrics.fps}</span></div>
        {metrics.memory && <div>Memory: {metrics.memory} MB</div>}
        <div>Load: {Math.round(metrics.loadTime)}ms</div>
      </div>
    </div>
  );
}









