/**
 * Generator Oracle — Client API
 *
 * Thin, typed fetch wrapper around the six server-side API routes:
 *   GET  /api/generator-oracle/health
 *   GET  /api/generator-oracle/search
 *   GET  /api/generator-oracle/fault-code
 *   GET  /api/generator-oracle/brands
 *   GET  /api/generator-oracle/controllers
 *   POST /api/generator-oracle/diagnose
 *
 * Client components use this module instead of importing the heavy fault-code
 * dataset directly. Every call is paginated, debounced (per-call AbortController
 * support), and returns lightweight JSON — no client memory ever holds more
 * than the current page of results.
 *
 * This file is safe to import from any client component.
 */

import type { ControllerFaultCode } from '../controllerMeta';
import type { TechnicianInput, IntegratedDiagnosisResult } from '../integratedDiagnosticData';

// ============================================================================
// Shared types (mirror the server-side `faultIndex.ts` payloads)
// ============================================================================

export type Severity = 'info' | 'warning' | 'critical' | 'shutdown';
export type AlarmType = 'warning' | 'trip' | 'shutdown' | 'lockout';

export interface SearchResultItem {
  id: string;
  code: string;
  brand: string;
  model: string;
  category: string;
  subcategory: string;
  severity: Severity;
  alarmType: AlarmType;
  title: string;
  description: string;
  verified: boolean;
  source: 'manufacturer-curated' | 'template-extended';
}

export interface SearchOptions {
  query?: string;
  brand?: string;
  model?: string;
  severity?: Severity;
  category?: string;
  verifiedOnly?: boolean;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface SearchResponse {
  ok: true;
  query: string;
  filters: { brand?: string; model?: string; severity?: Severity; category?: string; verifiedOnly?: boolean };
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  results: SearchResultItem[];
  source: 'index';
}

export interface FaultLookupResponse {
  ok: true;
  code: string;
  brand: string | null;
  found: boolean;
  matchType: 'exact' | 'partial' | 'none';
  exactMatches: ControllerFaultCode[];
  partialMatches: SearchResultItem[];
}

export interface BrandSummary {
  key: string;
  name: string;
  models: string[];
  color: string;
  totalCodes: number;
  verifiedCodes: number;
}

export interface BrandsResponse {
  ok: true;
  count: number;
  brands: BrandSummary[];
}

export interface ControllerSummary {
  brand: string;
  model: string;
  totalCodes: number;
  verifiedCodes: number;
}

export interface ControllersResponse {
  ok: true;
  brand: string | null;
  count: number;
  controllers: ControllerSummary[];
}

export interface DiagnoseInput {
  symptoms?: string[];
  brand?: string;
  model?: string;
  category?: string;
  alarmText?: string;
  topN?: number;
  signal?: AbortSignal;
}

export interface RankedFault extends SearchResultItem {
  score: number;
  matchedTerms: string[];
}

export interface DiagnoseResponse {
  ok: true;
  input: Omit<DiagnoseInput, 'signal'>;
  ranked: RankedFault[];
  considered: number;
  source: 'index';
  notes: string[];
}

export interface HealthResponse {
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

export class OracleApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'OracleApiError';
    this.status = status;
    this.payload = payload;
  }
}

// ============================================================================
// Internal helpers
// ============================================================================

const BASE = '/api/generator-oracle';

function buildSearchParams(params: Record<string, string | number | boolean | undefined>): string {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '') continue;
    out.set(k, String(v));
  }
  const s = out.toString();
  return s ? `?${s}` : '';
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, cache: 'no-store' });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok || !(body && typeof body === 'object' && (body as { ok?: unknown }).ok === true)) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${res.status}`;
    throw new OracleApiError(message, res.status, body);
  }
  return body as T;
}

async function postJson<T>(url: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
    cache: 'no-store',
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok || !(body && typeof body === 'object' && (body as { ok?: unknown }).ok === true)) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${res.status}`;
    throw new OracleApiError(message, res.status, body);
  }
  return body as T;
}

// ============================================================================
// Public API
// ============================================================================

let _healthCache: { fetchedAt: number; data: HealthResponse } | null = null;
const HEALTH_TTL_MS = 60_000; // dedupe rapid health calls within 60s

export async function getHealth(opts?: { force?: boolean; signal?: AbortSignal }): Promise<HealthResponse> {
  if (!opts?.force && _healthCache && Date.now() - _healthCache.fetchedAt < HEALTH_TTL_MS) {
    return _healthCache.data;
  }
  const data = await getJson<HealthResponse>(`${BASE}/health`, opts?.signal);
  _healthCache = { fetchedAt: Date.now(), data };
  return data;
}

export async function searchFaultCodes(opts: SearchOptions): Promise<SearchResponse> {
  const qs = buildSearchParams({
    q: opts.query,
    brand: opts.brand,
    model: opts.model,
    severity: opts.severity,
    category: opts.category,
    verifiedOnly: opts.verifiedOnly ? 1 : undefined,
    page: opts.page,
    pageSize: opts.pageSize,
  });
  return getJson<SearchResponse>(`${BASE}/search${qs}`, opts.signal);
}

export async function lookupFaultCode(code: string, brand?: string, signal?: AbortSignal): Promise<FaultLookupResponse> {
  const qs = buildSearchParams({ code, brand });
  return getJson<FaultLookupResponse>(`${BASE}/fault-code${qs}`, signal);
}

export async function getBrands(signal?: AbortSignal): Promise<BrandsResponse> {
  return getJson<BrandsResponse>(`${BASE}/brands`, signal);
}

export async function getControllers(brand?: string, signal?: AbortSignal): Promise<ControllersResponse> {
  const qs = buildSearchParams({ brand });
  return getJson<ControllersResponse>(`${BASE}/controllers${qs}`, signal);
}

export async function diagnoseSymptoms(input: DiagnoseInput): Promise<DiagnoseResponse> {
  const { signal, ...payload } = input;
  return postJson<DiagnoseResponse>(`${BASE}/diagnose`, payload, signal);
}

/**
 * Server-side `performIntegratedDiagnosis()` proxy. Sends the technician
 * input to /api/generator-oracle/integrated-diagnose and returns the full
 * IntegratedDiagnosisResult — no fault-code dataset access from the client.
 */
export async function performIntegratedDiagnosis(
  input: TechnicianInput,
  signal?: AbortSignal,
): Promise<IntegratedDiagnosisResult> {
  const json = await postJson<{ ok: true; result: IntegratedDiagnosisResult }>(
    `${BASE}/integrated-diagnose`,
    input,
    signal,
  );
  return json.result;
}

// ============================================================================
// Debounced searcher (ergonomic helper for input fields)
// ============================================================================

/**
 * Returns a function you can call from an input handler. Calls older than the
 * latest are aborted automatically — no leaking state, no races.
 */
export function createDebouncedSearcher(delayMs = 250) {
  let activeController: AbortController | null = null;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;

  return function search(opts: SearchOptions): Promise<SearchResponse> {
    if (pendingTimer) clearTimeout(pendingTimer);
    if (activeController) activeController.abort();
    const controller = new AbortController();
    activeController = controller;

    return new Promise<SearchResponse>((resolve, reject) => {
      pendingTimer = setTimeout(async () => {
        try {
          const data = await searchFaultCodes({ ...opts, signal: controller.signal });
          resolve(data);
        } catch (e) {
          if ((e as { name?: string })?.name === 'AbortError') return;
          reject(e);
        }
      }, delayMs);
    });
  };
}
