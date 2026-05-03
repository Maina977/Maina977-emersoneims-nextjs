/**
 * SolarGeniusPro engineering-ELITE (Tier-4 utility-scale) catch-all.
 * Real algorithms ported from server/engineering-elite.js: 8760 TMY
 * simulation, GA optimiser, PAN degradation, EPRA grid-code pack.
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
  const res = await handleSolarGenius(req, 'engelite', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'engelite');
};

export const GET = handler;
export const POST = handler;
