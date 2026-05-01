// Data provenance helpers.
// Per project Data Policy: every data point returned to callers must carry
// (a) the authoritative source it came from, (b) the time it was retrieved,
// (c) the period it covers. Synthetic / estimated values are forbidden
// unless explicitly labelled with `kind: 'estimate'` AND a methodology citation.

export type ProvenanceKind = 'measured' | 'modelled' | 'estimate';

export interface Provenance {
  source: string;            // e.g. "NASA POWER v9 (api.larc.nasa.gov)"
  retrievedAt: string;       // ISO timestamp
  periodStart?: string;      // ISO date covered by the data
  periodEnd?: string;
  kind: ProvenanceKind;
  citation?: string;         // DOI / URL / paper reference
  notes?: string;
}

export interface Sourced<T> {
  data: T;
  provenance: Provenance;
}

export class DataUnavailableError extends Error {
  public readonly source: string;
  public readonly cause?: unknown;
  constructor(source: string, message: string, cause?: unknown) {
    super(`[${source}] ${message}`);
    this.name = 'DataUnavailableError';
    this.source = source;
    this.cause = cause;
  }
}

export class NotImplementedError extends Error {
  public readonly feature: string;
  public readonly requires: string[];
  constructor(feature: string, requires: string[] = []) {
    super(
      `Feature "${feature}" is not implemented. ` +
        `Per data policy this endpoint refuses to fabricate values. ` +
        (requires.length ? `Requires: ${requires.join(', ')}.` : '')
    );
    this.name = 'NotImplementedError';
    this.feature = feature;
    this.requires = requires;
  }
}

export function provenance(
  source: string,
  kind: ProvenanceKind,
  opts: Partial<Omit<Provenance, 'source' | 'kind' | 'retrievedAt'>> = {}
): Provenance {
  return {
    source,
    kind,
    retrievedAt: new Date().toISOString(),
    ...opts,
  };
}

export function sourced<T>(data: T, prov: Provenance): Sourced<T> {
  return { data, provenance: prov };
}
