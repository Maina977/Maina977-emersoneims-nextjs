import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { bspFeatureHref, findBspFeature } from '@/lib/buildingSuitePro/featureRoutes';

/**
 * Shared metadata + redirect for every Building Suite Pro feature slug
 * (`/qs`, `/safety`, `/healthcare`, `/mep-clash`, `/high-rise`, etc.).
 *
 * These slugs are NOT independent pages — they are deep links into the
 * single Building Suite Pro wizard at `/solutions/building`. Centralising
 * the redirect logic here means a new feature only requires:
 *   1. One entry in `lib/buildingSuitePro/featureRoutes.ts`.
 *   2. One four-line `app/<slug>/page.tsx` calling `bspFeatureMetadata(slug)`
 *      and `bspFeatureRedirect(slug)`.
 *
 * If the slug is unknown (data drift), we fall back to the BSP hub rather
 * than serving a 404 — that was the recurring failure mode this rewrite
 * is designed to eliminate.
 */
export function bspFeatureMetadata(slug: string): Metadata {
  const feature = findBspFeature(slug);
  const label = feature?.label ?? 'Building Suite Pro';
  return {
    title: `${label} · Building Suite Pro`,
    description: `${label} — open inside the EmersonEIMS Building Suite Pro wizard. AI construction & engineering platform across 28 countries.`,
    robots: { index: false, follow: true },
    alternates: { canonical: '/solutions/building' },
  };
}

export function bspFeatureRedirect(slug: string): never {
  redirect(bspFeatureHref(slug));
}
