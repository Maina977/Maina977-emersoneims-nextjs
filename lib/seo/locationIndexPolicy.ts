import type { Metadata } from 'next';
import keepList from './locationKeepIndexed.json';
import { applyTemplateIndexPolicy } from './templateIndexPolicy';

/**
 * LOCATION PAGE INDEX POLICY.
 *
 * Stage 1 (2026-11-05) kept the pages that had earned search traffic
 * (locationKeepIndexed.json) and gave the rest "noindex, follow", but left any
 * page with a cross-page canonical alone. That produced 1,830 pages whose
 * canonical named a page that was itself noindex: "I am a copy of B" together
 * with "B must not be indexed". Google's own URL Inspection confirmed the pair
 * /kenya/baringo/ac-repair -> /kenya/baringo/ac-installation on 13 Nov.
 *
 * Release 1 replaces that with the single template policy in
 * templateIndexPolicy.ts: every page from these routes is either protected
 * (unchanged) or self-canonical + noindex, follow. The keep-list is part of
 * the protected list, so every page Stage 1 kept indexed stays as it is.
 */
const KEEP = new Set<string>(keepList as string[]);

export function isLocationPageKeptIndexed(path: string): boolean {
  return KEEP.has(path.replace(/\/$/, ''));
}

export function withLocationIndexPolicy(path: string, meta: Metadata): Metadata {
  return applyTemplateIndexPolicy(path, meta);
}
