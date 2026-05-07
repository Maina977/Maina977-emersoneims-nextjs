/**
 * GENERATOR ORACLE — Local retrieval client.
 *
 * Calls a HTTP retrieval sidecar (LOCAL_AI_RETRIEVAL_URL) that fronts a
 * vector store (e.g. Qdrant, LanceDB, or pgvector behind a small FastAPI
 * service) populated with controller manuals, fault-code tables, and
 * service procedures owned by EmersonEIMS. The sidecar is expected to
 * expose POST /query with body { text, k, filter? } returning
 * { hits: [{ id, source, snippet, score }] }.
 *
 * Status: SCAFFOLDED. No retrieval store has been populated yet — calls
 * return zero hits until the corpus is built and the sidecar is wired up.
 */

import { getLocalAiEnv } from './env';
import type { EvidenceCitation } from './schemas';

export interface RetrievalHit {
  id: string;
  source: string;
  snippet: string;
  score: number;
}

export interface RetrievalQuery {
  text: string;
  k?: number;
  filter?: Record<string, string | number | boolean>;
}

export class RetrievalUnavailableError extends Error {
  readonly code = 'RETRIEVAL_UNAVAILABLE' as const;
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'RetrievalUnavailableError';
  }
}

/**
 * Returns at most `k` hits, or an empty array if the retrieval sidecar is
 * not configured / unreachable. The verifier is responsible for treating
 * an empty hit list as "generic" or "verification_required" depending on
 * what the rule engine produced.
 */
export async function retrievalQuery(
  query: RetrievalQuery,
): Promise<{ hits: RetrievalHit[]; configured: boolean; reason?: string }> {
  const env = getLocalAiEnv();
  if (!env.retrievalUrl) {
    return {
      hits: [],
      configured: false,
      reason: 'LOCAL_AI_RETRIEVAL_URL unset',
    };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), env.timeoutMs);
  try {
    const res = await fetch(`${env.retrievalUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: query.text,
        k: query.k ?? 5,
        filter: query.filter,
      }),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      return {
        hits: [],
        configured: true,
        reason: `Retrieval HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as { hits?: RetrievalHit[] };
    return { hits: data.hits ?? [], configured: true };
  } catch (err) {
    return {
      hits: [],
      configured: true,
      reason: err instanceof Error ? err.message : 'unreachable',
    };
  } finally {
    clearTimeout(t);
  }
}

export function hitsToCitations(hits: RetrievalHit[]): EvidenceCitation[] {
  return hits.map((h) => ({
    source: h.source,
    snippet: h.snippet.slice(0, 1800),
    score: Math.max(0, Math.min(1, h.score)),
    applicabilityConfirmed: false,
  }));
}

export async function retrievalPing(
  timeoutMs = 4000,
): Promise<{
  ok: boolean;
  retrievalUrl: string | null;
  reason?: string;
}> {
  const env = getLocalAiEnv();
  if (!env.retrievalUrl) {
    return {
      ok: false,
      retrievalUrl: null,
      reason: 'LOCAL_AI_RETRIEVAL_URL unset',
    };
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${env.retrievalUrl}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    return {
      ok: res.ok,
      retrievalUrl: env.retrievalUrl,
      reason: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      retrievalUrl: env.retrievalUrl,
      reason: err instanceof Error ? err.message : 'unreachable',
    };
  } finally {
    clearTimeout(t);
  }
}
