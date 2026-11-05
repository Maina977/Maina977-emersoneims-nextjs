import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * RETIRED (2026-11-05 audit). This endpoint ran an older, simpler engine than
 * AquaScan Pro: it defaulted depth, yield and "potable", predicted arsenic and
 * other chemistry from coordinates, and skipped the Kenya land check. No page
 * uses it. Rather than give answers that contradict the real tool on a public
 * URL, it points to the tool.
 */
const body = {
  ok: false,
  error: 'retired',
  message: 'This endpoint is retired. Use AquaScan Pro at https://www.emersoneims.com/aquascan-pro-v3 for a full desktop assessment, or call EmersonEIMS on +254 768 860 665.',
};

export async function GET() {
  return NextResponse.json(body, { status: 410, headers: { 'X-Robots-Tag': 'noindex' } });
}
export async function POST() {
  return NextResponse.json(body, { status: 410, headers: { 'X-Robots-Tag': 'noindex' } });
}
