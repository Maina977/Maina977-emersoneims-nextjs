/**
 * SolarGeniusPro engineering-PRO (Aurora-grade) catch-all.
 * Real algorithms ported from server/engineering-pro.js: hourly shading,
 * Monte-Carlo battery sizing, full lightning risk, P50/P90 yield, JWT
 * client portal, structural wind ballast, BS 7430 earth electrode.
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
  const res = await handleSolarGenius(req, 'engpro', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'engpro');
};

export const GET = handler;
export const POST = handler;
