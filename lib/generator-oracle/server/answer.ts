/**
 * One answer for every Generator Oracle entry point.
 *
 * 2026-10-25 audit: the search API, /api/ai/diagnose and /api/ai/chat each
 * read codes their own way — "Cummins 111" was SPN 629 FMI 12 in one, a
 * DeepSea "Battery Voltage Low" labelled "Exact match" in another and a
 * greeting in the third. All three now ask the fault index.
 */
import { searchIndex, diagnoseFromSymptoms, normalizeCodeQuery, lookupFaultCode, invalidCodeReason, type SearchResultItem, type RankedFault, type RankedGuide } from './faultIndex';

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
  // Nothing to match on (2026-10-27 audit: "!!!???" listed alarms).
  if (!/[a-z0-9]/i.test(q)) {
    return { kind: 'none', found: false, results: [], guides: [], interpretedAs: null,
      text: `Type a fault code as it appears on the display (for example SPN 110 FMI 0) or describe what the generator is doing (for example "black smoke under load"). ${ENGINEER}` };
  }
  // A bare 1-2 digit number is not enough to identify a fault ("12" answered
  // with a Volvo oil-pressure shutdown).
  if (/^\d{1,2}$/.test(q)) {
    return { kind: 'none', found: false, results: [], guides: [], interpretedAs: null,
      text: `"${q}" on its own could be many different faults. Tell us the controller or engine make and the full code or message (for example "DSE low oil pressure", "Cummins 151" or "SPN 110 FMI 0"). ${ENGINEER}` };
  }
  const canonical = normalizeCodeQuery(q);
  // The same validator as search and lookup (2026-10-30 audit: "SPN -5" was
  // read here as SPN 5).
  const bad = invalidCodeReason(q);
  if (bad) {
    return { kind: 'code', found: false, results: [], guides: [], interpretedAs: canonical,
      text: `${bad} ${ENGINEER}` };
  }
  if (looksLikeCode(q)) {
    const r = searchIndex({ query: q, pageSize: 5 });
    if (r.total > 0) {
      const top = r.results[0];
      const others = r.results.slice(1, 4).map((x) => `${codeLabel(x)} — ${x.title}`);
      // Causes, checks and safety for the top match, not only its meaning
      // (2026-10-27 audit: chat gave the meaning and nothing to do next).
      const full = lookupFaultCode(top.id).exactMatches[0];
      // Each warning ends with a full stop (2026-10-30 audit: "...before restart Check for...").
      const sentence = (s: string) => { const x = s.trim(); return /[.!?]$/.test(x) ? x : `${x}.`; };
      const safety = full?.safetyWarnings?.length ? `⚠️ ${full.safetyWarnings.map(sentence).join(' ')}` : '';
      const causes = full?.possibleCauses?.length ? `Likely causes: ${full.possibleCauses.slice(0, 4).map((c) => c.cause).join('; ')}.` : '';
      const checks = full?.diagnosticSteps?.length ? `Checks: ${full.diagnosticSteps.slice(0, 4).map((s) => s.action).join('; ')}.` : '';
      const text = [
        `**${codeLabel(top)} — ${top.title}** (${top.brand}; severity: ${top.severity})`,
        safety,
        top.description,
        causes,
        checks,
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
    // Safety first, the same lines the page shows (2026-10-30 audit).
    if (d.safety?.length) parts.push(`⚠️ Safety: ${d.safety.join(' ')}`);
    if (/\bleak/i.test(q)) parts.push(d.notes[0]);
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
