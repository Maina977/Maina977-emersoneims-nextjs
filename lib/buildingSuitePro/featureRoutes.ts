/**
 * Building Suite Pro — Single Source of Truth for Feature Routes
 * ----------------------------------------------------------------
 * The Building Suite Pro UI is a 540 KB static SPA wizard mounted at
 * `/solutions/building` (see `app/solutions/building/page.tsx`). The wizard
 * has internal "modes" (tabs) for each professional feature (QS, Safety,
 * Curation, MEP Clash, High-Rise, Healthcare, Collab, All Tools, etc.).
 *
 * Historically, marketing links and UI cards pointed to bare top-level
 * URLs like `/qs`, `/safety`, `/healthcare`, `/console`, etc. None of
 * those routes existed in the Next.js app router, so they 404'd in
 * production — repeatedly, because every "fix" patched only one or two
 * symptoms and left the rest fragmented.
 *
 * This file is the canonical map. Anywhere the app needs to reason about
 * a Building Suite Pro feature route, import from here. The redirect
 * pages under `app/<slug>/page.tsx` are generated from this list, and the
 * wizard reads `?mode=` on load to auto-open the right tab.
 *
 * To add a new feature: append one entry here. The matching `/slug` page
 * will exist automatically because `app/(building)/(bsp-feature-routes)/`
 * builds them dynamically from this list.
 */

export type BspFeature = {
  /** URL path under the site root (no leading slash). Used as `/qs` etc. */
  readonly slug: string;
  /** Wizard mode token passed to the wizard's internal `setMode(m)`. */
  readonly mode: string;
  /** Human-readable label (used by metadata + the redirect interstitial). */
  readonly label: string;
  /** Optional aliases that should also redirect here (canonicalises `/all-tools` → `/alltools`). */
  readonly aliases?: readonly string[];
};

export const BSP_HUB_PATH = '/solutions/building';

/** The console SPA path served from `public/eims-pro-console.html`. */
export const BSP_CONSOLE_PATH = '/console';
export const BSP_CONSOLE_TARGET = '/eims-pro-console.html';

export const BSP_FEATURES: readonly BspFeature[] = [
  { slug: 'qs',          mode: 'qsPro',         label: 'QS+ — Quantity Surveying', aliases: ['quantity-surveying', 'boq'] },
  { slug: 'safety',      mode: 'safety',        label: 'Safety — Risk Register & Method Statements' },
  { slug: 'curation',    mode: 'curation',      label: 'Curation — Materials & Finishes' },
  { slug: 'interior',    mode: 'interior',      label: 'Interior Design' },
  { slug: 'mep-clash',   mode: 'mepClash',      label: 'MEP Clash Detection', aliases: ['mep', 'clash'] },
  { slug: 'high-rise',   mode: 'highrise',      label: 'High-Rise Dynamics', aliases: ['highrise'] },
  { slug: 'healthcare',  mode: 'healthcare',    label: 'Healthcare Compliance' },
  { slug: 'collab',      mode: 'collab',        label: 'Real-Time Collaboration', aliases: ['collaboration'] },
  { slug: 'alltools',    mode: 'proConsole',    label: 'All Tools — Professional Console', aliases: ['all-tools', 'pro-console', 'proconsole'] },
  { slug: 'engineering-pro', mode: 'engineeringPro', label: 'Engineering+ — Structural & Loads', aliases: ['engineering', 'structural'] },
  { slug: 'reports',     mode: 'reports',       label: 'Comprehensive Reports' },
] as const;

/** All slugs (canonical + aliases) that must resolve to the BSP hub. */
export function getAllBspSlugs(): string[] {
  const all = new Set<string>();
  for (const f of BSP_FEATURES) {
    all.add(f.slug);
    for (const a of f.aliases ?? []) all.add(a);
  }
  return [...all];
}

/** Resolve a slug (canonical or alias) to its feature record, or undefined. */
export function findBspFeature(slug: string): BspFeature | undefined {
  const s = slug.toLowerCase();
  return BSP_FEATURES.find((f) => f.slug === s || f.aliases?.includes(s));
}

/** Build the destination URL the user should land on for a feature slug. */
export function bspFeatureHref(slug: string): string {
  const feature = findBspFeature(slug);
  if (!feature) return BSP_HUB_PATH;
  return `${BSP_HUB_PATH}?mode=${encodeURIComponent(feature.mode)}#${encodeURIComponent(feature.mode)}`;
}
