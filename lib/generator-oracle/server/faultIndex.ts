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
import { J1939_FAULT_CODES, COOL_DOWN, type J1939FaultCode } from '@/lib/data/j1939FaultCodes';
import { FAULT_CODES as CURATED_ENGINE_CODES } from '@/lib/data/faultCodes';
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
    // A J1939 diagnostic reports a condition; whether the set trips is the
    // controller's configuration. Only codes that ARE a shutdown say so
    // (2026-10-25 audit: "Approaching Shutdown" was labelled a trip).
    alarmType: c.severity === 'shutdown' ? 'shutdown' : 'warning',
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
    // e.g. the hot-cap warning on every coolant code (2026-10-27 audit).
    safetyWarnings: c.safety,
    preventiveMeasures: [],
    verified: false, // SPN/FMI identity is SAE J1939; the notes are our own guidance (2026-10-20)
    lastUpdated: '2026-10-18',
  };
}

let _j1939Rows: ControllerFaultCode[] | null = null;
function j1939Rows(): ControllerFaultCode[] {
  if (!_j1939Rows) _j1939Rows = J1939_FAULT_CODES.map(j1939AsFaultCode);
  return _j1939Rows;
}

/**
 * Safety first on every entry, whichever brand file wrote it (2026-10-27
 * audit: coolant procedures said "check coolant level and top up" with no
 * warning to let the engine cool; low oil pressure did not say stop).
 */
const J1939_SEVERITY = new Map<string, J1939FaultCode['severity']>(J1939_FAULT_CODES.map((j) => [`SPN${j.spn}-FMI${j.fmi}`, j.severity]));
// The J1939 reference's safety notes by code, so a controller entry for the same
// SPN/FMI carries them too (2026-10-29 audit: PowerWizard SPN 168 had no battery
// gas warning and SPN 190 no overspeed note, while the J1939 rows did).
const J1939_SAFETY = new Map<string, string[]>(J1939_FAULT_CODES.map((j) => [`SPN${j.spn}-FMI${j.fmi}`, (j as { safety?: string[] }).safety || []]));
const ISOLATE = 'Before touching wiring or terminals: stop the set, select OFF/STOP, isolate and lock off the battery and controller supply, and prove the terminals dead with an approved voltage tester.';
const TOPIC_SAFETY: Array<[RegExp, string[]]> = [
  [/earth|insulation/i, [ISOLATE, 'An earth fault can leave exposed metalwork live: treat the frame and panel as live until tested. Insulation testing needs an insulation tester with the AVR and controller disconnected first.']],
  [/overspeed|over speed|over-speed/i, ['Overspeed can destroy the engine and alternator: keep clear and do not restart until the governor, actuator and fuel control are checked. Never bypass the overspeed protection.']],
  [/batter|charg/i, ['Batteries give off explosive gas: no sparks or flames near them, and disconnect the negative lead first. Wear eye protection.']],
  [/fuel|diesel/i, ['No flames near fuel; clean spills at once. Diesel under pressure can penetrate skin: never feel for leaks with your hands.']],
  [/voltage|current|frequency|phase|power|breaker|alternator|avr|excit|sync|mains|bus/i, [ISOLATE, 'Generator and mains terminals are lethal while live: measure only with approved, rated instruments.']],
];
const GENERIC_SAFETY = /^follow standard (electrical )?safety procedures\.?$/i;
const CONDITION_WORDS: Record<string, string> = {
  engine_stopped: 'Engine stopped', fault_investigated: 'Cause found and fixed', fault_cleared: 'Cause found and fixed',
  cooldown_complete: 'Engine cooled down', breaker_open: 'Breaker open', mains_restored: 'Mains restored',
};
const conditionText = (c: string) => CONDITION_WORDS[c] ?? (/_/.test(c) ? c.replace(/_/g, ' ').replace(/^./, (x) => x.toUpperCase()) : c);
/** No reset sequence ends by selecting AUTO without a MANUAL test and a warning (2026-10-29 audit). */
function safeResetSteps<T extends { stepNumber?: number; action: string; keySequence?: string[]; expectedResponse?: string }>(steps: T[]): T[] {
  const autoAt = steps.findIndex((s) => (s.keySequence || []).some((k) => /^auto$/i.test(k.trim())) || /\bselect (the )?auto\b|\bauto mode\b/i.test(s.action));
  if (autoAt < 0) return steps;
  const out = steps.slice(0, autoAt);
  const hasManualTest = out.some((s) => /manual/i.test(s.action));
  if (!hasManualTest) out.push({ ...steps[autoAt], action: 'Only after the cause is found and fixed: test in MANUAL and watch the reading that caused the alarm', keySequence: ['MANUAL', 'START'], expectedResponse: 'Runs normally with no alarm' });
  out.push({ ...steps[autoAt], action: 'Warn anyone near the set, then select AUTO: in AUTO it can start and take load at any moment without warning', keySequence: ['AUTO'], expectedResponse: 'Ready for automatic operation' });
  out.push(...steps.slice(autoAt + 1));
  return out.map((s, i) => ('stepNumber' in s ? { ...s, stepNumber: i + 1 } : s));
}
const OIL_STOP = 'Stop the engine: running with low oil pressure can destroy the bearings in minutes. Do not restart until the cause is found.';
function withSafety(c: ControllerFaultCode): ControllerFaultCode {
  const text = `${c.title} ${c.subcategory}`.toLowerCase();
  const coolant = /coolant|radiator|water temp|engine temp|overheat|high temp/.test(text);
  const lowOil = /oil pressure/.test(text) && /\b(low|under|below)/.test(text);
  const add: string[] = [];
  const has = (re: RegExp) => (c.safetyWarnings || []).some((w) => re.test(w));
  if (coolant && !has(/cap|cool (down|first)|let it cool/i)) add.push(COOL_DOWN);
  if (lowOil && !has(/stop the engine/i)) add.push(OIL_STOP);
  for (const w of J1939_SAFETY.get(c.code.toUpperCase()) || []) if (!has(new RegExp(w.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) && !add.includes(w)) add.push(w);
  const topic = TOPIC_SAFETY.find(([re]) => re.test(`${c.title} ${c.subcategory} ${c.category}`));
  if (topic) for (const w of topic[1]) if (!has(new RegExp(w.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) && !add.includes(w)) add.push(w);
  const touchesCoolant = (s: string) => /coolant level|top up|radiator cap|expansion tank|add coolant/i.test(s) && !/\bcool(ed)?\b.*(engine|first)|engine.*\bcool(ed)?\b|let .* cool/i.test(s);
  const steps = (c.diagnosticSteps || []).map((st) => (touchesCoolant(st.action) ? { ...st, action: `With the engine stopped and cool: ${st.action}` } : st));
  // One severity per J1939 code: a controller entry written as an SPN/FMI
  // takes the reference row's severity (2026-10-27 audit: SPN 94 FMI 1 and
  // SPN 96 FMI 17/18 showed two severities in one result list).
  const j1939Severity = /^SPN\d+-FMI\d+$/i.test(c.code) ? J1939_SEVERITY.get(c.code.toUpperCase()) : undefined;
  return {
    ...c,
    ...(j1939Severity ? { severity: j1939Severity } : {}),
    // The generic one-liner goes once a specific warning is present.
    safetyWarnings: [...add, ...(c.safetyWarnings || []).filter((w) => !(add.length && GENERIC_SAFETY.test(w.trim())))],
    diagnosticSteps: steps,
    resetPathways: (c.resetPathways || []).map((p) => ({
      ...p,
      ...(p.requiresCondition ? { requiresCondition: p.requiresCondition.map(conditionText) } : {}),
      steps: safeResetSteps((p.steps || []).map((s) => cleanResetStep(s, c.brand))),
    })),
    // Repair times, difficulty and costs in the brand files were generated
    // from severity ("1-4 hours" for every shutdown), not from the fault, so
    // they are not shown (2026-10-27 audit).
    solutions: (c.solutions || []).map((s) => ({ ...s, timeEstimate: '', estimatedCost: { min: 0, max: 0, currency: '' } })),
    // "2024-01-15" was a template placeholder on every entry, not a review date.
    lastUpdated: c.lastUpdated === '2024-01-15' ? '2026-10-27' : c.lastUpdated,
  };
}

/**
 * Key sequences without invented hold times ("RESET (3s)", "hold for 5
 * seconds" were templated, not from the manuals), and DSE's reset named as
 * the module's Stop/Reset button (2026-10-27 audit).
 */
const HOLD = /\s*\(?\s*(?:hold\s*(?:for\s*)?)?\d+\s*(?:s|sec|secs|seconds)\b\s*(?:hold)?\s*\)?/gi;
function cleanResetStep<T extends { action: string; keySequence?: string[] }>(s: T, brand: string): T {
  const dse = /deepsea/i.test(brand);
  let action = s.action.replace(/press and hold\s+/i, 'Press ').replace(/\s+for\s+\d+\s*(?:s|sec|secs|seconds)\b/i, '').replace(HOLD, '');
  if (dse) action = action.replace(/\bRESET\b/g, 'Stop/Reset');
  const keySequence = s.keySequence?.map((k) => {
    const out = k.replace(HOLD, '').trim();
    return dse && /^RESET$/i.test(out) ? 'Stop/Reset' : out;
  });
  return { ...s, action, ...(keySequence ? { keySequence } : {}) };
}
let _controllers: ControllerFaultCode[] | null = null;
function controllersAll(): ControllerFaultCode[] {
  if (!_controllers) _controllers = getAllFaultCodes().map(withSafety);
  return _controllers;
}
function controllersByBrand(brand: string): ControllerFaultCode[] {
  return getFaultCodesByBrand(brand).map(withSafety);
}

let _all: ControllerFaultCode[] | null = null;
/** Controller alarms + J1939 reference. */
function indexAll(): ControllerFaultCode[] {
  if (!_all) _all = [...controllersAll(), ...j1939Rows()];
  return _all;
}

function indexByBrand(brand: string): ControllerFaultCode[] {
  if (resolveBrandFilterText(brand) === J1939_BRAND.toLowerCase()) return j1939Rows();
  return controllersByBrand(brand);
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
/** Words that describe how a fault shows rather than what it is. */
const GENERIC_TERMS = new Set(['shutdown', 'shut', 'alarm', 'fault', 'problem', 'warn', 'warning', 'trip', 'stop', 'error', 'issu', 'issue', 'morn', 'morning', 'start', 'run', 'high', 'low', 'too', 'very']);

/** Title words that mean the same thing to a technician (search ranking only). */
const TITLE_EQUIV: Record<string, string[]> = {
  overheat: ['overheat', 'temperature', 'temp'],
  signal: ['signal', 'sensor', 'pickup', 'mpu'],
  loss: ['loss', 'lost', 'fail'],
  lost: ['loss', 'lost', 'fail'],
  high: ['high', 'over'],
  low: ['low', 'under'],
  // "voltage drops / dips" is an under-voltage (2026-10-29 audit).
  drop: ['low', 'under'],
  dip: ['low', 'under'],
  speed: ['speed', 'rpm'],
  smoke: ['smoke', 'exhaust'],
};

export function normalizeCodeQuery(q: string): string | null {
  // A brand word typed with the code ("SPN 110 FMI 0 cummins") identifies the
  // engine, not the fault: read the code without it (2026-10-25 audit: the
  // brand word sent the query to word search, which returned SPN 612).
  const s = q.trim().toUpperCase()
    .replace(/\b(CUMMINS|PERKINS|CATERPILLAR|CAT|VOLVO(\s+PENTA)?|DEUTZ|JOHN\s+DEERE|DEERE|MTU|DOOSAN|WEICHAI|FPT|IVECO|SCANIA|KOHLER|FG\s+WILSON|ENGINE|GENERATOR|CODE|FAULT)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
  if (!s) return null;
  // "FMI 0 SPN 110": the same code written FMI first (2026-10-27 audit).
  const rev = s.match(/^FMI\s*[:#-]?\s*(\d{1,2})\s*[,/-]?\s*SPN\s*[:#-]?\s*(\d+)$/);
  if (rev) return `SPN${+rev[2]}-FMI${+rev[1]}`;
  // "110 0": a three-or-more-digit SPN and an FMI separated by a space.
  const sp = s.match(/^(\d{3,6})\s+(\d{1,2})$/);
  if (sp) return `SPN${+sp[1]}-FMI${+sp[2]}`;
  // "110.0": some service tools print SPN.FMI.
  const dot = s.match(/^(\d{2,6})\.(\d{1,2})$/);
  if (dot) return `SPN${+dot[1]}-FMI${+dot[2]}`;
  let m = s.match(/^MID\s*[:#-]?\s*(\d+)\s*[,/-]?\s*PID\s*[:#-]?\s*(\d+)\s*[,/-]?\s*FMI\s*[:#-]?\s*(\d+)$/);
  if (m) return `MID${+m[1]}-PID${+m[2]}-FMI${+m[3]}`;
  // "SPN629FMI12" (no separator) is written down as often as "SPN 629 FMI 12".
  m = s.match(/^SPN\s*[:#-]?\s*(\d+)\s*(?:[,/-]\s*|\s+|(?=FMI))(?:FMI\s*[:#-]?\s*)?(\d+)$/);
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
  // Our own reference numbers are not on any display, so a typed code never
  // matches them; those alarms are found by their text (2026-10-20 audit: "E001"
  // returned four unrelated alarms from four brands).
  // Whole code or a whole segment of it, never a substring: "12" matched
  // "MID128" and answered with an oil-pressure shutdown (2026-10-27 audit).
  const codeHit = codeKindOf(c) !== 'reference' && (code === q || code.split('-').includes(q));
  // A number is a code, not text: "42" matched the model name "HGM420" and
  // listed 44 SmartGen alarms (2026-10-29 audit).
  if (/^\d+$/.test(q)) return codeHit;
  return (
    codeHit ||
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.brand.toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.subcategory.toLowerCase().includes(q)
  );
}

// ── Multi-word queries (2026-10-19 re-audit) ────────────────────────────────
// "DSE low oil pressure" used to be matched as ONE substring, so it found
// nothing. Brand words become a brand filter; every other word must match.
const BRAND_ALIASES: Record<string, string> = {
  dse: 'deepsea electronics', deepsea: 'deepsea electronics', comap: 'comap', woodward: 'woodward',
  smartgen: 'smartgen', powerwizard: 'cat powerwizard', datakom: 'datakom', lovato: 'lovato electric',
  siemens: 'siemens', enko: 'enko', vodia: 'volvo penta vodia',
};
// "generator", "engine" and "genset" are in nearly every title, so they are
// not search words (2026-10-27 audit: "generator overheating" listed
// Generator Over Current and Generator Under Voltage).
const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'on', 'in', 'my', 'is', 'it', 'to', 'for', 'with', 'fault', 'code', 'alarm', 'error', 'controller', 'generator', 'genset', 'gen', 'engine', 'set', 'our', 'has', 'have', 'keeps', 'keep']);

/** Light stemming so "starting" finds "start" and "pressures" finds "pressure". */
function searchStem(w: string): string {
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
  return w;
}

interface ParsedQuery { brand: string | null; words: string[] }
function parseWords(q: string): ParsedQuery {
  let brand: string | null = null;
  const words: string[] = [];
  for (const w of q.split(/[^a-z0-9.+-]+/).filter(Boolean)) {
    if (!brand && BRAND_ALIASES[w]) { brand = BRAND_ALIASES[w]; continue; }
    if (STOP_WORDS.has(w) || w.length < 2) continue;
    words.push(searchStem(w));
  }
  return { brand, words };
}

function haystack(c: ControllerFaultCode): string {
  return [codeKindOf(c) === 'reference' ? '' : c.code, c.title, c.description, c.model, c.category, c.subcategory].join(' ').toLowerCase();
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
  /** Why nothing was searched, when the code cannot exist (e.g. FMI above 31). */
  notice?: string;
}

// Words technicians type that the alarm titles do not use (2026-10-20 audit):
// "overcrank" found nothing although every controller has a crank-fail alarm.
// Used only when the typed word itself matches nothing.
const SEARCH_SYNONYMS: Record<string, string> = {
  overcrank: 'crank', overcranking: 'crank', 'over crank': 'crank',
  overheating: 'temperature', overheat: 'temperature', 'over heating': 'temperature',
  'no start': 'fail to start', 'wont start': 'fail to start', "won't start": 'fail to start',
  fluctuating: 'voltage', hunting: 'speed', surging: 'speed',
};

/**
 * Engine-maker fault numbers ("Cummins 111") mapped to the J1939 SPN/FMI they
 * are reported as, from the curated table (lib/data/faultCodes.ts). Without
 * this, "Cummins 111" matched SPN 111 (coolant level) — a different fault
 * (2026-10-20 audit).
 */
/*
 * Common Cummins genset fault numbers and the J1939 SPN/FMI they are reported
 * as (Cummins electronic-engine fault code tables, QSB/QSL/QSK/QSX families).
 * 2026-10-27 audit: only 111 and 115 were mapped, so 151, 143, 415, 234 and
 * 1117 returned "not found". Only mappings we are sure of are listed.
 */
const CUMMINS_TO_J1939: Record<string, string> = {
  '111': 'SPN 629 FMI 12', '115': 'SPN 612 FMI 2',
  '122': 'SPN 102 FMI 3', '123': 'SPN 102 FMI 4', '124': 'SPN 102 FMI 16',
  '135': 'SPN 100 FMI 3', '141': 'SPN 100 FMI 4', '143': 'SPN 100 FMI 18', '415': 'SPN 100 FMI 1',
  '144': 'SPN 110 FMI 3', '145': 'SPN 110 FMI 4', '146': 'SPN 110 FMI 16', '151': 'SPN 110 FMI 0',
  '153': 'SPN 105 FMI 3', '154': 'SPN 105 FMI 4', '155': 'SPN 105 FMI 0',
  '195': 'SPN 111 FMI 3', '196': 'SPN 111 FMI 4', '197': 'SPN 111 FMI 18', '235': 'SPN 111 FMI 1',
  '234': 'SPN 190 FMI 0', '689': 'SPN 190 FMI 2',
  '418': 'SPN 97 FMI 15', '428': 'SPN 97 FMI 3', '429': 'SPN 97 FMI 4',
  '441': 'SPN 168 FMI 18', '442': 'SPN 168 FMI 16',
  '1117': 'SPN 627 FMI 2', '2215': 'SPN 94 FMI 18', '2973': 'SPN 102 FMI 2',
};

const MAKER_CODE_TO_J1939: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const [n, j] of Object.entries(CUMMINS_TO_J1939)) out[`cummins ${n}`] = j;
  for (const c of CURATED_ENGINE_CODES) {
    const m = /^(CUMMINS|PERKINS)-(\d+)$/i.exec(c.code);
    const j = /SPN\s*(\d+)\s*FMI\s*(\d+)/i.exec(c.title);
    if (m && j) out[`${m[1].toLowerCase()} ${m[2]}`] = `SPN ${j[1]} FMI ${j[2]}`;
    // Perkins electronic engines report the J1939 SPN number itself
    // ("Perkins 100" = SPN 100, oil pressure): every FMI of that SPN.
    else if (m && m[1].toUpperCase() === 'PERKINS') out[`perkins ${m[2]}`] = `SPN ${m[2]}`;
  }
  return out;
})();

/** A 1-2 digit number or a negative number is not a fault code (as the chat says; 2026-10-29 audit). */
function tooShortCode(q: string): boolean {
  return /^-\d+$/.test(q) || /^\d{1,2}$/.test(q);
}
/**
 * Why a J1939 / J1587 code cannot exist, or null. SAE J1939 SPNs are 19-bit
 * (0-524287) and FMIs run 0-31; neither is ever negative. "SPN -5" was read
 * as SPN 5 and FMI 45 quietly found nothing (2026-10-29 audit).
 */
export function invalidCodeReason(q: string): string | null {
  const s = (q || '').trim().toUpperCase();
  if (/\b(SPN|FMI|PID|MID)\s+-\s*\d/.test(s) || /\b(SPN|FMI|PID|MID)\s*[:#]\s*-\s*\d/.test(s)) {
    return 'SPN, FMI, PID and MID numbers are never negative. Check the code on the display.';
  }
  const n = normalizeCodeQuery(q);
  const m = n ? /^SPN(\d+)-(?:FMI(\d+))?$/.exec(n) : null;
  if (m && Number(m[1]) > 524287) return `SPN ${m[1]} is not possible: J1939 SPNs run from 0 to 524287. Check the code on the display.`;
  if (m && m[2] != null && Number(m[2]) > 31) return `FMI ${m[2]} is not possible: J1939 FMIs run from 0 to 31. Check the code on the display.`;
  const j = n ? /^MID\d+-PID\d+-FMI(\d+)$/.exec(n) : null;
  if (j && Number(j[1]) > 31) return `FMI ${j[1]} is not possible: FMIs run from 0 to 31. Check the code on the display.`;
  return null;
}
/** The text when it is a fault code (J1939/J1587 forms, maker numbers, controller codes), else null. */
export function codeLikeQuery(text: string | undefined | null): string | null {
  const t = (text || '').trim();
  if (!t || t.length > 40 || tooShortCode(t) || invalidCodeReason(t)) return null;
  if (normalizeCodeQuery(t)) return t;
  if (/^(cummins|perkins)\s*(?:fault\s*)?(?:code\s*)?\d{2,4}$/i.test(t)) return t;
  if (/^[a-z]{0,3}[- ]?\d{3,5}$/i.test(t)) return t;
  return null;
}
function emptySearch(opts: SearchOptions): SearchResponse {
  const pageSize = Math.max(1, Math.min(100, Math.floor(opts.pageSize ?? 20)));
  return {
    query: (opts.query || '').trim(), interpretedAs: null,
    filters: { brand: opts.brand, model: opts.model, severity: opts.severity, category: opts.category, verifiedOnly: opts.verifiedOnly },
    page: 1, pageSize, total: 0, totalPages: 1, results: [], source: 'index',
  };
}

export function searchIndex(opts: SearchOptions): SearchResponse {
  if (tooShortCode((opts.query || '').trim())) return emptySearch(opts);
  const invalid = invalidCodeReason(opts.query || '');
  if (invalid) return { ...emptySearch(opts), notice: invalid };
  const maker = /^(cummins|perkins)\s*(?:fault\s*)?(?:code\s*)?(\d{2,4})$/i.exec((opts.query || '').trim());
  if (maker) {
    const mapped = MAKER_CODE_TO_J1939[`${maker[1].toLowerCase()} ${maker[2]}`];
    if (mapped) return { ...searchIndex({ ...opts, query: mapped }), query: (opts.query || '').trim(), interpretedAs: `${maker[1]} ${maker[2]} = ${mapped}` };
    // A maker's fault number we have not mapped is "not found", never the whole
    // catalogue: "Cummins 146" returned 896 rows led by SPN 100 (2026-10-25 audit).
    const pageSize = Math.max(1, Math.min(100, Math.floor(opts.pageSize ?? 20)));
    return {
      query: (opts.query || '').trim(), interpretedAs: null,
      filters: { brand: opts.brand, model: opts.model, severity: opts.severity, category: opts.category, verifiedOnly: opts.verifiedOnly },
      page: 1, pageSize, total: 0, totalPages: 1, results: [], source: 'index',
    };
  }
  const typed = (opts.query || '').trim();
  // Words with no digits are a description, not a code: rank them with the
  // same symptom engine the chat uses, so the page and the chat agree
  // (2026-10-27 audit: "generator overheating" was right in chat and listed
  // electrical alarms on the page; "Fail to start" the other way round).
  if (typed && /[a-z]/i.test(typed) && !/\d/.test(typed) && !normalizeCodeQuery(typed)) {
    const byWords = searchByWords(typed, opts);
    if (byWords.total > 0) return byWords;
    // Technicians' words the titles do not use ("surging", "overcrank"): retry
    // with the synonym (2026-10-29 audit: "surging" found nothing anywhere).
    const lower = typed.toLowerCase();
    const alt = SEARCH_SYNONYMS[lower] ?? lower.split(/\s+/).map((w) => SEARCH_SYNONYMS[w] ?? w).join(' ');
    if (alt !== lower) return { ...searchByWords(alt, opts), query: typed, interpretedAs: `read as "${alt}"` };
    return byWords;
  }
  const syn = SEARCH_SYNONYMS[typed.toLowerCase()];
  if (syn && opts.query !== syn && searchIndexRaw({ ...opts, page: 1, pageSize: 1 }).total === 0) {
    return { ...searchIndexRaw({ ...opts, query: syn }), query: typed };
  }
  return searchIndexRaw(opts);
}

/**
 * Text search: controller alarms ranked by the symptom engine, then any
 * J1939 reference rows whose titles carry the same words. An alarm name
 * typed exactly ("Low Oil Pressure") ranks first because title words score
 * highest in the symptom engine.
 */
function searchByWords(typed: string, opts: SearchOptions): SearchResponse {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(opts.pageSize ?? 20)));
  // A controller brand typed with the words ("DSE low oil pressure") filters
  // the results; a brand on its own lists that brand's alarms.
  const pw = parseWords(typed.toLowerCase());
  if (pw.brand && pw.words.length === 0) return searchIndexRaw(opts);
  const words = typed.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w && !BRAND_ALIASES[w]).join(' ');
  const d = diagnoseFromSymptoms({ symptoms: [words], brand: opts.brand, model: opts.model, category: opts.category, topN: 50 });
  const core = words.split(/[^a-z0-9]+/).filter((w) => w && !STOP_WORDS.has(w)).join(' ');
  const ranked = pw.brand ? d.ranked.filter((r) => r.brand.toLowerCase() === pw.brand) : d.ranked;
  const seen = new Set(ranked.map((r) => r.id));
  const merged: SearchResultItem[] = ranked.map(({ score: _s, matchedTerms: _m, ...r }) => r);
  if (core && !pw.brand) {
    const raw = searchIndexRaw({ ...opts, query: core, page: 1, pageSize: 100 });
    for (const r of raw.results) if (r.source === 'j1939-reference' && !seen.has(r.id)) { merged.push(r); seen.add(r.id); }
  }
  const filtered = opts.severity ? merged.filter((r) => r.severity === opts.severity) : merged;
  const total = filtered.length;
  return {
    query: typed,
    interpretedAs: null,
    filters: { brand: opts.brand, model: opts.model, severity: opts.severity, category: opts.category, verifiedOnly: opts.verifiedOnly },
    page, pageSize, total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    results: filtered.slice((page - 1) * pageSize, page * pageSize),
    source: 'index',
  };
}

function searchIndexRaw(opts: SearchOptions): SearchResponse {
  const query = (opts.query || '').trim();
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(opts.pageSize ?? 20)));
  const q = query.toLowerCase();
  const canonical = query ? normalizeCodeQuery(query) : null;

  const base = opts.brand ? indexByBrand(opts.brand) : indexAll();
  let filtered: ControllerFaultCode[];
  const parsed = !canonical && /\s/.test(q) ? parseWords(q) : null;
  if (parsed && (parsed.brand || parsed.words.length > 1)) {
    const pool = parsed.brand ? base.filter((c) => c.brand.toLowerCase() === parsed.brand) : base;
    // Title words count first: a word at the start of a title word ("speed" in
    // "Over Speed", not in "Underspeed") says what the alarm is; prose only
    // mentions it (2026-10-25 audit: "Loss of speed signal" led with an
    // overvoltage alarm, "Over speed" listed Underspeed second).
    const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRes = parsed.words.map((w) => new RegExp(`\\b${esc(w)}`));
    const scored = pool.map((c) => {
      const h = haystack(c);
      const t = c.title.toLowerCase();
      return { c, hits: parsed.words.filter((w) => h.includes(w)).length, titleHits: wordRes.filter((re) => re.test(t)).length };
    });
    const need = parsed.words.length;
    const byTitle = (a: { hits: number; titleHits: number }, b: { hits: number; titleHits: number }) => b.titleHits - a.titleHits || b.hits - a.hits;
    // Every word somewhere is not enough when none of them is in the title.
    const all = scored.filter((s) => s.hits === need && (s.titleHits > 0 || need === 1)).sort(byTitle);
    // Nothing matches every word: show the closest (at least half the words,
    // and at least one of them in the title).
    const best = all.length ? all : scored.filter((s) => need > 0 && s.hits >= Math.ceil(need / 2) && s.titleHits > 0).sort(byTitle);
    filtered = (need === 0 ? pool : best.map((s) => s.c));
  } else {
    filtered = query ? base.filter((c) => matchesQuery(c, q, canonical)) : base;
  }
  filtered = applyFilters(filtered, opts);

  // Exact code first, then code-prefix matches, then controller entries before
  // the generic J1939 reference (a brand-specific description says more).
  if (q) {
    const rank = (c: ControllerFaultCode) => {
      const code = c.code.toLowerCase();
      return code === q || (canonical && code === canonical.toLowerCase()) ? 0 : code.startsWith(q) ? 1 : 2;
    };
    // "low oil pressure" should list FMI 1/17/18 (below normal) before FMI 0
    // ("above normal"); "high …" the reverse (2026-10-19 re-audit).
    const wantsLow = /\blow\b/.test(q), wantsHigh = /\bhigh\b/.test(q);
    const direction = (c: ControllerFaultCode) => {
      if (wantsLow === wantsHigh) return 0;
      const m = /FMI(\d+)$/.exec(c.code);
      if (!m) return 0;
      const fmi = Number(m[1]);
      const low = fmi === 1 || fmi === 17 || fmi === 18 || fmi === 21;
      const high = fmi === 0 || fmi === 15 || fmi === 16 || fmi === 20;
      return (wantsLow ? low : high) ? 0 : (wantsLow ? high : low) ? 2 : 1;
    };
    // Title relevance, for one word or several, with the words technicians use
    // interchangeably (2026-10-25 audit: "overheating" listed Low Coolant Level
    // and Over Current first; "loss of speed signal" led with voltage sensing;
    // "generator high voltage" led with Sync Voltage Difference).
    const qWords = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !['the', 'and', 'for', 'with', 'generator', 'engine'].includes(w));
    const alts = (w: string): string[] => TITLE_EQUIV[w] ?? Object.entries(TITLE_EQUIV).find(([k]) => w.startsWith(k))?.[1] ?? [w];
    const mentionsGrid = /\b(mains|sync|bus|utility|grid|battery|batt)\b/.test(q);
    const titleScore = (c: ControllerFaultCode) => {
      const t = c.title.toLowerCase();
      let s = qWords.filter((w) => alts(w).some((a) => new RegExp(`\\b${a}`).test(t))).length;
      if (!mentionsGrid && /\b(mains|sync\w*|bus|utility|battery)\b/.test(t)) s -= 1;
      return s;
    };
    filtered = [...filtered].sort(
      (a, b) => rank(a) - rank(b) || titleScore(b) - titleScore(a) || direction(a) - direction(b) || Number(a.brand === J1939_BRAND) - Number(b.brand === J1939_BRAND),
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
  let raw = code.trim();
  if (!raw || tooShortCode(raw) || invalidCodeReason(raw)) return { found: false, exactMatches: [], partialMatches: [], matchType: 'none', interpretedAs: null };
  // The same maker-number reading as search and chat (2026-10-29 audit:
  // "Cummins 151" found nothing here while search answered SPN 110 FMI 0).
  const maker = /^(cummins|perkins)\s*(?:fault\s*)?(?:code\s*)?(\d{2,4})$/i.exec(raw);
  let makerNote: string | null = null;
  if (maker) {
    const mapped = MAKER_CODE_TO_J1939[`${maker[1].toLowerCase()} ${maker[2]}`];
    if (!mapped) return { found: false, exactMatches: [], partialMatches: [], matchType: 'none', interpretedAs: null };
    makerNote = `${maker[1]} ${maker[2]} = ${mapped}`;
    raw = mapped;
  }
  const canonical = normalizeCodeQuery(raw);
  const wanted = (canonical && !canonical.endsWith('-') ? canonical : raw).toLowerCase();
  const withKind = (c: ControllerFaultCode) => ({ ...c, codeKind: codeKindOf(c) });

  const pool = brand ? indexByBrand(brand) : indexAll();

  const byId = pool.find((c) => c.id.toLowerCase() === raw.toLowerCase());
  if (byId) return { found: true, exactMatches: [withKind(byId)], partialMatches: [], matchType: 'exact', interpretedAs: canonical };

  // Our own reference numbers (E001 ...) are not on any display, so they are
  // never "exact" matches; partial matches are whole code segments, never
  // substrings (2026-10-29 audit: E001 gave 4 brands; "42" matched SPN3242).
  const real = pool.filter((c) => codeKindOf(c) !== 'reference');
  const exact = real.filter((c) => c.code.toLowerCase() === wanted);
  const interpretedAs = makerNote ?? canonical;
  if (exact.length > 0) {
    // Brand-specific descriptions before the generic J1939 reference.
    exact.sort((a, b) => Number(a.brand === J1939_BRAND) - Number(b.brand === J1939_BRAND));
    return { found: true, exactMatches: exact.slice(0, 25).map(withKind), partialMatches: [], matchType: 'exact', interpretedAs };
  }

  const prefix = canonical && canonical.endsWith('-') ? canonical.toLowerCase() : null;
  const partial = real
    .filter((c) => (prefix ? c.code.toLowerCase().startsWith(prefix) : c.code.toLowerCase().split('-').includes(wanted)))
    .slice(0, 25)
    .map(SLIM_FIELDS);

  return {
    found: partial.length > 0,
    exactMatches: [],
    partialMatches: partial,
    matchType: partial.length > 0 ? 'partial' : 'none',
    interpretedAs,
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
  /** Every specific word in the title or symptom list (not only the body). */
  allKeyStrong?: boolean;
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
/** Words of a title or text without fillers, so "Fail to Start" holds the pair (fail, start) (2026-10-27). */
function contentWords(s: string): string[] {
  return words(s).filter((t) => !STOP_STEMS.has(t));
}

function tokenize(s: string): string[] {
  // "under load" says when the symptom happens, not that something is under
  // range: it must not pull in Under Frequency / Under Voltage (2026-10-25).
  const cleaned = s.replace(/\bunder\s+(?=(?:full\s+|heavy\s+|high\s+|light\s+)?load\b)/gi, '');
  return words(cleaned).filter((t) => t.length >= 3 && !STOP_STEMS.has(t));
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

function rankGuides(terms: string[], pairs: [string, string][], expanded: Set<string> = new Set(), dir: 'high' | 'low' | null = null): RankedGuide[] {
  // Words that say how a fault shows, not what it is, cannot carry a guide on
  // their own (2026-10-25 audit: "overspeed shutdown" led with Low Oil
  // Pressure Shutdown on the word "shutdown").
  const specific = terms.filter((x) => !GENERIC_TERMS.has(x));
  const out: (RankedGuide & { titleHit: boolean })[] = [];
  for (const a of REPAIR_ARTICLES as RepairArticle[]) {
    if (!GENERATOR_HUBS.has(a.hub)) continue;
    const title = contentWords(a.header.title);
    const sym = Object.values(a.symptoms).flat().join(' ');
    const symWords = contentWords(sym);
    const body = contentWords(a.directAnswer);
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
    // Synonyms ("fluctuating" -> unstable, hunting) count at half weight.
    for (const x of expanded) {
      if (titleSet.has(x)) score += 2;
      else if (symSet.has(x)) score += 1;
    }
    // A guide must match more than one weak word to be worth showing, and
    // must name the problem in its title or symptom list, not only in its
    // body (2026-10-25 audit: "overheating" listed Low Oil Pressure Shutdown).
    const enough = matched.length >= Math.min(2, terms.length) || score >= 6;
    const key = specific.length ? specific : terms;
    // Several specific words typed: a guide needs two of them, or one in its title.
    const keyHits = key.filter((x) => titleSet.has(x) || symSet.has(x)).length;
    const enoughKey = key.length < 2 || keyHits >= 2 || key.some((x) => titleSet.has(x));
    const strong = key.some((x) => titleSet.has(x) || symSet.has(x))
      || pairs.some((p) => containsPair(title, p) || containsPair(symWords, p))
      || [...expanded].some((x) => titleSet.has(x));
    let titleHit = key.some((x) => titleSet.has(x)) || [...expanded].some((x) => titleSet.has(x)) || pairs.some((p) => containsPair(title, p));
    // Direction: "voltage too high" is not "Produces No Voltage".
    const rawTitle = a.header.title.toLowerCase();
    // A guide about another fluid is not an answer: "low coolant level" listed
    // the low-oil-pressure guide, "ComAp Sd Water Temp" a fuel guide (2026-10-27).
    const FLUIDS = ['coolant', 'oil', 'fuel', 'water'];
    const askedFluids = FLUIDS.filter((fl) => terms.includes(fl));
    const titleFluids = FLUIDS.filter((fl) => new RegExp(`\\b${fl}\\b`).test(rawTitle));
    if (askedFluids.length && titleFluids.length && !titleFluids.some((fl) => askedFluids.includes(fl))) continue;
    if (dir === 'high' && /\b(no|low|under|loss)\b/.test(rawTitle)) { titleHit = false; score -= 6; }
    if (dir === 'low' && /\b(over|high)\b/.test(rawTitle)) { titleHit = false; score -= 6; }
    if (score > 0 && enough && strong && enoughKey) {
      out.push({
        title: a.header.title,
        url: `/repair-centre/${a.hub}/${a.slug}`,
        hub: a.hub,
        summary: a.directAnswer.length > 280 ? `${a.directAnswer.slice(0, 277).replace(/\s+\S*$/, '')}…` : a.directAnswer,
        score,
        matchedTerms: matched,
        titleHit,
        // Every specific word is in the title or the symptom list, not only the body.
        allKeyStrong: key.every((x) => titleSet.has(x) || symSet.has(x))
          // ...and the title is about the question: one specific word or synonym in it.
          && (key.some((x) => titleSet.has(x)) || [...expanded].some((x) => titleSet.has(x))),
      });
    }
  }
  // Guides whose title names the problem lead ("Cranks But Will Not Start"
  // before "Valve Train and Clearances" for "hard starting").
  const sorted = out.sort((x, y) => Number(y.titleHit) - Number(x.titleHit) || y.score - x.score);
  // Only guides that are about the problem: when none names it in its title,
  // at most one strong match; otherwise the named ones plus close seconds
  // (2026-10-25 audit: "loss of speed signal" listed Abnormal Noise, No
  // Voltage and Valve Train).
  const top = sorted[0]?.score ?? 0;
  // When a guide names the problem in its title, only such guides are shown
  // (2026-10-27 audit: a turbocharger guide rode along on every oil-pressure query).
  const kept = sorted.some((g) => g.titleHit)
    ? sorted.filter((g) => g.titleHit)
    : sorted.filter((g) => g.score >= 8).slice(0, 1);
  void top;
  return kept
    .slice(0, 3)
    .map(({ titleHit: _t, ...g }) => g);
}

/**
 * Phrases a client types, rewritten into the words the alarms and guides use
 * (2026-10-27 audit: "no power" matched Reverse Power, "won't start" and
 * "fail to start" found Fail to Stop first, "knocking" missed Abnormal Noise).
 */
const PHRASES: [RegExp, string][] = [
  [/\b(no|zero)\s+(power|output|electricity)\b/gi, 'no voltage output excitation'],
  [/\b(won'?t|wont|will\s+not|cannot|can'?t|does\s+not|doesn'?t|not)\s+start(ing)?\b/gi, 'fail to start crank'],
  [/\bfail(s|ed|ure)?\s+to\s+start\b/gi, 'fail to start crank'],
  [/\b(won'?t|wont|will\s+not|does\s+not|doesn'?t)\s+stop\b/gi, 'fail to stop'],
  // Words technicians use that the guides and alarm titles do not (2026-10-29 audit:
  // "surging" found nothing anywhere).
  [/\bsurg(e|es|ing)\b/gi, 'hunting speed unstable'],
  [/\b(keeps?\s+)?(dying|dies|dead|flat)\b/gi, 'not charging low'],
];
function rewritePhrases(s: string): string {
  let out = s;
  for (const [re, to] of PHRASES) out = out.replace(re, to);
  return out;
}

export function diagnoseFromSymptoms(input: DiagnoseInput): DiagnoseResponse {
  const topN = Math.max(1, Math.min(50, input.topN ?? 10));
  input = { ...input, symptoms: (input.symptoms || []).map(rewritePhrases), alarmText: input.alarmText ? rewritePhrases(input.alarmText) : input.alarmText };
  const terms = Array.from(
    new Set(
      [
        ...(input.symptoms || []).flatMap(tokenize),
        ...(input.alarmText ? tokenize(input.alarmText) : []),
      ],
    ),
  );

  // Symptom words that alarm titles do not use expand to the words they do
  // (2026-10-20 audit: "overheating" ranked Generator Over Current first and
  // "voltage fluctuating" found nothing). Expanded words score at half weight
  // and do not count towards the two-word evidence threshold on their own.
  const EXPAND: Record<string, string[]> = {
    knock: ['nois', 'abnormal'],
    nois: ['abnormal'],
    overheat: ['coolant', 'temperatur'],
    hot: ['coolant', 'temperatur'],
    overcrank: ['crank', 'fail'],
    hard: ['crank'],
    fluctuat: ['unstabl', 'frequency', 'regulation', 'regulator', 'hunt'],
    unstabl: ['frequency', 'regulation', 'regulator', 'hunt'],
    hunt: ['speed', 'governor', 'unstabl'],
    surg: ['speed', 'governor', 'unstabl'],
    // "voltage drops / dips when a load starts" is an under-voltage (2026-10-29
    // audit: it led with Battery Voltage Low, then Mains Under Voltage).
    drop: ['under', 'low'],
    dip: ['under', 'low'],
  };
  const expanded = new Set<string>();
  for (const t of terms) for (const e of EXPAND[t] || []) if (!terms.includes(e)) expanded.add(e);

  const filters: SearchFilters = {
    brand: input.brand,
    model: input.model,
    category: input.category,
  };

  // Symptom diagnosis works on the controller alarm descriptions: they carry
  // symptoms and ranked causes. The J1939 reference has neither, so it would
  // only add keyword noise here; it is reached through code lookup instead.
  const pool = input.brand ? controllersByBrand(input.brand) : controllersAll();
  const filtered = applyFilters(pool, filters);
  const phrases = [...(input.symptoms || []), ...(input.alarmText ? [input.alarmText] : [])];
  const pairs = phrasePairs(phrases);

  // No words to match is no answer, not "the first N alarms" (2026-10-27
  // audit: "!!!???" and "0" returned Emergency Stop, Controller Internal Fault…).
  if (terms.length === 0) {
    return {
      input,
      guides: [],
      ranked: [],
      considered: filtered.length,
      source: 'index',
      notes: ['No symptom words to match. Describe what the generator is doing, or type the code shown on the display.'],
    };
  }

  // Score controller alarms against the symptom terms: whole-word (stemmed)
  // matches, with the title and listed symptoms weighted above the prose, and a
  // bonus when a whole symptom phrase ("low oil pressure") appears in order.
  const wantsGenVoltage = terms.some((x) => x.startsWith('voltag')) && !terms.some((x) => x.startsWith('batter'));
  const mentionsGrid = terms.some((x) => /^(main|sync|bus|utilit|grid|kplc)/.test(x));
  const typedText = phrases.join(' ').toLowerCase();
  const wantsHighDir = /\b(high|over|too high|excess)/.test(typedText) && !/\b(low|under)\b/.test(typedText);
  const wantsLowDir = /\b(low|under(?! load)|too low|drop)/.test(typedText) && !/\b(high|over)\b/.test(typedText);
  const rankPool = (codes: ControllerFaultCode[]): RankedFault[] => {
    const out: RankedFault[] = [];
    for (const c of codes) {
      const title = contentWords(c.title);
      const symptomWords = contentWords((c.symptoms || []).join(' '));
      const causeWords = contentWords((c.possibleCauses || []).map((p) => p.cause).join(' '));
      const prose = contentWords(`${c.description} ${c.subcategory} ${c.category}`);
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
      let expandedHits = 0;
      for (const t of expanded) {
        if (titleSet.has(t)) { score += 2; expandedHits++; }
        else if (symSet.has(t) || proseSet.has(t)) { score += 0.5; expandedHits++; }
      }
      for (const p of pairs) {
        if (containsPair(title, p)) score += 5;
        else if (containsPair(symptomWords, p) || containsPair(prose, p)) score += 3;
      }
      // One weak word in a long description is not evidence.
      if (score === 0 || matched.length + Math.min(1, expandedHits) < Math.min(2, terms.length + Math.min(1, expanded.size))) continue;
      // An alarm must name the problem in its title or listed symptoms, not
      // only in its prose (2026-10-20).
      if (!terms.some((x) => titleSet.has(x) || symSet.has(x)) && !pairs.some((p) => containsPair(title, p)) && !([...expanded].some((x) => titleSet.has(x)))) continue;
      // A voltage question that does not mention the battery is about the
      // generator's output first.
      // Titles are stemmed ("mains" -> "main"), so test the raw title text.
      const rawTitle = c.title.toLowerCase();
      // Battery and starting alarms answer a starting problem, not a running
      // voltage dip; a fixed -10 still left "Battery Voltage Low" first for
      // "voltage drops when AC starts" (2026-10-29 audit), so scale it down.
      if (wantsGenVoltage && /\b(battery|charge|fail to start|crank)/.test(rawTitle)) score = score * 0.2 - 10;
      // A voltage question is answered by voltage alarms first (2026-10-29 audit:
      // "voltage drops when AC starts" led with Battery Low and Fail to Start).
      if (wantsGenVoltage && !/\bvoltag/.test(rawTitle)) score *= 0.4;
      // "Power Supply Voltage" is the controller's DC supply, not the
      // generator's output (2026-10-29: it led "generator voltage low").
      if (wantsGenVoltage && /\bsupply\b/.test(rawTitle) && !/\bsupply\b/.test(typedText)) score *= 0.4;
      // Transformer, turbine and steam alarms are not diesel-genset faults unless
      // asked about (2026-10-29 audit: "high oil consumption" led with a Siemens
      // transformer oil alarm).
      if (/\b(transformer|turbine|steam)\b/.test(rawTitle) && !/\b(transformer|turbine|steam)\b/.test(typedText)) score -= 20;
      // Nor about the mains or synchronising bus unless the user says so
      // (2026-10-25 audit: "voltage too high" led with Sync / Mains Over Voltage).
      if (!mentionsGrid && /\b(mains|sync\w*|bus|utility|grid)\b/.test(rawTitle)) score -= 10;
      // "Reverse power" is a specific protection, not "no power" (2026-10-27).
      if (/\breverse\b/.test(rawTitle) && !/\breverse\b/.test(typedText)) score -= 10;
      // "high" favours over-/high- titles and "low" under-/low- titles.
      const tl = c.title.toLowerCase();
      const titleHigh = /\b(over|high)/.test(tl), titleLow = /\b(under|low)/.test(tl);
      if (wantsHighDir) score += titleHigh ? 3 : titleLow ? -3 : 0;
      if (wantsLowDir) score += titleLow ? 3 : titleHigh ? -3 : 0;
      // A two-word symptom ("black smoke") the alarm never mentions is a
      // weaker match than one it does.
      if (pairs.length && !pairs.some((p) => containsPair(title, p) || containsPair(symptomWords, p) || containsPair(prose, p))) score *= 0.5;
      if (score <= 0) continue; // penalised below any real match
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

  // Only guides that really answer the question: a weak top match (below 11)
  // and runners-up under 70% of the best are left out (2026-10-29 audit:
  // "earth fault" got a CAN-bus guide at 10, "fuel leak" a contamination guide
  // at 9, and a turbocharger guide rode along with oil and charging alarms).
  const guidesAll = rankGuides(terms, pairs, expanded, wantsHighDir ? 'high' : wantsLowDir ? 'low' : null);
  const GENERIC = /^(fault|failur|fail|problem|generat|engin|low|high|alarm|error|warn|issu|keep|not|no)/;
  const specific = terms.filter((x) => !GENERIC.test(x));
  const top = guidesAll[0];
  const topMatched = new Set(top?.matchedTerms ?? []);
  // A weak match must name every specific word in its title: body text alone
  // ("earth" in a CAN-bus guide, "leak" in a contamination guide) is not enough.
  void specific;
  const topOk = !!top && [...topMatched].some((x) => !GENERIC.test(x)) &&
    (top.score >= 11 || !!(top as { allKeyStrong?: boolean }).allKeyStrong);
  const guides = (topOk ? guidesAll.filter((g, i) => i === 0 || g.score >= 0.7 * top!.score) : [])
    .map((g) => ({ ...g, matchedTerms: show(g.matchedTerms) }));
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
    const allRanked = rankPool(applyFilters(controllersAll(), { model: input.model, category: input.category }))
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
