/**
 * Generator Oracle — Server-side fault-code index
 *
 * Wraps the existing client-safe data layer (controllerFaultCodes.ts) with
 * server-only helpers used by /api/generator-oracle/* routes. Keeps the
 * 400,000+ dataset on the server so the browser does not have to ship it.
 *
 * Nothing here mocks or fabricates data; every helper reads from the same
 * brand-curated and template-extended sources already used by the UI.
 */

import 'server-only';

import {
  CONTROLLER_BRANDS,
  FAULT_CATEGORIES,
  getAllFaultCodes,
  getFaultCodesByBrand,
  getFaultCodeById,
  getFaultCodeStats,
  getTotalFaultCodeCount,
  searchFaultCodes,
  type ControllerFaultCode,
} from '@/lib/generator-oracle/controllerFaultCodes';

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
  const direct = (CONTROLLER_BRANDS as Record<string, { name: string } | undefined>)[up];
  if (direct?.name) return direct.name.toLowerCase();
  const lower = raw.toLowerCase();
  for (const v of Object.values(CONTROLLER_BRANDS) as { name: string }[]) {
    if (v.name.toLowerCase().includes(lower)) return v.name.toLowerCase();
  }
  return lower;
}

export type Severity = ControllerFaultCode['severity'];

export interface SearchFilters {
  brand?: string;
  model?: string;
  severity?: Severity;
  category?: string;
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
  brand: string;
  model: string;
  category: string;
  subcategory: string;
  severity: Severity;
  alarmType: ControllerFaultCode['alarmType'];
  title: string;
  description: string;
  verified: boolean;
  source: 'manufacturer-curated' | 'template-extended';
}

const SLIM_FIELDS = (c: ControllerFaultCode): SearchResultItem => ({
  id: c.id,
  code: c.code,
  brand: c.brand,
  model: c.model,
  category: c.category,
  subcategory: c.subcategory,
  severity: c.severity,
  alarmType: c.alarmType,
  title: c.title,
  description: c.description,
  verified: c.verified === true,
  source: c.verified === true ? 'manufacturer-curated' : 'template-extended',
});

// ──────────────────────────────────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────────────────────────────────
export interface HealthReport {
  ok: true;
  generatedAt: string;
  totals: {
    faultCodes: number;
    verifiedCodes: number;
    templateCodes: number;
    brands: number;
    models: number;
    categories: number;
  };
  byBrand: Record<string, number>;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  notes: string[];
}

export function buildHealthReport(): HealthReport {
  const stats = getFaultCodeStats();
  const codes = getAllFaultCodes();
  let verified = 0;
  for (const c of codes) if (c.verified === true) verified++;
  const models = new Set<string>();
  for (const c of codes) models.add(`${c.brand}::${c.model}`);

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    totals: {
      faultCodes: stats.total,
      verifiedCodes: verified,
      templateCodes: stats.total - verified,
      brands: Object.keys(stats.byBrand).length,
      models: models.size,
      categories: Object.keys(stats.byCategory).length,
    },
    byBrand: stats.byBrand,
    bySeverity: stats.bySeverity,
    byCategory: stats.byCategory,
    notes: [
      'manufacturer-curated entries are sourced from individually compiled brand files (DSE, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, ENKO, Volvo Penta VODIA).',
      'template-extended entries are generated from manufacturer-published code-range templates (e.g. DSE 1100-1199 = advanced coolant) to provide structural coverage; treat them as guidance, not verified OEM text.',
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
    out = out.filter((c) => c.model.toLowerCase().includes(m));
  }
  if (f.severity) out = out.filter((c) => c.severity === f.severity);
  if (f.category) {
    const cat = f.category.toLowerCase();
    out = out.filter((c) => c.category.toLowerCase() === cat);
  }
  if (f.verifiedOnly) out = out.filter((c) => c.verified === true);
  return out;
}

export interface SearchResponse {
  query: string;
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

  // Prefer brand-scoped scan when a brand filter is supplied (lazy-loaded).
  const base = opts.brand
    ? getFaultCodesByBrand(opts.brand)
    : query
      ? searchFaultCodes(query)
      : getAllFaultCodes();

  let filtered = base;
  if (opts.brand && query) {
    const q = query.toLowerCase();
    filtered = base.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.subcategory.toLowerCase().includes(q),
    );
  }
  filtered = applyFilters(filtered, opts);

  // Verified-first ordering, then exact-code prefix matches.
  const q = query.toLowerCase();
  filtered.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    if (q) {
      const aExact = a.code.toLowerCase() === q ? 0 : a.code.toLowerCase().startsWith(q) ? 1 : 2;
      const bExact = b.code.toLowerCase() === q ? 0 : b.code.toLowerCase().startsWith(q) ? 1 : 2;
      if (aExact !== bExact) return aExact - bExact;
    }
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize).map(SLIM_FIELDS);

  return {
    query,
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
  exactMatches: ControllerFaultCode[];
  partialMatches: SearchResultItem[];
  matchType: 'exact' | 'partial' | 'none';
}

export function lookupFaultCode(code: string, brand?: string): FaultLookupResponse {
  const wanted = code.trim().toLowerCase();
  if (!wanted) return { found: false, exactMatches: [], partialMatches: [], matchType: 'none' };

  // Try by id first (cheapest)
  const byId = getFaultCodeById(code);
  if (byId) return { found: true, exactMatches: [byId], partialMatches: [], matchType: 'exact' };

  const pool = brand ? getFaultCodesByBrand(brand) : getAllFaultCodes();
  const exact = pool.filter((c) => c.code.toLowerCase() === wanted);
  if (exact.length > 0) {
    exact.sort((a, b) => Number(b.verified) - Number(a.verified));
    return { found: true, exactMatches: exact.slice(0, 25), partialMatches: [], matchType: 'exact' };
  }

  const partial = pool
    .filter((c) => c.code.toLowerCase().includes(wanted))
    .sort((a, b) => Number(b.verified) - Number(a.verified))
    .slice(0, 25)
    .map(SLIM_FIELDS);

  return {
    found: partial.length > 0,
    exactMatches: [],
    partialMatches: partial,
    matchType: partial.length > 0 ? 'partial' : 'none',
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
  const stats = getFaultCodeStats();
  const codes = getAllFaultCodes();
  const verifiedByBrand: Record<string, number> = {};
  for (const c of codes) if (c.verified === true) verifiedByBrand[c.brand] = (verifiedByBrand[c.brand] || 0) + 1;

  return Object.entries(CONTROLLER_BRANDS).map(([key, b]) => ({
    key,
    name: b.name,
    models: b.models,
    color: b.color,
    totalCodes: stats.byBrand[b.name] || 0,
    verifiedCodes: verifiedByBrand[b.name] || 0,
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
    const key = `${c.brand}::${c.model}`;
    let entry = map.get(key);
    if (!entry) {
      entry = { brand: c.brand, model: c.model, totalCodes: 0, verifiedCodes: 0 };
      map.set(key, entry);
    }
    entry.totalCodes++;
    if (c.verified === true) entry.verifiedCodes++;
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

export interface DiagnoseResponse {
  input: DiagnoseInput;
  ranked: RankedFault[];
  considered: number;
  source: 'index';
  notes: string[];
}

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'on', 'off', 'in', 'with', 'for', 'of', 'to', 'at', 'by', 'no',
  'not', 'has', 'have', 'after', 'before', 'when', 'while', 'engine', 'generator', 'unit', 'system',
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length >= 3 && !STOP.has(t));
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

  const pool = input.brand ? getFaultCodesByBrand(input.brand) : getAllFaultCodes();
  const filtered = applyFilters(pool, filters);

  if (terms.length === 0) {
    return {
      input,
      ranked: filtered.slice(0, topN).map((c) => ({ ...SLIM_FIELDS(c), score: 0, matchedTerms: [] })),
      considered: filtered.length,
      source: 'index',
      notes: ['No symptom keywords supplied; returning filter-only matches.'],
    };
  }

  const ranked: RankedFault[] = [];
  for (const c of filtered) {
    const haystack = [
      c.title,
      c.description,
      c.subcategory,
      c.category,
      ...(c.symptoms || []),
      ...(c.possibleCauses || []).map((p) => p.cause),
    ]
      .join(' ')
      .toLowerCase();

    const matched: string[] = [];
    let score = 0;
    for (const t of terms) {
      if (haystack.includes(t)) {
        matched.push(t);
        score += 2;
        if ((c.symptoms || []).some((s) => s.toLowerCase().includes(t))) score += 2;
        if ((c.possibleCauses || []).some((p) => p.cause.toLowerCase().includes(t))) score += 1;
      }
    }
    if (score === 0) continue;
    if (c.verified === true) score += 1;

    ranked.push({ ...SLIM_FIELDS(c), score, matchedTerms: matched });
  }

  ranked.sort((a, b) => b.score - a.score || Number(b.verified) - Number(a.verified));

  return {
    input: { ...input, topN },
    ranked: ranked.slice(0, topN),
    considered: filtered.length,
    source: 'index',
    notes: [
      'Ranking is keyword-overlap based against curated symptoms / causes / titles in the fault index.',
      'Manufacturer-curated entries are boosted; template entries are still returned to widen coverage.',
    ],
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Categories (for filter UIs)
// ──────────────────────────────────────────────────────────────────────────
export function listCategories(): { key: string; name: string; subcategories: string[] }[] {
  return Object.entries(FAULT_CATEGORIES).map(([key, c]) => ({
    key,
    name: c.name,
    subcategories: c.subcategories,
  }));
}
