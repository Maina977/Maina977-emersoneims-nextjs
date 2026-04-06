/**
 * BOREHOLE IMAGE ANALYSIS API
 *
 * Features:
 * 1. EXIF GPS extraction from photos
 * 2. OpenStreetMap water body detection
 * 3. Terrain analysis from coordinates
 * 4. Integration with site analysis
 *
 * ALL FREE APIs - No paid services
 */

import { NextRequest, NextResponse } from 'next/server';

interface ImageAnalysisResult {
  locationDetected: boolean;
  coordinates: { latitude: number; longitude: number } | null;
  locationSource: string;
  address: string | null;
  nearbyWaterBodies: Array<{
    name: string;
    type: string;
    distance: number;
  }>;
  terrainFeatures: string[];
  confidence: number;
  siteAnalysis?: any;
}

// Parse EXIF GPS data from image
function parseEXIFGPS(base64Data: string): { latitude: number; longitude: number } | null {
  try {
    // Decode base64 to binary
    const binaryString = atob(base64Data.split(',')[1] || base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Find EXIF marker (0xFFE1)
    let offset = 0;
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) { // JPEG
      offset = 2;
      while (offset < bytes.length - 1) {
        if (bytes[offset] === 0xFF) {
          const marker = bytes[offset + 1];
          if (marker === 0xE1) { // EXIF
            const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
            const exifData = bytes.slice(offset + 4, offset + 4 + length);
            return extractGPSFromExif(exifData);
          } else if (marker === 0xD9) { // End of image
            break;
          } else {
            const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
            offset += 2 + segmentLength;
          }
        } else {
          offset++;
        }
      }
    }
    return null;
  } catch (e) {
    console.error('[EXIF] Parse error:', e);
    return null;
  }
}

function extractGPSFromExif(exifData: Uint8Array): { latitude: number; longitude: number } | null {
  // Simplified EXIF GPS extraction
  // Look for GPS IFD pointer and extract coordinates
  const dataView = new DataView(exifData.buffer, exifData.byteOffset, exifData.byteLength);

  // Check for "Exif\0\0" header
  const header = String.fromCharCode(...exifData.slice(0, 4));
  if (header !== 'Exif') return null;

  // Determine byte order
  const tiffOffset = 6;
  const byteOrder = dataView.getUint16(tiffOffset, false);
  const littleEndian = byteOrder === 0x4949; // 'II'

  try {
    // Find GPS IFD
    const ifdOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
    const numEntries = dataView.getUint16(tiffOffset + ifdOffset, littleEndian);

    let gpsOffset = 0;
    for (let i = 0; i < numEntries; i++) {
      const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
      const tag = dataView.getUint16(entryOffset, littleEndian);
      if (tag === 0x8825) { // GPS IFD Pointer
        gpsOffset = dataView.getUint32(entryOffset + 8, littleEndian);
        break;
      }
    }

    if (gpsOffset === 0) return null;

    // Parse GPS IFD
    const gpsEntries = dataView.getUint16(tiffOffset + gpsOffset, littleEndian);
    let latRef = 'N', lonRef = 'E';
    let lat: number[] = [], lon: number[] = [];

    for (let i = 0; i < gpsEntries; i++) {
      const entryOffset = tiffOffset + gpsOffset + 2 + i * 12;
      const tag = dataView.getUint16(entryOffset, littleEndian);
      const valueOffset = dataView.getUint32(entryOffset + 8, littleEndian);

      switch (tag) {
        case 1: // GPSLatitudeRef
          latRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
          break;
        case 2: // GPSLatitude
          lat = readRational(dataView, tiffOffset + valueOffset, littleEndian, 3);
          break;
        case 3: // GPSLongitudeRef
          lonRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
          break;
        case 4: // GPSLongitude
          lon = readRational(dataView, tiffOffset + valueOffset, littleEndian, 3);
          break;
      }
    }

    if (lat.length === 3 && lon.length === 3) {
      let latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
      let longitude = lon[0] + lon[1] / 60 + lon[2] / 3600;
      if (latRef === 'S') latitude = -latitude;
      if (lonRef === 'W') longitude = -longitude;
      return { latitude, longitude };
    }
  } catch (e) {
    console.error('[EXIF GPS] Extraction error:', e);
  }

  return null;
}

function readRational(dataView: DataView, offset: number, littleEndian: boolean, count: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const numerator = dataView.getUint32(offset + i * 8, littleEndian);
    const denominator = dataView.getUint32(offset + i * 8 + 4, littleEndian);
    values.push(denominator ? numerator / denominator : 0);
  }
  return values;
}

// Query OpenStreetMap for nearby water bodies
async function findNearbyWaterBodies(lat: number, lon: number, radiusKm: number = 5): Promise<Array<{
  name: string;
  type: string;
  distance: number;
}>> {
  try {
    // Overpass API query for water bodies
    const query = `
      [out:json][timeout:25];
      (
        way["natural"="water"](around:${radiusKm * 1000},${lat},${lon});
        relation["natural"="water"](around:${radiusKm * 1000},${lat},${lon});
        way["waterway"](around:${radiusKm * 1000},${lat},${lon});
        node["natural"="spring"](around:${radiusKm * 1000},${lat},${lon});
        node["man_made"="water_well"](around:${radiusKm * 1000},${lat},${lon});
      );
      out center tags;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const waterBodies: Array<{ name: string; type: string; distance: number }> = [];

    for (const element of data.elements || []) {
      const name = element.tags?.name || element.tags?.waterway || element.tags?.natural || 'Unnamed';
      const type = element.tags?.waterway || element.tags?.natural || element.tags?.man_made || 'water';

      // Calculate distance
      let elLat = element.lat || element.center?.lat;
      let elLon = element.lon || element.center?.lon;
      if (elLat && elLon) {
        const distance = calculateDistance(lat, lon, elLat, elLon);
        waterBodies.push({ name, type, distance: Math.round(distance * 100) / 100 });
      }
    }

    // Sort by distance
    return waterBodies.sort((a, b) => a.distance - b.distance).slice(0, 10);
  } catch (e) {
    console.error('[Overpass] Error:', e);
    return [];
  }
}

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Reverse geocode using Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { 'User-Agent': 'AquaScanPro/2.0' },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.display_name || null;
    }
  } catch (e) {
    console.error('[Geocode] Error:', e);
  }
  return null;
}

// Call site analysis API
async function callSiteAnalysis(lat: number, lon: number): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/api/borehole/analyze-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon }),
      signal: AbortSignal.timeout(60000),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (e) {
    console.error('[Site Analysis] Error:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, manualCoordinates } = body;

    let coordinates: { latitude: number; longitude: number } | null = null;
    let locationSource = 'none';
    let confidence = 0;

    // Priority 1: Manual coordinates provided
    if (manualCoordinates?.latitude && manualCoordinates?.longitude) {
      coordinates = manualCoordinates;
      locationSource = 'manual_input';
      confidence = 100;
    }

    // Priority 2: Extract GPS from image EXIF
    if (!coordinates && image) {
      const exifGPS = parseEXIFGPS(image);
      if (exifGPS) {
        coordinates = exifGPS;
        locationSource = 'exif_gps';
        confidence = 95;
      }
    }

    if (!coordinates) {
      return NextResponse.json({
        success: true,
        data: {
          locationDetected: false,
          coordinates: null,
          locationSource: 'none',
          address: null,
          nearbyWaterBodies: [],
          terrainFeatures: [],
          confidence: 0,
          message: 'No GPS data found in image. Please enter coordinates manually or take a photo with location enabled.',
          instructions: [
            '1. Enable location services on your phone camera',
            '2. Take a new photo at the site',
            '3. Or enter coordinates manually using the map picker',
            '4. Or use "Get My Location" button for current position'
          ]
        }
      });
    }

    console.log(`[Image Analysis] Location detected: ${coordinates.latitude}, ${coordinates.longitude} (${locationSource})`);

    // Parallel fetch of additional data
    const [address, waterBodies, siteAnalysis] = await Promise.all([
      reverseGeocode(coordinates.latitude, coordinates.longitude),
      findNearbyWaterBodies(coordinates.latitude, coordinates.longitude, 10),
      callSiteAnalysis(coordinates.latitude, coordinates.longitude)
    ]);

    // Determine terrain features from water bodies
    const terrainFeatures: string[] = [];
    if (waterBodies.some(w => w.type === 'river' || w.type === 'stream')) {
      terrainFeatures.push('Near surface water drainage');
    }
    if (waterBodies.some(w => w.type === 'spring')) {
      terrainFeatures.push('Natural spring zone - excellent indicator');
    }
    if (waterBodies.some(w => w.type === 'water_well')) {
      terrainFeatures.push('Existing wells nearby - proven aquifer');
    }
    if (waterBodies.some(w => w.distance < 1)) {
      terrainFeatures.push('Very close to water body (<1km)');
    }

    const result: ImageAnalysisResult = {
      locationDetected: true,
      coordinates,
      locationSource,
      address,
      nearbyWaterBodies: waterBodies,
      terrainFeatures,
      confidence,
      siteAnalysis
    };

    return NextResponse.json({
      success: true,
      data: result,
      dataSources: ['EXIF GPS', 'OpenStreetMap Overpass', 'Nominatim Geocoding', 'NASA GLDAS', 'ISRIC SoilGrids']
    });

  } catch (error) {
    console.error('[Image Analysis] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: 'AquaScan Pro Image Analysis API',
      version: '2.0',
      features: [
        'EXIF GPS extraction from photos',
        'OpenStreetMap water body detection (rivers, lakes, springs, wells)',
        'Automatic address lookup via Nominatim',
        'Full site analysis integration',
        'Terrain feature detection'
      ],
      usage: 'POST with { image: base64, manualCoordinates?: {lat, lng} }',
      dataSources: ['EXIF GPS', 'OpenStreetMap Overpass API', 'Nominatim', 'NASA GLDAS', 'ISRIC SoilGrids']
    }
  });
}
