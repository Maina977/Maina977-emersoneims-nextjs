/**
 * SolarGeniusPro solar engineering catch-all.
 *
 * Handlers are real algorithms ported from the original Express backend
 * (server/solar-engineering.js, autoDesigner.js, sld-generator.js):
 * Michalsky 1988 sun-position, Erbs 1982 / Liu–Jordan 1960 / Hay–Davies /
 * Perez transposition, NREL SAM loss stack, IEC 60228 conductor sizing,
 * NEC 690 OCPD, hourly simulation, auto-design, single-line diagram.
 *
 * Specific static routes (calculate, weather, elevation, nasa-power,
 * roof-autofill) take precedence. Wizard dispatcher serves as fallback.
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
  const res = await handleSolarGenius(req, 'solar', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'solar');
};

export const GET = handler;
export const POST = handler;
