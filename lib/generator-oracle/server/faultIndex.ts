/**
 * Generator Oracle — Server-side fault-code index
 *
 * Wraps the client-safe data layer (controllerFaultCodes.ts) with server-only
 * helpers used by /api/generator-oracle/* routes.
 *
 * WHAT THE INDEX HOLDS (2026-10-18 tool audit)
 *  1. Hand-written controller alarm descriptions, one entry per brand + code
 *     (controllerFaultCodes.ts merges the per-model copies).
 *  2. The J1939 SPN/FMI engine-code reference (lib/data/j1939FaultCodes.ts) —
 *     the numbers an electronic diesel engine actually reports, with meanings
 *     composed from the standard's own SPN and FMI definitions.
 * The template expansion behind the old 451,593 figure is gone; nothing here
 * generates, mocks or pads data.
 *
 * Every result says what kind of number its code is (`codeKind`):
 *   'j1939'     — SAE J1939 SPN/FMI, as reported by the engine or controller
 *   'j1587'     — SAE J1587 MID/PID/FMI (older Volvo Penta EMS)
 *   'reference' — our own lookup number for a controller that displays a text
 *                 alarm; the customer should match by the alarm name.
 */

import 'server-only';

import {
  CONTROLLER_BRANDS,
  FAULT_CATEGORIES,
  getAllFaultCodes,
  getFaultCodesByBrand,
  type ControllerFaultCode,
} from '@/lib/generator-oracle/controllerFaultCodes';
import { J1939_FAULT_CODES, type J1939FaultCode } from '@/lib/data/j1939FaultCodes';
import { REPAIR_ARTICLES, type RepairArticle } from '@/lib/repair-centre';

export const J1939_BRAND = 'J1939 engine codes';

/**
 * Resolve any user-supplied brand string (alias key like "DSE", "VODIA",
 * "POWERWIZARD", or display name fragment like "deepsea") to the canonical
 * display name used in the fault-code records (`record.brand`). Returns the
 * input lowercased when no match is found so callers fall back to fuzzy
 * .includes() matching against record.brand.
 */
function resolveBrandFilterText(input: string): string {
  const raw = input.trim();
  if (!raw) return '';
  const up = raw.toUpperCase();
  if (up === 'J1939' || up.startsWith('J1939 ')) return J1939_BRAND.toLowerCase();
  const direct = (CONTROLLER_BRANDS as Record<string, { name: string } | undefined>)[up];
  if (direct?.name) return direct.name.toLowerCase();
  const lower = raw.toLowerCase();
  for (const v of Object.values(CONTROLLER_BRANDS) as { name: string }[]) {
    if (v.name.toLowerCase().includes(lower)) return v.name.toLowerCase();
  }
  return lower;
}

// ──────────────────────────────────────────────────────────────────────────
// J1939 reference rows, shaped like controller entries so one search covers both
// ──────────────────────────────────────────────────────────────────────────
function j1939AsFaultCode(c: J1939FaultCode): ControllerFaultCode {
  const engines = c.model.split(',').map((s) => s.trim()).filter(Boolean);
  return {
    id: `J1939-SPN${c.spn}-FMI${c.fmi}`,
    code: `SPN${c.spn}-FMI${c.fmi}`,
    brand: J1939_BRAND,
    model: c.model,
    models: engines,
    firmwareVersions: [],
    category: c.category,
    subcategory: c.category,
    severity: c.severity,
    alarmType: c.severity === 'shutdown' ? 'shutdown' : c.severity === 'critical' ? 'trip' : 'warning',
    title: c.title,
    description: c.description,
    triggerParameters: [],
    symptoms: [],
    // The reference does not rank its causes. PossibleCause requires a
    // likelihood, so each gets the neutral 'medium'. Do not display likelihood
    // for J1939 rows as if it were a ranking.
    possibleCauses: c.causes.map((cause) => ({ likelihood: 'medium' as const, cause, verification: '' })),
    diagnosticSteps: c.remedies.map((action, i) => ({ step: i + 1, action, expectedResult: '' })),
    resetPathways: [],
    solutions: [],
    safetyWarnings: [],
    preventiveMeasures: [],
    verified: true,
    lastUpdated: '2026-10-18',
  };
}

let _j1939Rows: ControllerFaultCode[] | null = null;
function j1939Rows(): ControllerFaultCode[] {
  if (!_j1939Rows) _j1939Rows = J1939_FAULT_CODES.map(j1939AsFaultCode);
  return _j1939Rows;
}

let _all: ControllerFaultCode[] | null = null;
/** Controller alarms + J1939 reference. */
function indexAll(): ControllerFaultCode[] {
  if (!_all) _all = [...getAllFaultCodes(), ...j1939Rows()];
  return _all;
}

function indexByBrand(brand: string): ControllerFaultCode[] {
  if (resolveBrandFilterText(brand) === J1939_BRAND.toLowerCase()) return j1939Rows();
  return getFaultCodesByBrand(brand);
}

export type CodeKind = 'j1939' | 'j1587' | 'reference';

export function codeKindOf(c: Pick<ControllerFaultCode, 'brand' | 'code'>): CodeKind {
  if (/^SPN\d+-FMI\d+$/i.test(c.code)) return 'j1939';
  if (/^MID\d+-PID\d+-FMI\d+$/i.test(c.code)) return 'j1587';
  return 'reference';
}

/**
 * Technicians write codes many ways: "SPN 100 FMI 1", "spn100 fmi1",
 * "SPN 100 / FMI 1", "100-1", "100/1", "MID 128 PID 100 FMI 1". The index
 * stores "SPN100-FMI1" and "MID128-PID100-FMI1". Returns the canonical form
 * when the query is recognisably a J1939 / J1587 code, otherwise null.
 */
export function normalizeCodeQuery(q: string): string | null {
  const s = q.trim().toUpperCase();
  let m = s.match(/^MID\s*[:#-]?\s*(\d+)\s*[,/-]?\s*PID\s*[:#-]?\s*(\d+)\s*[,/-]?\s*FMI\s*[:#-]?\s*(\d+)$/);
  if (m) return `MID${+m[1]}-PID${+m[2]}-FMI${+m[3]}`;
  m = s.match(/^SPN\s*[:#-]?\s*(\d+)\s*(?:[,/-]|\s)\s*(?:FMI\s*[:#-]?\s*)?(\d+)$/);
  if (m) return `SPN${+m[1]}-FMI${+m[2]}`;
  m = s.match(/^(\d{1,6})\s*[/-]\s*(\d{1,2})$/); // "100-1", "100/1"
  if (m) return `SPN${+m[1]}-FMI${+m[2]}`;
  m = s.match(/^SPN\s*[:#-]?\s*(\d+)$/); // "SPN 100" → every FMI of that SPN
  if (m) return `SPN${+m[1]}-`;
  return null;
}

export type Severity = ControllerFaultCode['severity'];

export interface SearchFilters {
  brand?: string;
  model?: string;
  severity?: Severity;
  category?: string;
  /** Kept for API compatibility; every indexed entry is hand-written now. */
  verifiedOnly?: boolean;
}

export interface SearchOptions extends SearchFilters {
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResultItem {
  id: string;
  code: string;
  codeKind: CodeKind;
  brand: string;
  model: string;
  models: string[];
  category: string;
  subcategory: string;
  severity: Severity;
  alarmType: ControllerFaultCode['alarmType'];
  title: string;
  description: string;
  verified: boolean;
  source: 'hand-written' | 'j1939-reference';
}

const SLIM_FIELDS = (c: ControllerFaultCode): SearchResultItem => ({
  id: c.id,
  code: c.code,
  codeKind: codeKindOf(c),
  brand: c.brand,
  model: c.model,
  models: c.models ?? [c.model],
  category: c.category,
  subcategory: c.subcategory,
  severity: c.severity,
  alarmType: c.alarmType,
  title: c.title,
  description: c.description,
  verified: c.verified === true,
  source: c.brand === J1939_BRAND ? 'j1939-reference' : 'hand-written',
});

// ──────────────────────────────────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────────────────────────────────
export interface HealthReport {
  ok: true;
  generatedAt: string;
  totals: {
    /** Everything searchable: controller alarms + J1939 SPN/FMI reference entries. */
    faultCodes: number;
    /** Distinct hand-written controller alarm descriptions (one per brand + code). */
    controllerAlarms: number;
    /** J1939 SPN/FMI reference entries. */
    j1939Codes: number;
    /** Distinct J1939 parameters (SPNs) those entries cover. */
    j1939Spns: number;
    /** Controller brands. */
    brands: number;
    /** Controller models the alarms are written for. */
    models: number;
    categories: number;
  };
  byBrand: Record<string, number>;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  notes: string[];
}

export function buildHealthReport(): HealthReport {
  const controllers = getAllFaultCodes();
  const j1939 = j1939Rows();
  const all = indexAll();

  const byBrand: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  for (const c of all) {
    byBrand[c.brand] = (byBrand[c.brand] || 0) + 1;
    bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1;
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
  }

  const models = new Set<string>();
  for (const c of controllers) for (const m of c.models ?? [c.model]) models.add(`${c.brand}::${m}`);

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    totals: {
      faultCodes: all.length,
      controllerAlarms: controllers.length,
      j1939Codes: j1939.length,
      j1939Spns: new Set(J1939_FAULT_CODES.map((c) => c.spn)).size,
      brands: new Set(controllers.map((c) => c.brand)).size,
      models: models.size,
      categories: Object.keys(byCategory).length,
    },
    byBrand,
    bySeverity,
    byCategory,
    notes: [
      'Controller alarm descriptions are written by EmersonEIMS in our own words, one entry per brand and code. They are guidance, not manufacturer text; the OEM manual is authoritative.',
      'J1939 entries pair a standard SPN (what is measured) with a standard FMI (how it is wrong), as reported by electronic diesel engines.',
      'Codes marked codeKind "reference" are our lookup numbers for controllers that show a text alarm; match those by the alarm name.',
    ],
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Search
// ──────────────────────────────────────────────────────────────────────────
function applyFilters(codes: ControllerFaultCode[], f: SearchFilters): ControllerFaultCode[] {
  let out = codes;
  if (f.brand) {
    const b = resolveBrandFilterText(f.brand);
    if (b) out = out.filter((c) => c.brand.toLowerCase().includes(b));
  }
  if (f.model) {
    const m = f.model.toLowerCase();
    out = out.filter((c) => (c.models ?? [c.model]).some((x) => x.toLowerCase().includes(m)));
  }
  if (f.severity) out = out.filter((c) => c.severity === f.severity);
  if (f.category) {
    const cat = f.category.toLowerCase();
    out = out.filter((c) => c.category.toLowerCase() === cat);
  }
  if (f.verifiedOnly) out = out.filter((c) => c.verified === true);
  return out;
}

function matchesQuery(c: ControllerFaultCode, q: string, canonical: string | null): boolean {
  const code = c.code.toLowerCase();
  if (canonical) {
    const cn = canonical.toLowerCase();
    return cn.endsWith('-') ? code.startsWith(cn) : code === cn;
  }
  return (
    code.includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.brand.toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.subcategory.toLowerCase().includes(q)
  );
}

export interface SearchResponse {
  query: string;
  /** The code form the query was read as, when it was a J1939 / J1587 code. */
  interpretedAs: string | null;
  filters: SearchFilters;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  results: SearchResultItem[];
  source: 'index';
}

export function searchIndex(opts: SearchOptions): SearchResponse {
  const query = (opts.query || '').trim();
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(opts.pageSize ?? 20)));
  const q = query.toLowerCase();
  const canonical = query ? normalizeCodeQuery(query) : null;

  const base = opts.brand ? indexByBrand(opts.brand) : indexAll();
  let filtered = query ? base.filter((c) => matchesQuery(c, q, canonical)) : base;
  filtered = applyFilters(filtered, opts);

  // Exact code first, then code-prefix matches, then controller entries before
  // the generic J1939 reference (a brand-specific description says more).
  if (q) {
    const rank = (c: ControllerFaultCode) => {
      const code = c.code.toLowerCase();
      return code === q || (canonical && code === canonical.toLowerCase()) ? 0 : code.startsWith(q) ? 1 : 2;
    };
    filtered = [...filtered].sort(
      (a, b) => rank(a) - rank(b) || Number(a.brand === J1939_BRAND) - Number(b.brand === J1939_BRAND),
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize).map(SLIM_FIELDS);

  return {
    query,
    interpretedAs: canonical && !canonical.endsWith('-') ? canonical : canonical ? canonical.slice(0, -1) : null,
    filters: {
      brand: opts.brand,
      model: opts.model,
      severity: opts.severity,
      category: opts.category,
      verifiedOnly: opts.verifiedOnly,
    },
    page,
    pageSize,
    total,
    totalPages,
    results: slice,
    source: 'index',
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Exact fault-code lookup
// ──────────────────────────────────────────────────────────────────────────
export interface FaultLookupResponse {
  found: boolean;
  exactMatches: (ControllerFaultCode & { codeKind: CodeKind })[];
  partialMatches: SearchResultItem[];
  matchType: 'exact' | 'partial' | 'none';
  interpretedAs: string | null;
}

export function lookupFaultCode(code: string, brand?: string): FaultLookupResponse {
  const raw = code.trim();
  if (!raw) return { found: false, exactMatches: [], partialMatches: [], matchType: 'none', interpretedAs: null };
  const canonical = normalizeCodeQuery(raw);
  const wanted = (canonical && !canonical.endsWith('-') ? canonical : raw).toLowerCase();
  const withKind = (c: ControllerFaultCode) => ({ ...c, codeKind: codeKindOf(c) });

  const pool = brand ? indexByBrand(brand) : indexAll();

  const byId = pool.find((c) => c.id.toLowerCase() === raw.toLowerCase());
  if (byId) return { found: true, exactMatches: [withKind(byId)], partialMatches: [], matchType: 'exact', interpretedAs: canonical };

  const exact = pool.filter((c) => c.code.toLowerCase() === wanted);
  if (exact.length > 0) {
    // Brand-specific descriptions before the generic J1939 reference.
    exact.sort((a, b) => Number(a.brand === J1939_BRAND) - Number(b.brand === J1939_BRAND));
    return { found: true, exactMatches: exact.slice(0, 25).map(withKind), partialMatches: [], matchType: 'exact', interpretedAs: canonical };
  }

  const prefix = canonical && canonical.endsWith('-') ? canonical.toLowerCase() : null;
  const partial = pool
    .filter((c) => (prefix ? c.code.toLowerCase().startsWith(prefix) : c.code.toLowerCase().includes(wanted)))
    .slice(0, 25)
    .map(SLIM_FIELDS);

  return {
    found: partial.length > 0,
    exactMatches: [],
    partialMatches: partial,
    matchType: partial.length > 0 ? 'partial' : 'none',
    interpretedAs: canonical,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Brand & controller catalogues
// ──────────────────────────────────────────────────────────────────────────
export interface BrandSummary {
  key: string;
  name: string;
  models: string[];
  color: string;
  totalCodes: number;
  verifiedCodes: number;
}

export function listBrandSummaries(): BrandSummary[] {
  const byBrand: Record<string, number> = {};
  for (const c of getAllFaultCodes()) byBrand[c.brand] = (byBrand[c.brand] || 0) + 1;

  return Object.entries(CONTROLLER_BRANDS).map(([key, b]) => ({
    key,
    name: b.name,
    // CONTROLLER_BRANDS is `as const`, so b.models is a readonly tuple while
    // BrandSummary.models is string[]. Copy rather than widen the interface:
    // callers already treat this as an ordinary array.
    models: [...b.models],
    color: b.color,
    totalCodes: byBrand[b.name] || 0,
    verifiedCodes: byBrand[b.name] || 0,
  }));
}

export interface ControllerSummary {
  brand: string;
  model: string;
  totalCodes: number;
  verifiedCodes: number;
}

export function listControllers(brand?: string): ControllerSummary[] {
  const pool = brand ? getFaultCodesByBrand(brand) : getAllFaultCodes();
  const map = new Map<string, ControllerSummary>();
  for (const c of pool) {
    for (const model of c.models ?? [c.model]) {
      const key = `${c.brand}::${model}`;
      let entry = map.get(key);
      if (!entry) {
        entry = { brand: c.brand, model, totalCodes: 0, verifiedCodes: 0 };
        map.set(key, entry);
      }
      entry.totalCodes++;
      if (c.verified === true) entry.verifiedCodes++;
    }
  }
  return Array.from(map.values()).sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
}

// ──────────────────────────────────────────────────────────────────────────
// Symptom-based diagnosis
// ──────────────────────────────────────────────────────────────────────────
export interface DiagnoseInput {
  symptoms?: string[];
  brand?: string;
  model?: string;
  category?: string;
  alarmText?: string;
  topN?: number;
}

export interface RankedFault extends SearchResultItem {
  score: number;
  matchedTerms: string[];
}

/** A published Repair Centre article that diagnoses the described symptoms. */
export interface RankedGuide {
  title: string;
  url: string;
  hub: string;
  summary: string;
  score: number;
  matchedTerms: string[];
}

export interface DiagnoseResponse {
  input: DiagnoseInput;
  /** Repair Centre guides for the symptoms — the primary answer for mechanical symptoms. */
  guides: RankedGuide[];
  /** Controller alarms whose descriptions match the symptoms. */
  ranked: RankedFault[];
  considered: number;
  source: 'index';
  notes: string[];
}

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'on', 'off', 'in', 'with', 'for', 'of', 'to', 'at', 'by', 'no',
  'not', 'has', 'have', 'after', 'before', 'when', 'while', 'engine', 'generator', 'unit', 'system',
  'will', 'wont', 'won', 'does', 'doesn', 'very', 'too', 'keeps', 'keep', 'set', 'genset', 'my', 'our',
  'it', 'its', 'then', 'than', 'from', 'are', 'was', 'been', 'being', 'can', 'cannot', 'any', 'some',
]);

/**
 * Crude English stem so "starting"/"starts"/"started" meet "start" and
 * "overheating" meets "overheat" — while "hard" no longer matches inside
 * "hardware" (matching is by whole word, not substring).
 */
function stem(w: string): string {
  let s = w;
  for (const suf of ['ing', 'ed', 'es', 's']) {
    if (s.length > suf.length + 3 && s.endsWith(suf)) { s = s.slice(0, -suf.length); break; }
  }
  // "charge"/"charging" and "smoke"/"smoking" should meet: drop a final e.
  if (s.length > 4 && s.endsWith('e')) s = s.slice(0, -1);
  return s;
}

function words(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean).map(stem);
}

// Tokens are stemmed before the stop check, so the stop list is stemmed too
// ("engine" becomes "engin").
const STOP_STEMS = new Set([...STOP].map(stem));

function tokenize(s: string): string[] {
  return words(s).filter((t) => t.length >= 3 && !STOP_STEMS.has(t));
}

/** Adjacent pairs from each symptom phrase, e.g. "white smoke", "hard start". */
function phrasePairs(symptoms: string[]): [string, string][] {
  const out: [string, string][] = [];
  for (const s of symptoms) {
    const t = tokenize(s);
    for (let i = 0; i + 1 < t.length; i++) out.push([t[i], t[i + 1]]);
  }
  return out;
}

function containsPair(seq: string[], [a, b]: [string, string]): boolean {
  for (let i = 0; i + 1 < seq.length; i++) if (seq[i] === a && seq[i + 1] === b) return true;
  return false;
}

/** Generator-side Repair Centre hubs; solar, UPS etc. are out of scope for the Oracle. */
const GENERATOR_HUBS = new Set(['generators', 'engine-systems', 'fuel-systems', 'controllers', 'fault-codes', 'ats-changeover']);

function rankGuides(terms: string[], pairs: [string, string][]): RankedGuide[] {
  const out: RankedGuide[] = [];
  for (const a of REPAIR_ARTICLES as RepairArticle[]) {
    if (!GENERATOR_HUBS.has(a.hub)) continue;
    const title = words(a.header.title);
    const sym = Object.values(a.symptoms).flat().join(' ');
    const symWords = words(sym);
    const body = words(a.directAnswer);
    const titleSet = new Set(title);
    const symSet = new Set(symWords);
    const bodySet = new Set(body);
    let score = 0;
    const matched: string[] = [];
    for (const t of terms) {
      let hit = false;
      if (titleSet.has(t)) { score += 4; hit = true; }
      if (symSet.has(t)) { score += 2; hit = true; }
      if (bodySet.has(t)) { score += 1; hit = true; }
      if (hit) matched.push(t);
    }
    for (const p of pairs) {
      if (containsPair(title, p)) score += 6;
      else if (containsPair(symWords, p) || containsPair(body, p)) score += 4;
    }
    // A guide must match more than one weak word to be worth showing.
    const enough = matched.length >= Math.min(2, terms.length) || score >= 6;
    if (score > 0 && enough) {
      out.push({
        title: a.header.title,
        url: `/repair-centre/${a.hub}/${a.slug}`,
        hub: a.hub,
        summary: a.directAnswer.length > 280 ? `${a.directAnswer.slice(0, 277).replace(/\s+\S*$/, '')}…` : a.directAnswer,
        score,
        matchedTerms: matched,
      });
    }
  }
  return out.sort((x, y) => y.score - x.score).slice(0, 3);
}

export function diagnoseFromSymptoms(input: DiagnoseInput): DiagnoseResponse {
  const topN = Math.max(1, Math.min(50, input.topN ?? 10));
  const terms = Array.from(
    new Set(
      [
        ...(input.symptoms || []).flatMap(tokenize),
        ...(input.alarmText ? tokenize(input.alarmText) : []),
      ],
    ),
  );

  const filters: SearchFilters = {
    brand: input.brand,
    model: input.model,
    category: input.category,
  };

  // Symptom diagnosis works on the controller alarm descriptions: they carry
  // symptoms and ranked causes. The J1939 reference has neither, so it would
  // only add keyword noise here; it is reached through code lookup instead.
  const pool = input.brand ? getFaultCodesByBrand(input.brand) : getAllFaultCodes();
  const filtered = applyFilters(pool, filters);
  const phrases = [...(input.symptoms || []), ...(input.alarmText ? [input.alarmText] : [])];
  const pairs = phrasePairs(phrases);

  if (terms.length === 0) {
    return {
      input,
      guides: [],
      ranked: filtered.slice(0, topN).map((c) => ({ ...SLIM_FIELDS(c), score: 0, matchedTerms: [] })),
      considered: filtered.length,
      source: 'index',
      notes: ['No symptom keywords supplied; returning filter-only matches.'],
    };
  }

  // Score controller alarms against the symptom terms: whole-word (stemmed)
  // matches, with the title and listed symptoms weighted above the prose, and a
  // bonus when a whole symptom phrase ("low oil pressure") appears in order.
  const rankPool = (codes: ControllerFaultCode[]): RankedFault[] => {
    const out: RankedFault[] = [];
    for (const c of codes) {
      const title = words(c.title);
      const symptomWords = words((c.symptoms || []).join(' '));
      const causeWords = words((c.possibleCauses || []).map((p) => p.cause).join(' '));
      const prose = words(`${c.description} ${c.subcategory} ${c.category}`);
      const titleSet = new Set(title);
      const symSet = new Set(symptomWords);
      const causeSet = new Set(causeWords);
      const proseSet = new Set(prose);

      const matched: string[] = [];
      let score = 0;
      for (const t of terms) {
        let hit = false;
        if (titleSet.has(t)) { score += 4; hit = true; }
        if (symSet.has(t)) { score += 2; hit = true; }
        if (causeSet.has(t)) { score += 1; hit = true; }
        if (proseSet.has(t)) { score += 1; hit = true; }
        if (hit) matched.push(t);
      }
      for (const p of pairs) {
        if (containsPair(title, p)) score += 5;
        else if (containsPair(symptomWords, p) || containsPair(prose, p)) score += 3;
      }
      // One weak word in a long description is not evidence.
      if (score === 0 || matched.length < Math.min(2, terms.length)) continue;
      out.push({ ...SLIM_FIELDS(c), score, matchedTerms: matched });
    }
    out.sort((a, b) => b.score - a.score);
    return out;
  };

  // Report matches in the words the user typed ("smoke"), not the internal
  // stems ("smok").
  const typed = new Map<string, string>();
  for (const p of phrases) for (const w of p.toLowerCase().split(/[^a-z0-9]+/g)) if (w && !typed.has(stem(w))) typed.set(stem(w), w);
  const show = (list: string[]) => list.map((t) => typed.get(t) ?? t);

  const guides = rankGuides(terms, pairs).map((g) => ({ ...g, matchedTerms: show(g.matchedTerms) }));
  let ranked = rankPool(filtered).map((r) => ({ ...r, matchedTerms: show(r.matchedTerms) }));
  let considered = filtered.length;
  const notes = [
    'Repair Centre guides are listed first: smoke, hard starting, overheating and similar symptoms are mechanical, and a controller only shows the alarm they eventually cause.',
    'Controller alarms are matched by keyword against our hand-written alarm descriptions. Treat them as a starting point, not a confirmed fault; confirm with the controller\'s event log and the OEM manual.',
  ];

  // BRAND-FALLBACK FIX (2026-07-17 Oracle audit): the fault index is keyed by
  // CONTROLLER brand (DSE, ComAp, PowerWizard…), but users naturally type their
  // ENGINE brand (Perkins, Cummins, Volvo). That filtered the pool to empty and
  // returned zero results for common symptoms — the tool looked broken. When a
  // brand filter yields no ranked matches, retry brand-agnostically so the
  // symptom evidence still surfaces, and say why honestly.
  if (ranked.length === 0 && input.brand) {
    const allRanked = rankPool(applyFilters(getAllFaultCodes(), { model: input.model, category: input.category }))
      .map((r) => ({ ...r, matchedTerms: show(r.matchedTerms) }));
    if (allRanked.length > 0) {
      ranked = allRanked;
      considered = allRanked.length;
      notes.unshift(
        `No fault codes are indexed under the brand "${input.brand}". The fault database is organised by CONTROLLER brand (DeepSea, ComAp, CAT PowerWizard, SmartGen, Woodward, Datakom, Lovato, Siemens, ENKO, VODIA), not engine brand — results below are matched across all controllers by symptom. Identify your controller model for brand-specific codes.`,
      );
    }
  }

  return {
    input: { ...input, topN },
    guides,
    ranked: ranked.slice(0, topN),
    considered,
    source: 'index',
    notes,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Categories (for filter UIs)
// ──────────────────────────────────────────────────────────────────────────
export function listCategories(): { key: string; name: string; subcategories: string[] }[] {
  return Object.entries(FAULT_CATEGORIES).map(([key, c]) => ({
    key,
    name: c.name,
    // As above: FAULT_CATEGORIES is `as const`, so this is a readonly tuple.
    subcategories: [...c.subcategories],
  }));
}
