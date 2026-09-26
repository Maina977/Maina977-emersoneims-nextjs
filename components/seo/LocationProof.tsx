import Link from 'next/link';
import { getPublishedCaseStudies, type CaseStudy } from '@/data/caseStudies';
import { CONFIRMED_CLIENTS, type ConfirmedClient } from '@/data/confirmedClients';

/**
 * Client proof on the location pages.
 *
 * WHY IT EXISTS. A crawl on 2026-08-08 found that EmersonEIMS's earned
 * reputation was confined almost entirely to the homepage: /services, /contact
 * and all the /kenya/* pages carried NO client proof. Those pages are where
 * search traffic lands and where a buyer decides whether to trust the firm.
 *
 * WHERE THE DATA COMES FROM. This component holds no client data of its own —
 * that was the defect. It used to keep a private hand-copied list which had
 * drifted from the homepage, so the location pages and the homepage named
 * different clients with different figures. It now reads two shared records:
 *
 *   data/confirmedClients.ts  short references the OWNER CONFIRMED GENUINE on
 *                             2026-09-11 — the same list the homepage shows.
 *   data/caseStudies.ts       long-form studies; only PUBLISHED entries that
 *                             carry evidence documents, via
 *                             getPublishedCaseStudies().
 *
 * A CORRECTION TO THE RECORD. Commit 9c95479a (2026-09-11) switched this block
 * to the case-study registry alone and described Bigot Flowers' "300 kVA +
 * 100 kVA" as "ten times the real capacity", because the registry documents a
 * 30 kVA set. That description was WRONG. The owner confirmed the same day that
 * the 300 + 100 kVA figure is genuine. The two records are best read as two
 * jobs — the main farm installation and a separate cold-chain set. See the
 * header of data/confirmedClients.ts. Maua Methodist Hospital, which that
 * commit dropped for having no case study, is likewise a confirmed client.
 *
 * WHICH CLIENTS, AND WHY IT VARIES BY PAGE. Local work first — a project in the
 * reader's own county is the strongest proof there is. Then case studies in the
 * same trade as the page. Capped at three, in stable order, so a given page
 * always renders the same cards. When a client appears in both records, the
 * confirmed reference wins, so this block never contradicts the homepage.
 *
 * NO Review OR AggregateRating SCHEMA, and that is a considered decision.
 * Google excludes self-serving reviews about your own business from rich
 * results, so marking these up would earn no stars and risk a manual action.
 */

/**
 * SEO_SERVICES.category -> CaseStudy.category.
 *
 * EVERY CATEGORY IS LISTED, INCLUDING THE ONES THAT MAP TO NOTHING. An absent
 * key and a key mapped to [] behaved identically before, and that hid the fact
 * that whole trades have no published proof. Written out, the gap is visible to
 * the next person reading this file:
 *
 *   Counted 2026-09-27 across data/caseStudies.ts and data/confirmedClients.ts
 *   — 8 Generator case studies, 1 Hybrid, and 8 confirmed clients every one of
 *   which is a generator or power installation. There is no published solar,
 *   motor, plumbing, borehole, HVAC or incinerator project on this site.
 *
 * That is a real gap in evidence, not a bug in this component, and it is why
 * the block below says so in plain words instead of letting generator work
 * stand in as proof of a trade it is not.
 */
const SERVICE_TO_CASE_CATEGORY: Record<string, CaseStudy['category'][]> = {
  generators: ['Generator', 'Hybrid'],
  solar: ['Solar', 'Hybrid'],
  ups: ['UPS', 'Hybrid'],
  electrical: ['Generator', 'UPS'],
  automation: ['Generator', 'Diagnostics'],
  // No published project in these trades yet. Listed so the gap is explicit.
  motors: [],
  plumbing: [],
  borehole: [],
  ac: [],
  incinerators: [],
};

/**
 * Which trade a confirmed client's work belongs to, read from the published
 * project string. Without this the confirmed list was entirely trade-blind: on
 * a solar page with no local client, the first three CONFIRMED_CLIENTS won on
 * order alone, which is how "50 kVA Generator + UPS" came to be the proof
 * offered for solar installation in Kakamega.
 */
function confirmedTrade(project: string): CaseStudy['category'] {
  const p = project.toLowerCase();
  const solar = p.includes('solar') || p.includes('pv');
  const engine = p.includes('generator') || p.includes('diesel') || p.includes('kva');
  /*
   * 'Hybrid' IN THIS TAXONOMY MEANS SOLAR-DIESEL, not "two kinds of box".
   * An earlier version of this function returned 'Hybrid' for anything
   * containing both "generator" and "ups", which made "50 kVA Generator + UPS"
   * a hybrid — and because the solar page asks for ['Solar', 'Hybrid'], a
   * generator job then counted as solar proof and suppressed the disclosure
   * this block exists to make. Hybrid now requires solar to be present.
   */
  if (solar && engine) return 'Hybrid';
  if (solar) return 'Solar';
  if (p.includes('ups') && !engine) return 'UPS';
  return 'Generator';
}

/**
 * Case-study client name -> the confirmed reference for the same client. The
 * two records spell some names differently, and without this a client would be
 * shown twice on one page, possibly with two different figures.
 */
const SAME_CLIENT: Record<string, string> = {
  'St. Austin Academy': 'St. Austins Academy Nairobi',
  'Kivukoni School': 'Kivukoni International School',
  'Bigot Flowers': 'Bigot Flowers - Naivasha',
};

/** "Trans Nzoia" -> "trans-nzoia", so registry names compare with route slugs. */
function slugOf(name: string): string {
  return name.toLowerCase().replace(/county/g, '').trim().replace(/\s+/g, '-');
}

/** First sentence only — the card is a pointer to the full study, not a copy. */
function firstSentence(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text.trim();
}

interface Card {
  key: string;
  client: string;
  place: string;
  label: string;
  body: string;
  result?: string;
  local: boolean;
  /** True when this project is in the same trade as the page. */
  trade: boolean;
  /** 0 local+trade, 1 trade, 2 local, 3 other — lower renders first. */
  rank: number;
  order: number;
}

interface Props {
  /** County slug of the page this renders on, used to lead with local work. */
  countySlug: string;
  /** County or constituency name, for the heading. */
  locationName: string;
  /** SEO_SERVICES.category of the page, when it is about one trade. */
  serviceCategory?: string;
}

export default function LocationProof({ countySlug, locationName, serviceCategory }: Props) {
  const wanted = serviceCategory ? SERVICE_TO_CASE_CATEGORY[serviceCategory] ?? [] : [];

  /*
   * RANKING. Local work in the page's own trade is the strongest proof there
   * is, so it sorts first; then the right trade anywhere; then local work in
   * another trade; then everything else. Before this, `local ? 0 : 2` meant a
   * confirmed client's trade was never considered at all.
   */
  const rankOf = (local: boolean, trade: boolean) =>
    local && trade ? 0 : trade ? 1 : local ? 2 : 3;

  const fromConfirmed: Card[] = CONFIRMED_CLIENTS.map((c: ConfirmedClient, i) => {
    const local = c.countySlug === countySlug;
    const trade = wanted.includes(confirmedTrade(c.project));
    return {
      key: `c-${c.name}`,
      client: c.name,
      place: c.place ?? '',
      label: `${c.sector} · ${c.year}`,
      body: c.project,
      local,
      trade,
      rank: rankOf(local, trade),
      order: i,
    };
  });

  // Released names only, and never a client already shown from the confirmed
  // list — the confirmed reference is the one the homepage prints.
  const fromStudies: Card[] = getPublishedCaseStudies()
    .filter((cs) => cs.clientNameReleased !== false && !SAME_CLIENT[cs.client])
    .map((cs, i) => {
      const local = slugOf(cs.county) === countySlug;
      const trade = wanted.includes(cs.category);
      void trade;
      const headline = cs.results[0];
      return {
        key: `s-${cs.id}`,
        client: cs.client,
        place: cs.location,
        label: cs.technical?.capacity ? `${cs.category} · ${cs.technical.capacity}` : cs.category,
        body: firstSentence(cs.solution),
        result: headline ? `${headline.metric}: ${headline.before} → ${headline.after}` : undefined,
        local,
        trade,
        rank: rankOf(local, trade),
        order: CONFIRMED_CLIENTS.length + i,
      };
    });

  const shown = [...fromConfirmed, ...fromStudies]
    .sort((a, b) => a.rank - b.rank || a.order - b.order)
    .slice(0, 3);

  if (!shown.length) return null;

  const local = shown.filter((c) => c.local);
  const hasLocal = local.length > 0;

  /*
   * THE HONEST CASE. `wanted` is empty for a trade with no published project
   * — motors, plumbing, boreholes, AC, incinerators — and non-empty but
   * unmatched for solar and UPS, because every case study and every confirmed
   * client on this site is generator or power work.
   *
   * In both cases the cards below are real projects, but they are NOT evidence
   * of the trade this page is about, and a heading reading "Work we have
   * delivered" above three generator jobs on a solar page invites exactly the
   * inference we should not be inviting.
   *
   * This is the same position already taken on location: the block says plainly
   * when there is no project in the reader's county rather than implying one.
   * Saying it about trade as well costs nothing and is the difference between
   * proof and decoration.
   */
  const tradeShown = shown.some((c) => c.trade);
  const tradeGap = Boolean(serviceCategory) && !tradeShown;

  return (
    <section className="mb-16" aria-labelledby="proof-heading">
      <h2 id="proof-heading" className="text-2xl md:text-3xl font-bold mb-3">
        {tradeGap
          ? 'How we work, on projects we can show you'
          : hasLocal
            ? `Work we have delivered in ${locationName}`
            : 'Work we have delivered'}
      </h2>
      <p className="text-gray-400 max-w-3xl mb-6">
        {/*
          The sentence does not repeat a client name. Confirmed names often carry
          their own place — "Bigot Flowers - Naivasha", "AMH Nairobi" — so the
          earlier "<client> is in <place>" rendered "St. Austins Academy Nairobi
          is in Nairobi". Stating how many are local says the same thing and
          reads like a person wrote it.
        */}
        {tradeGap
          ? `We have not yet published a project in this discipline, and we are not going to dress up work in another one as if we had. What follows is documented power work for named clients${
              hasLocal ? ` — including ${local.length === 1 ? 'one' : local.length} in ${locationName}` : ''
            }, so you can judge the standard, the reporting and the people. The same engineers do this work.`
          : hasLocal
            ? `These are named clients, not anonymous case studies — ${
                local.length === 1 ? 'including one' : `${local.length} of them`
              } here in ${locationName}.`
            : `We have not published a project in ${locationName} yet. These are named clients elsewhere — our mobile workshop covers all 47 counties, so the same team does the work here.`}
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {shown.map((card) => (
          <div
            key={card.key}
            className={`rounded-xl border p-5 ${
              card.local ? 'border-amber-500/40 bg-amber-400/5' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{card.label}</div>
            <div className="text-lg font-semibold text-white mb-1">{card.client}</div>
            {card.place ? <div className="text-sm text-amber-300/90 mb-3">{card.place}</div> : null}
            <p className="text-sm text-gray-400 mb-3">{card.body}</p>
            {card.result ? <p className="text-sm text-gray-300 font-medium">{card.result}</p> : null}
          </div>
        ))}
      </div>

      <Link
        href="/case-studies"
        className="inline-block text-amber-300 hover:text-amber-200 font-semibold"
      >
        Read the full case studies &rarr;
      </Link>
    </section>
  );
}
