/**
 * Comprehensive building report API: WITHDRAWN (P0 audit 2026-11-13).
 *
 * This endpoint generated a "complete BOQ", structural analysis and costs from
 * a text description alone: wall areas as floor area x 2.5, eight 300x300
 * columns per floor with 6Y16 bars, beams as floor area x 0.8 m with 4Y16/2Y16,
 * foundation concrete as area x 1.1 x 0.3, all at fixed KES rates, under the
 * heading "ALL REAL DATA - NO FAKE VALUES". The Engineering Apps directive
 * forbids inventing reinforcement, formwork and quantities (§6). No page used
 * it. It now answers like every other building calculation that is not
 * available online yet. Measured take-off: /api/qs/takeoff/slab.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const notAvailable = () =>
  NextResponse.json(
    {
      success: false,
      ok: false,
      error: 'not_available',
      message: 'A building report from a description alone is not available: quantities, structure and costs need measured drawings and a design. Talk to an EmersonEIMS engineer: 0768 860 665.',
    },
    { status: 501 },
  );

export async function POST() {
  return notAvailable();
}

export async function GET() {
  return notAvailable();
}
