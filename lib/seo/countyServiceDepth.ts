/**
 * Per-service technical depth for /kenya/<county>/<service> pages.
 *
 * THE PROBLEM THIS SOLVES, measured on the built site 2026-09-03 with 8-word
 * shingles:
 *
 *   two DIFFERENT services in the same county   66-70% identical
 *   the SAME service in two different counties  38.7% identical
 *
 * The pages differentiate well across counties — CountySiteConditions carries
 * real altitude and climate data — and badly across services. Roughly 500 of
 * each page's 1,750 words were its own; the rest is nav, county intro, proof
 * block, FAQ scaffolding and CTA. "AC repair in Nairobi" and "generator repair
 * in Nairobi" answer completely different searches with nearly the same text.
 *
 * WHY A SLICE AND NOT THE WHOLE BIBLE. lib/services/serviceBibles.ts already
 * holds deep, genuinely technical content per family. Rendering a whole bible
 * here would fix nothing and break something: every ac-* page in a county would
 * still be identical to every other ac-* page, and every ac-repair page across
 * 47 counties would become identical to the other 46 — which is precisely the
 * near-duplication that got the constituency tier withdrawn from the sitemap on
 * 2026-08-15. So each service renders a DIFFERENT, COMPACT slice chosen by what
 * the page is actually about: repair pages get repair procedures, installation
 * pages get commissioning phases, maintenance pages get service intervals.
 *
 * Nothing here is written fresh. It selects from content that already ships on
 * /services/* and has already passed the claims guard, so no new promise about
 * price, warranty or capability enters the site through this file.
 */
import { SERVICE_BIBLES, type ServiceBible } from '@/lib/services/serviceBibles';
import type { SEOService } from '@/lib/data/seo-services';

/** SEO_SERVICES.category -> the bible that covers that trade. */
const CATEGORY_TO_BIBLE: Record<string, string> = {
  generators: 'cummins-generators',
  solar: 'solar-energy',
  motors: 'motor-rewinding',
  ups: 'ups-systems',
  electrical: 'distribution-boards',
  ac: 'ac-installation',
  borehole: 'borehole-pumps',
  automation: 'distribution-boards',
  incinerators: 'hospital-incinerators',
};

/**
 * What the page is FOR. Order matters — the first match wins, so the more
 * specific suffixes are tested before the general ones.
 */
export type ServiceIntent = 'repair' | 'install' | 'maintain' | 'parts' | 'supply';

function intentOf(slug: string): ServiceIntent {
  if (/(-repairs?|overhaul|gas-refill|water-pump-repair)$/.test(slug)) return 'repair';
  if (/(-installation|drilling|-changeover|plc-programming|control-panels|automatic-transfer-switch)$/.test(slug)) return 'install';
  if (/-maintenance$/.test(slug)) return 'maintain';
  if (/(-spares|-spare-parts|-panels|-batteries|-inverters|-canopies)$/.test(slug)) return 'parts';
  return 'supply';
}

export interface DepthSection {
  /** Heading for the block. Names the service, never the family. */
  heading: string;
  /** One-line framing sentence. */
  lede: string;
  /** Rendered as a definition list: term + supporting lines. */
  entries: { term: string; lines: string[]; tag?: string }[];
  /** Standards or sources the content rests on. */
  references: string[];
}

/**
 * Build the block. Returns null when the trade has no bible — better to render
 * nothing than to render a generic filler section, which would add shared text
 * to pages whose problem is shared text.
 */
export function getCountyServiceDepth(
  service: SEOService,
  countyName: string,
): DepthSection | null {
  const bibleKey = CATEGORY_TO_BIBLE[service.category];
  const bible: ServiceBible | undefined = bibleKey ? SERVICE_BIBLES[bibleKey] : undefined;
  if (!bible) return null;

  const intent = intentOf(service.slug);
  const name = service.name;

  switch (intent) {
    case 'repair': {
      const entries = bible.repairManual.slice(0, 4).map((r) => ({
        term: r.fault,
        lines: r.steps.slice(0, 3),
        tag: r.priority,
      }));
      if (!entries.length) return null;
      return {
        heading: `${name} in ${countyName}: the faults we are called out for`,
        lede: `The diagnostic order our engineers work through on site. Each of these is a distinct failure with a distinct first check — guessing between them is what turns a two-hour visit into a two-day one.`,
        entries,
        references: bible.references.slice(0, 3),
      };
    }

    case 'install': {
      const entries = bible.installPhases.slice(0, 4).map((p) => ({
        term: p.phase,
        lines: [p.goal, ...p.checklist.slice(0, 2)],
      }));
      if (!entries.length) return null;
      return {
        heading: `${name} in ${countyName}: how the job is sequenced`,
        lede: `Commissioning in the order that prevents rework. Most of the failures we are called back to fix are decisions made — or skipped — in these first phases.`,
        entries,
        references: bible.references.slice(0, 3),
      };
    }

    case 'maintain': {
      const entries = bible.partsManual.slice(0, 4).map((g) => ({
        term: g.group,
        lines: g.items.slice(0, 3).map((i) => (i.interval ? `${i.name} — ${i.interval}` : i.name)),
      }));
      if (!entries.length) return null;
      return {
        heading: `${name} in ${countyName}: the intervals we work to`,
        lede: `What gets checked and when. Intervals are the manufacturer's baseline; dust, load and duty on your site shorten them rather than lengthen them.`,
        entries,
        references: bible.references.slice(0, 3),
      };
    }

    case 'parts': {
      const entries = bible.partsManual.slice(0, 3).map((g) => ({
        term: g.group,
        lines: g.items.slice(0, 3).map((i) => (i.note ? `${i.name} — ${i.note}` : i.name)),
      }));
      if (!entries.length) return null;
      return {
        heading: `${name} in ${countyName}: what we hold and what it fits`,
        lede: `Specifying by part number rather than description is the difference between a part that fits and a part that nearly fits.`,
        entries,
        references: bible.references.slice(0, 3),
      };
    }

    case 'supply':
    default: {
      const entries = bible.topBrands.slice(0, 4).map((b) => ({
        term: b.name,
        lines: [b.capability, `Best suited to: ${b.bestFor.slice(0, 3).join(', ')}`],
        tag: b.tier,
      }));
      if (!entries.length) return null;
      return {
        heading: `${name} in ${countyName}: how to choose`,
        lede: `We supply and service all of these — we are not an authorised dealer for any of them, which is why this comparison can be honest about where each one fits.`,
        entries,
        references: bible.references.slice(0, 3),
      };
    }
  }
}
