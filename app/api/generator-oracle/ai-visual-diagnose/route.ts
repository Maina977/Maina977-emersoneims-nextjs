/**
 * SAFETY WITHDRAWAL (management rule, 2026-11-25).
 *
 * Withdrawn: S13: photo diagnosis; model output was returned unchecked.
 * The independent review of 2026-11-25 (ORACLE-SURFACES-REVIEW.md) found that
 * it gave running, cranking or live-circuit steps under STOP conditions, used
 * invented thresholds, or omitted STOPs. It stays unavailable until it is
 * corrected and independently re-verified. Every method answers HTTP 503 with
 * { error: 'temporarily_unavailable', message } before doing any work; no
 * diagnostic module is imported here.
 *
 * The previous implementation is at commit fa565ab1:
 *   git show fa565ab1:app/api/generator-oracle/ai-visual-diagnose/route.ts
 */
import { withdrawnRouteResponse } from '@/lib/generator-oracle/safety/withdrawal';

export const dynamic = 'force-dynamic';

export async function GET() { return withdrawnRouteResponse(); }
export async function POST() { return withdrawnRouteResponse(); }
export async function PUT() { return withdrawnRouteResponse(); }
export async function PATCH() { return withdrawnRouteResponse(); }
export async function DELETE() { return withdrawnRouteResponse(); }
export async function HEAD() { return withdrawnRouteResponse(); }
export async function OPTIONS() { return withdrawnRouteResponse(); }
