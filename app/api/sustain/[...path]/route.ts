/**
 * SolarGeniusPro sustainability endpoints — real emission factors
 * (IEA 2024, EPRA Kenya 2024, EPA equivalencies). Ported from the original
 * Express backend (server/sustainability.js).
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
  const res = await handleSolarGenius(req, 'sustain', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'sustain');
};

export const GET = handler;
export const POST = handler;
