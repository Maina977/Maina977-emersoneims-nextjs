import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: 'Missing or too-short query parameter q' }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EmersonEIMS-SolarGeniusPro/1.0 (emersoneimservices@gmail.com)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

    const data = await res.json();

    const results = (data as any[]).map((r: any) => ({
      displayName: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      boundingBox: r.boundingbox?.map(parseFloat) ?? null,
      type: r.type,
      importance: r.importance,
    }));

    return NextResponse.json(results);
  } catch (err) {
    console.error('[geocode]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Geocoding failed' },
      { status: 502 }
    );
  }
}
