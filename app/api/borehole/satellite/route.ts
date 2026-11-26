import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * RETIRED (security sweep 2026-11-26), like analyze-site and water-quality.
 *
 * Despite its name this endpoint used no satellite data. Its "NDVI", "NDWI",
 * "NDMI", "LAI" and "SPI" were computed from humidity, temperature and
 * latitude formulas; without an Open-Meteo licence it returned fixed values
 * labelled "Regional Climate Model"; and it added a fixed "qualityScore: 85"
 * and a groundwater "favorability" and "recharge zone likelihood". Those are
 * not measurements and must not be presented as such on a public URL.
 * The only caller (lib/borehole/apiService.ts) already treats a failure as
 * "no satellite data" (.catch(() => null)). The previous code is in git
 * history. All 7 methods answer 410 and fetch nothing.
 */
const body = {
  ok: false,
  error: 'retired',
  message: 'This endpoint is retired. Use AquaScan Pro at https://www.emersoneims.com/aquascan-pro-v3 for a full desktop assessment, or call EmersonEIMS on +254 768 860 665.',
};

const gone = () => NextResponse.json(body, { status: 410, headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } });
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
