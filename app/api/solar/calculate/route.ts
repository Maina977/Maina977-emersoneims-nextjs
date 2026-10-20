import { NextRequest, NextResponse } from 'next/server';
import { sizeSolar, KENYA_TOWNS, type SystemType, type RoofType } from '@/lib/solar/sizing';
import { fetchNasaSun } from '@/lib/solar/nasa';

/**
 * Solar Genius Pro calculator API (rewritten 2026-10-18, tool audit).
 *
 * Sun-hours come from NASA POWER climatology for the chosen town or
 * coordinates (yearly average for sizing, cloudiest month for off-grid). If
 * NASA cannot be reached the response says so and uses a stated Kenyan
 * typical value instead of pretending. Maths: lib/solar/sizing.ts.
 *
 * Units: annualProduction is kWh/year (it used to be Wh, shown as "MWh").
 */

const KENYA_TYPICAL_PSH = 5.5;

interface SunHours {
  annual: number;
  worstMonth: number;
  source: 'nasa-power' | 'kenya-typical';
  note: string;
}

async function sunHoursFor(lat: number, lon: number): Promise<SunHours> {
  try {
    const n = await fetchNasaSun(lat, lon);
    return {
      annual: n.annual,
      worstMonth: n.worstMonth,
      source: 'nasa-power',
      note: `NASA POWER long-term average for ${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    };
  } catch {
    return {
      annual: KENYA_TYPICAL_PSH,
      worstMonth: 4.5,
      source: 'kenya-typical',
      note: 'NASA POWER could not be reached, so a typical Kenyan value of 5.5 sun-hours was used. Try again for your exact location',
    };
  }
}

const SYSTEM_TYPES: SystemType[] = ['grid-tied', 'hybrid', 'off-grid'];
const ROOF_TYPES: RoofType[] = ['pitched', 'flat', 'ground'];
const num = (v: unknown) => (v === null || v === undefined || v === '' ? undefined : Number(v));

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 });
  }

  const monthlyKwh = Number(body.consumption);
  if (!Number.isFinite(monthlyKwh) || monthlyKwh <= 0 || monthlyKwh > 2_000_000) {
    return NextResponse.json({ error: 'consumption must be a positive number of kWh per month' }, { status: 400 });
  }
  const systemType = (SYSTEM_TYPES as string[]).includes(String(body.systemType)) ? (body.systemType as SystemType) : 'hybrid';
  const roofType = (ROOF_TYPES as string[]).includes(String(body.roofType)) ? (body.roofType as RoofType) : 'pitched';

  // Location: explicit coordinates win; otherwise a known Kenyan town.
  let lat = num(body.lat);
  let lon = num(body.lon);
  // Coordinates supplied but unusable used to fall back to Nairobi (2026-10-19).
  const latGiven = body.lat !== undefined && body.lat !== null && body.lat !== '';
  const lonGiven = body.lon !== undefined && body.lon !== null && body.lon !== '';
  if ((latGiven || lonGiven) && !(Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat!) <= 90 && Math.abs(lon!) <= 180)) {
    return NextResponse.json({ error: 'lat and lon must be valid coordinates (lat ±90, lon ±180)' }, { status: 400 });
  }
  let locationName = 'Custom location';
  if (!(Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat!) <= 90 && Math.abs(lon!) <= 180)) {
    // An unknown town used to fall back to Nairobi silently (2026-10-19 re-audit).
    const given = body.location !== undefined && String(body.location).trim() !== '';
    const key = String(given ? body.location : 'nairobi').toLowerCase().replace(/[^a-z]/g, '');
    const town = KENYA_TOWNS.find((t) => t.key === key);
    if (!town) {
      return NextResponse.json(
        { error: `Unknown location "${String(body.location)}". Send lat and lon, or one of: ${KENYA_TOWNS.map((t) => t.name).join(', ')}.` },
        { status: 400 },
      );
    }
    lat = town.lat;
    lon = town.lon;
    locationName = given ? town.name : `${town.name} (no location given)`;
  }

  const sun = await sunHoursFor(lat!, lon!);

  try {
    const r = sizeSolar({
      monthlyKwh,
      pshAnnual: sun.annual,
      pshWorstMonth: sun.worstMonth,
      systemType,
      roofType,
      tariffKesPerKwh: num(body.tariff),
      daytimeUsePct: num(body.daytimeUsePct),
      nightUsePct: num(body.nightUsePct),
      autonomyDays: num(body.autonomyDays),
      peakLoadKw: num(body.peakLoadKw),
      dieselKesPerLitre: num(body.dieselKesPerLitre),
    });
    return NextResponse.json({
      ...r,
      location: locationName,
      lat,
      lon,
      sunHours: sun,
      // Field names the rest of the Solar app already reads (all in kWh / KES).
      systemKw: r.pvKwp,
      totalCost: r.cost.midKes,
      monthlySaving: r.monthlySavingKes,
      annualProduction: r.annualEnergyKwh,
      peakSunHours: sun.annual,
      carbonOffsetKgPerYear: r.co2AvoidedKgPerYear ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Calculation failed' }, { status: 400 });
  }
}
