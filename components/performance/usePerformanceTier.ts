'use client';

import { useEffect, useMemo, useState } from 'react';

export type PerformanceTier = 'full' | 'lite';

export function usePerformanceTier(): {
  tier: PerformanceTier;
  isLite: boolean;
  isFull: boolean;
} {
  const [tier, setTier] = useState<PerformanceTier>('full');

  useEffect(() => {
    // Default to full on desktop, auto-lite on constrained devices.
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      const nav = navigator as unknown as {
        deviceMemory?: number;
        connection?: { effectiveType?: string; saveData?: boolean };
      };

      const deviceMemory = nav.deviceMemory;
      const cores = navigator.hardwareConcurrency;
      const connection = nav.connection;

      const slowConnection =
        connection?.saveData === true ||
        connection?.effectiveType === '2g' ||
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '3g';

      const lowEnd = (typeof deviceMemory === 'number' && deviceMemory < 4) || (cores && cores <= 2);

      if (prefersReducedMotion || isSmallScreen || slowConnection || lowEnd) {
        setTier('lite');
      } else {
        setTier('full');
      }
    } catch {
      // If anything fails, stay on full.
      setTier('full');
    }
  }, []);

  const flags = useMemo(() => {
    return {
      tier,
      isLite: tier === 'lite',
      isFull: tier === 'full',
    };
  }, [tier]);

  return flags;
}
