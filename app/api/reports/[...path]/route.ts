/**
 * SolarGeniusPro server-side report rendering — real PDF/XLSX/CSV/DOCX.
 *
 * Ported from the original Express backend (server/reports.js) using
 * jspdf + jspdf-autotable, xlsx, exceljs, papaparse and docx. Endpoints:
 * /pdf, /xlsx, /csv, /proposal (PDF), /proposal-docx, /proposal-xlsx,
 * /schematic, /spec-sheet.
 *
 * Note: The original optional brand-image embedding (server/report-assets.js)
 * required `sharp` (native binary) and was skipped for serverless safety.
 * Proposals therefore render without embedded chart images; the underlying
 * data tables are intact.
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
  const res = await handleSolarGenius(req, 'reports', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'reports');
};

export const GET = handler;
export const POST = handler;
