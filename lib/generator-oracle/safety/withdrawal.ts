/**
 * Generator Oracle: safety withdrawal (management rule, 2026-11-25).
 *
 * An instruction-giving workflow that is not safe stays unavailable until it is
 * corrected and independently re-verified. The independent review of
 * 2026-11-25 (ORACLE-SURFACES-REVIEW.md, surfaces S1-S8, S10-S15) found that
 * these surfaces gave running, cranking or live-circuit steps under STOP
 * conditions, used invented thresholds, or omitted STOPs. Each withdrawn
 * screen shows OracleSafetyWithdrawnNotice and each withdrawn API route
 * answers `withdrawnRouteResponse()` (HTTP 503) before doing any work.
 *
 * This file is server-safe (no React) so API routes can use it.
 */

export const ORACLE_SAFETY_WITHDRAWN_MESSAGE =
  'This part of Generator Oracle is temporarily unavailable while safety checks are being updated. Please consult the applicable OEM service manual and a qualified technician.';

export const ORACLE_WITHDRAWN_ERROR = 'temporarily_unavailable' as const;

/** The body every withdrawn route returns. */
export function withdrawnRouteBody(): { error: typeof ORACLE_WITHDRAWN_ERROR; message: string } {
  return { error: ORACLE_WITHDRAWN_ERROR, message: ORACLE_SAFETY_WITHDRAWN_MESSAGE };
}

/** HTTP 503 with the withdrawal notice. Never cached. */
export function withdrawnRouteResponse(): Response {
  return new Response(JSON.stringify(withdrawnRouteBody()), {
    status: 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
