/**
 * One answer for every Generator Oracle entry point.
 *
 * 2026-10-25 audit: the search API, /api/ai/diagnose and /api/ai/chat each
 * read codes their own way — "Cummins 111" was SPN 629 FMI 12 in one, a
 * DeepSea "Battery Voltage Low" labelled "Exact match" in another and a
 * greeting in the third. All three now ask the fault index.
 */
import { searchIndex, diagnoseFromSymptoms, normalizeCodeQuery, type SearchResultItem, type RankedFault, type RankedGuide } from './faultIndex';

/** A typed code (J1939, maker number, controller code) rather than a sentence. */
export function looksLikeCode(text: string): boolean {
  const s = text.trim();
  if (!s || s.length > 60) return false;
  if (normalizeCodeQuery(s)) return true;
  if (/^(cummins|perkins)\s*(fault\s*)?(code\s*)?\d{2,4}$/i.test(s)) return true;
  if (/\b(spn|fmi|mid|pid)\b/i.test(s)) return true;
  // Short alphanumeric tokens such as "E104", "A003", "PW10-147", "DSE 7320 105".
  return /^[A-Za-z]{0,4}[-\s]?\d{2,5}([-\s][A-Za-z0-9]{1,6})*$/.test(s);
}

export function codeLabel(r: Pick<SearchResultItem, 'code' | 'codeKind' | 'brand'>): string {
  return r.codeKind === 'reference' ? `EmersonEIMS ref ${r.code}` : r.code;
}

export interface OracleAnswer {
  kind: 'code' | 'symptom' | 'none';
  found: boolean;
  text: string;
  results: SearchResultItem[];
  guides: RankedGuide[];
  interpretedAs: string | null;
}

const ENGINEER = 'WhatsApp an engineer on 0768 860 665 with the controller make, model and the exact wording on the display.';

export function answerOracle(message: string): OracleAnswer {
  const q = message.trim();
  if (looksLikeCode(q)) {
    const r = searchIndex({ query: q, pageSize: 5 });
    if (r.total > 0) {
      const top = r.results[0];
      const others = r.results.slice(1, 4).map((x) => `${codeLabel(x)} — ${x.title}`);
      const text = [
        `**${codeLabel(top)} — ${top.title}** (${top.brand}; severity: ${top.severity})`,
        top.description,
        r.interpretedAs && r.interpretedAs.toUpperCase() !== q.toUpperCase() ? `Read as ${r.interpretedAs}.` : '',
        others.length ? `Other entries that match: ${others.join('; ')}.` : '',
        'This is our engineers\' reference note, not the manufacturer\'s manual — confirm with your controller or engine manual before replacing parts.',
      ].filter(Boolean).join('\n\n');
      return { kind: 'code', found: true, text, results: r.results, guides: [], interpretedAs: r.interpretedAs };
    }
    return {
      kind: 'code', found: false, results: [], guides: [], interpretedAs: r.interpretedAs,
      text: `"${q}" is not in our fault-code reference. That does not mean anything is wrong with your controller — we may simply not hold that code. ${ENGINEER}`,
    };
  }
  const d = diagnoseFromSymptoms({ symptoms: [q], topN: 5 });
  const alarms: RankedFault[] = d.ranked.slice(0, 3);
  if (d.guides.length || alarms.length) {
    const parts: string[] = [];
    if (d.guides.length) parts.push(`Repair guides that cover this: ${d.guides.map((g) => `${g.title} (${g.url})`).join('; ')}.`);
    if (alarms.length) parts.push(`Alarms that mention these symptoms: ${alarms.map((a) => `${codeLabel(a)} — ${a.title}`).join('; ')}.`);
    parts.push('These are matched on the words you used, not a diagnosis. Start with the guide, and stop the set if there is a safety risk.');
    return { kind: 'symptom', found: true, text: parts.join('\n\n'), results: alarms, guides: d.guides, interpretedAs: null };
  }
  return {
    kind: 'none', found: false, results: [], guides: [], interpretedAs: null,
    text: `Type a fault code as it appears on the display (for example SPN 110 FMI 0) or describe what the generator is doing (for example "black smoke under load"). ${ENGINEER}`,
  };
}
