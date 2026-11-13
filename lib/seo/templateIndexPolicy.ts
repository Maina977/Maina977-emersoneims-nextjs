import type { Metadata } from 'next';
import protectedList from './templateIndexProtected.json';
import keepList from './locationKeepIndexed.json';

/**
 * TEMPLATE PAGE INDEX POLICY (Release 1 proposal).
 *
 * Six route families generate a page for every place, from one template:
 *   /kenya/<county>/<service>, /kenya/<county>/<town>/<service>,
 *   /locations/<town>, /locations/<town>/<service>,
 *   /brands/<brand>/kenya/<county>, /sectors/<sector>/kenya/<county>,
 *   /<country>/<city>.
 * Sibling pages are 84-97% the same text with the place name changed.
 * Google's spam policies ask that such content be excluded from Search, and
 * Google was observed NOT honouring the parent canonical these pages already
 * carry (69 sector x county pages re-crawled after the 2 Oct canonical were
 * still indexed under their own address).
 *
 * So every page from those routes is excluded from Search with ONE clear
 * signal: its own URL as canonical (and og:url), and robots "noindex, follow".
 * The page stays online, keeps its content and links, and visitors see no
 * change. Only the county hubs (/kenya/<county>, a different route) and the
 * pages in templateIndexProtected.json keep their current metadata.
 *
 * templateIndexProtected.json = every template URL with a click in any Search
 * Console export on file, 20+ impressions after 21 Aug, a sitemap entry, or a
 * place on the 5 Nov keep-list. Regenerate it from new evidence; never edit
 * it by hand to make a page rank.
 *
 * This removes duplicated pages from Google's index. It is not expected to
 * restore rankings by itself; Google re-assesses a site over months.
 */
const PROTECTED = new Set<string>(protectedList as string[]);
const SITE = 'https://www.emersoneims.com';

function normalise(path: string): string {
  return path.replace(/\/$/, '') || '/';
}

/** County hubs are never template-excluded. */
function isCountyHub(path: string): boolean {
  return /^\/kenya\/[^/]+$/.test(path);
}

export function isProtectedTemplatePage(path: string): boolean {
  return PROTECTED.has(normalise(path));
}

/**
 * RELEASE 1-N (narrower fallback): core-service template pages are HELD, i.e.
 * left exactly as in production, until enquiry-source data shows whether any
 * of them produce leads. Core = generator, solar, power and related services,
 * plus every brand x county page (generator brands). Only non-core template
 * pages are excluded in this release.
 */
const CORE_SERVICE = /generator|genset|solar|ats|transfer|cummins|ups|inverter|synchron|motor|power|diesel|electrical|switchgear|panel/;

export function isHeldCoreTemplatePage(path: string): boolean {
  const p = normalise(path);
  return /^\/brands\/[^/]+\/kenya\/[^/]+$/.test(p) || CORE_SERVICE.test(p);
}

/**
 * "Held" means EXACTLY what production does today, not the route's raw
 * metadata. On the two routes that already ran the 5 Nov stage-1 rule
 * (/kenya/<county>/... and /locations/<town>/<service>) that rule is
 * reproduced here unchanged: keep-list pages and cross-canonical pages are
 * left alone, every other page is noindex, follow. Other routes had no rule,
 * so their metadata is returned as it is.
 */
const KEEP = new Set<string>(keepList as string[]);
function productionStage1(p: string, meta: Metadata): Metadata {
  const stage1Route = /^\/kenya\/[^/]+\/.+/.test(p) || /^\/locations\/[^/]+\/[^/]+$/.test(p);
  if (!stage1Route || KEEP.has(p)) return meta;
  const canonical = meta.alternates?.canonical;
  const canonicalPath = typeof canonical === 'string' ? canonical.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') : null;
  if (canonicalPath && canonicalPath !== p) return meta;
  return { ...meta, robots: { index: false, follow: true } };
}

/** True when the page already says "do not index, do not follow" (the not-found branches). */
function alreadyClosed(meta: Metadata): boolean {
  const r = meta.robots;
  return !!r && typeof r === 'object' && r.index === false && r.follow === false;
}

/**
 * Apply the policy to a page from a template route. Callers are the template
 * routes themselves, so the route decides that a page is a template page.
 */
export function applyTemplateIndexPolicy(path: string, meta: Metadata): Metadata {
  const p = normalise(path);
  if (isCountyHub(p) || isProtectedTemplatePage(p) || alreadyClosed(meta)) return meta;
  if (isHeldCoreTemplatePage(p)) return productionStage1(p, meta);
  const self = SITE + p;
  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: self },
    ...(meta.openGraph ? { openGraph: { ...meta.openGraph, url: self } } : {}),
    // Replaced outright, so no googleBot "index" rule survives beside the noindex.
    robots: { index: false, follow: true },
  };
}
