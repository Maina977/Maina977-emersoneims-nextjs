/**
 * Collects the SEO-identity fields (URL, <title>, OG/Twitter titles, canonical,
 * robots) of every route touched by the content-safety withdrawal of
 * 2026-11-25. Used twice: once before the withdrawal to write the snapshot in
 * tests/fixtures/content-safety-withdrawal-2026-11-25.routes.json, and by the
 * regression test to prove none of those fields changed.
 *
 * Descriptions are collected too (for the SEO compare report) but are NOT part
 * of the identity comparison: the withdrawal is allowed to change them.
 */
import type { Metadata } from 'next';

export interface RouteIdentity {
  title: unknown;
  ogTitle: unknown;
  twitterTitle: unknown;
  canonical: unknown;
  robots: unknown;
}

export interface RouteMeta extends RouteIdentity {
  description: unknown;
  ogDescription: unknown;
}

function pick(m: Metadata): RouteMeta {
  const og = (m.openGraph ?? {}) as Record<string, unknown>;
  const tw = (m.twitter ?? {}) as Record<string, unknown>;
  const alt = (m.alternates ?? {}) as Record<string, unknown>;
  return {
    title: m.title ?? null,
    ogTitle: og.title ?? null,
    twitterTitle: tw.title ?? null,
    canonical: alt.canonical ?? null,
    robots: m.robots ?? null,
    description: m.description ?? null,
    ogDescription: og.description ?? null,
  };
}

export function identityOf(m: RouteMeta): RouteIdentity {
  return {
    title: m.title,
    ogTitle: m.ogTitle,
    twitterTitle: m.twitterTitle,
    canonical: m.canonical,
    robots: m.robots,
  };
}

export const REPAIR_SLUGS = [
  'generator-low-oil-pressure-shutdown',
  'generator-overheating',
  'diesel-engine-abnormal-noise',
  'generator-starts-then-stops',
  'controller-alarm-interpretation',
  'j1939-spn-fmi-explained',
] as const;

export const BLOG_SLUGS = [
  'generator-maintenance-tips-kenya',
  'generator-buying-guide-kenya',
  'generator-safety-tips-kenya',
  'generator-fire-safety-prevention',
  'diy-generator-maintenance-home',
] as const;

/**
 * distribution-boards and solar-energy render the gen-grounding / ats-wiring
 * BibleDiagrams whose numeric captions were withdrawn. They (and
 * /solutions/controls, /diagnostics) were added to the snapshot after the
 * first capture; their metadata sources were verified byte-identical to
 * 4c2a6ee5 (git diff --quiet) when added.
 */
export const SERVICE_SLUGS = [
  'cummins-generators',
  'generator-repairs',
  'ats-changeover',
  'distribution-boards',
  'solar-energy',
] as const;

export async function collectRouteMeta(): Promise<Record<string, RouteMeta>> {
  const out: Record<string, RouteMeta> = {};

  const { FAULT_CODES } = await import('@/lib/data/faultCodes');
  const faultPage = await import('@/app/faults/[code]/page');
  for (const f of FAULT_CODES) {
    const code = f.code.toLowerCase();
    out[`/faults/${code}`] = pick(await faultPage.generateMetadata({ params: Promise.resolve({ code }) }));
  }

  const { getRepairArticle } = await import('@/lib/repair-centre');
  const rcPage = await import('@/app/repair-centre/[hub]/[slug]/page');
  for (const slug of REPAIR_SLUGS) {
    const a = getRepairArticle(slug)!;
    out[`/repair-centre/${a.hub}/${slug}`] = pick(
      await rcPage.generateMetadata({ params: Promise.resolve({ hub: a.hub, slug }) }),
    );
  }

  const blogPage = await import('@/app/blog/[slug]/page');
  for (const slug of BLOG_SLUGS) {
    out[`/blog/${slug}`] = pick(await blogPage.generateMetadata({ params: Promise.resolve({ slug }) }));
  }
  out['/blog/generator-wont-start-5-fixes'] = pick(
    (await import('@/app/blog/generator-wont-start-5-fixes/page')).metadata,
  );

  const svcPage = await import('@/app/services/[service]/page');
  for (const service of SERVICE_SLUGS) {
    out[`/services/${service}`] = pick(await svcPage.generateMetadata({ params: Promise.resolve({ service }) }));
  }

  out['/troubleshooting'] = pick((await import('@/app/troubleshooting/layout')).metadata);
  out['/solutions/generators'] = pick((await import('@/app/solutions/generators/layout')).metadata);
  out['/technical-bible'] = pick((await import('@/app/technical-bible/layout')).metadata);
  out['/knowledge-base'] = pick((await import('@/app/knowledge-base/layout')).metadata);
  out['/generators/maintenance'] = pick((await import('@/app/generators/maintenance/layout')).metadata);
  out['/generators/workshop-services'] = pick((await import('@/app/generators/workshop-services/page')).metadata);
  out['/plant-equipment-oracle'] = pick((await import('@/app/plant-equipment-oracle/layout')).metadata);
  out['/solutions/controls'] = pick((await import('@/app/solutions/controls/layout')).metadata);
  out['/diagnostics'] = pick((await import('@/app/diagnostics/layout')).metadata);
  out['/faults'] = pick((await import('@/app/faults/layout')).metadata);
  // Added in the second follow-up; `git diff 4c2a6ee5` of its layout touches
  // only description lines, so its identity fields are the pre-change ones.
  out['/generator-oracle'] = pick((await import('@/app/generator-oracle/layout')).metadata);

  return out;
}
