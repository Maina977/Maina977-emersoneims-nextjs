/**
 * SAFETY WITHDRAWAL (management rule, 2026-11-25; independent withdrawal review R2).
 *
 * Withdrawn: a generic streaming Claude chat whose prompt asked it to "provide basic
 * technical support", with no STOP guard (same class as S12 expert-chat). It stays
 * unavailable until it is corrected and independently re-verified. Every method answers
 * HTTP 503 with { error: 'temporarily_unavailable', message } before doing any work; no
 * model client is imported here.
 *
 * The previous implementation is at commit fa565ab1:
 *   git show fa565ab1:app/api/ai/chat/stream/route.ts
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
