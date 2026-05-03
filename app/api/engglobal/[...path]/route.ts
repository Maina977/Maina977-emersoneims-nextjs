/**
 * SolarGeniusPro engineering-GLOBAL (Tier-5 utility-scale, no upper limit)
 * catch-all. Real algorithms ported from server/engineering-global.js:
 * EPW TMY import, PVsyst PAN/OND parser, continuous-beam FE, PVGIS hourly,
 * global grid-code pack, global finance pack.
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
  const res = await handleSolarGenius(req, 'engglobal', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'engglobal');
};

export const GET = handler;
export const POST = handler;
