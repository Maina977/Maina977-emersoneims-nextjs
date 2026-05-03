/**
 * SolarGeniusPro research / AI-tools catch-all.
 *
 * Catalogue + per-feature describe endpoints are real (from
 * server/research-stubs.js). Heavy ML/CV/IoT features (research-impl.js)
 * require sharp / tesseract.js / mqtt native modules and were skipped
 * for serverless safety — those endpoints honestly return HTTP 501 with
 * the requirements needed to enable them on a worker host.
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
  const res = await handleSolarGenius(req, 'research', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'research');
};

export const GET = handler;
export const POST = handler;
