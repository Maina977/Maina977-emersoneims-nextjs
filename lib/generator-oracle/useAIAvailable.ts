'use client';

import { useEffect, useState } from 'react';
import { isAIDisabledPublic } from '@/lib/generator-oracle/aiFlags';

/**
 * Runtime check for whether the server has ANTHROPIC_API_KEY configured.
 *
 * The Generator Oracle AI surfaces (Expert Chat / Visual Diagnose / AI
 * Analysis) all proxy through `/api/generator-oracle/expert-chat` or
 * `/api/generator-oracle/ai-visual-diagnose`, both of which expose a GET
 * health-check. We hit the cheaper one (expert-chat) once on mount and cache
 * the result for the lifetime of the page.
 *
 * Returns 'loading' until the check resolves, then 'available' or
 * 'unavailable'. Network failures are treated as 'unavailable' — same as a
 * missing key — because either way the AI features cannot be used.
 *
 * Kill-switch: when `NEXT_PUBLIC_GENERATOR_ORACLE_AI_DISABLED` is truthy the
 * hook returns 'unavailable' synchronously without any network probe. This
 * guarantees the AI panels never flash an "active" UI during rollout.
 */
export type AIAvailability = 'loading' | 'available' | 'unavailable';

let cached: AIAvailability | null = isAIDisabledPublic() ? 'unavailable' : null;
let inflight: Promise<AIAvailability> | null = null;

async function probe(): Promise<AIAvailability> {
  if (isAIDisabledPublic()) {
    cached = 'unavailable';
    return cached;
  }
  if (cached && cached !== 'loading') return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch('/api/generator-oracle/expert-chat', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) {
        cached = 'unavailable';
        return cached;
      }
      const data = (await res.json()) as { aiConfigured?: boolean };
      cached = data?.aiConfigured ? 'available' : 'unavailable';
      return cached;
    } catch {
      cached = 'unavailable';
      return cached;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useAIAvailable(): AIAvailability {
  const [state, setState] = useState<AIAvailability>(cached ?? 'loading');
  useEffect(() => {
    if (isAIDisabledPublic()) {
      setState('unavailable');
      return;
    }
    let alive = true;
    probe().then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
