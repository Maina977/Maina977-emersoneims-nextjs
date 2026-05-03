/**
 * SolarGeniusPro inverter catalogue — real datasheet specs ported from the
 * original Express backend (equipment-library.js).
 */
import { NextRequest } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSolarGenius(req, 'equipment', ['inverters']);
}
