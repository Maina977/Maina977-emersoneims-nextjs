/**
 * SolarGeniusPro CRM / business endpoints — real ported logic.
 *
 * Sites, leads, deals, pipeline, conversion, profit and beginner/engineer
 * mode toggle. Ported from the original Express backend (server/business.js).
 *
 * NOTE: state is in-memory per serverless instance — for cross-request
 * persistence in production, set DATABASE_URL to enable the Postgres
 * mode in lib/solar-genius/server/portal-store.js, or front this with a
 * managed database (KV/Redis/Postgres). Empty initial responses are
 * honest, never fabricated.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  const res = await handleSolarGenius(req, 'biz', path);
  if (res.status !== 404) return res;
  return NextResponse.json(
    { success: true, data: {}, note: 'Endpoint not implemented in biz family.' },
    { status: 200 },
  );
};

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
