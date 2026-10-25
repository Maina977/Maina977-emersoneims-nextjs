/**
 * SolarGeniusPro engineering-extras (Tier 1+2+3) catch-all.
 * Real algorithms ported from server/engineering-extras.js.
 */
import { NextRequest } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  // The first handler reads the body; give it a copy so the fallback can read
  // it too (2026-10-25 audit: /api/eng/frame/analyze answered "not valid JSON"
  // instead of its honest 501).
  const res = await handleSolarGenius(req.clone() as NextRequest, 'eng', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'eng');
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
