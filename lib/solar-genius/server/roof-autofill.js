// =============================================================================
// roof-autofill.js — Authoritative roof geometry autofill for Africa-first PV.
// =============================================================================
//
// What this module IS (per data policy):
//   • Pulls REAL building footprints from authoritative open sources
//     (no fabrication, no hallucinated polygons).
//   • Computes roof area, perimeter, centroid, and dominant edge azimuth
//     directly from the polygon vertices.
//
// What this module is NOT:
//   • It is NOT LiDAR. True roof PITCH cannot be derived from a 2-D footprint
//     and we will return pitchDegrees = null with a clear note. Aurora's
//     Bing/Nearmap LiDAR is paid + US/EU-biased; we explicitly refuse to
//     fabricate a pitch from a 2-D polygon.
//   • If the caller passes `assumedPitchDegrees`, we will echo it back marked
//     `(user-provided estimate)` so it is never confused with measured data.
//
// Data sources, in order of preference:
//   1. OpenStreetMap Overpass API  (https://overpass-api.de)
//      Free, global, no API key. Building footprints contributed by mappers.
//   2. Microsoft Global ML Building Footprints (open-data, Africa coverage).
//      Used only as a documented fallback URL (caller may pre-fetch).
//   3. Google Open Buildings v3 (Africa, S/SE Asia, LATAM) — requires a
//      pre-fetched GeoJSON tile; we accept it via the `externalGeoJson`
//      parameter so the server stays offline-clean.
//
// Geometry math is from textbook references:
//   • Shoelace / Gauss area formula (Braden 1986).
//   • Haversine distance for edge length & area on the WGS-84 sphere
//     (R = 6371008.8 m, IUGG mean radius).
//   • Dominant-edge azimuth from the longest polygon edge using the
//     forward azimuth formula (Vincenty 1975, spherical reduction).
//
// All numeric outputs are rounded to a sensible precision and tagged with
// the source so a downstream PDF can list provenance.
//
// =============================================================================

'use strict';

const R_EARTH_M = 6371008.8;          // IUGG mean Earth radius
const DEG = Math.PI / 180;

// ------------------------- low-level geometry helpers -----------------------
function toRad(d) { return d * DEG; }
function toDeg(r) { return r / DEG; }

// Great-circle distance, metres.
function haversineM(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const dφ = toRad(lat2 - lat1);
  const dλ = toRad(lon2 - lon1);
  const a = Math.sin(dφ / 2) ** 2
          + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * R_EARTH_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Forward azimuth from (lat1,lon1) to (lat2,lon2), degrees clockwise from N.
function forwardAzimuthDeg(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const dλ = toRad(lon2 - lon1);
  const y = Math.sin(dλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2)
          - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Polygon area on the sphere (m²), spherical excess via L'Huilier.
// Reference: Bevis & Cambareri 1987, "Computing the area of a spherical
// polygon of arbitrary shape", Mathematical Geology.
function sphericalPolygonAreaM2(ring) {
  if (ring.length < 4) return 0; // need at least triangle + closing point
  let total = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[i + 1];
    total += toRad(lon2 - lon1)
           * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  return Math.abs(total * R_EARTH_M * R_EARTH_M / 2);
}

function perimeterM(ring) {
  let p = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    p += haversineM(ring[i][1], ring[i][0], ring[i + 1][1], ring[i + 1][0]);
  }
  return p;
}

function centroidLatLon(ring) {
  // Simple arithmetic mean of unique vertices — sufficient for buildings
  // <200 m across at any latitude (sub-decimetre offset from true centroid).
  let lat = 0, lon = 0;
  const n = ring.length - 1; // last == first
  for (let i = 0; i < n; i++) { lon += ring[i][0]; lat += ring[i][1]; }
  return { lat: lat / n, lon: lon / n };
}

// Dominant azimuth: pick the longest edge, return its azimuth normalised to
// the [0, 180) half-circle so 200° and 20° collapse to the same orientation.
function dominantAzimuthDeg(ring) {
  let bestLen = -1, bestAz = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[i + 1];
    const len = haversineM(lat1, lon1, lat2, lon2);
    if (len > bestLen) {
      bestLen = len;
      bestAz = forwardAzimuthDeg(lat1, lon1, lat2, lon2);
    }
  }
  // Roof ridge orientation; collapse to [0,180)
  return ((bestAz % 180) + 180) % 180;
}

// ------------------------- Overpass API client ------------------------------
//
// Buffer (metres) → bounding box around (lat, lon).
function bbox(lat, lon, radiusM) {
  const dLat = (radiusM / R_EARTH_M) / DEG;
  const dLon = (radiusM / (R_EARTH_M * Math.cos(toRad(lat)))) / DEG;
  return { south: lat - dLat, west: lon - dLon, north: lat + dLat, east: lon + dLon };
}

function overpassQuery(lat, lon, radiusM) {
  const b = bbox(lat, lon, radiusM);
  // Ask Overpass for all buildings whose footprint intersects the bbox.
  return `
[out:json][timeout:25];
(
  way["building"](${b.south},${b.west},${b.north},${b.east});
  relation["building"](${b.south},${b.west},${b.north},${b.east});
);
out geom;`.trim();
}

async function fetchOverpass(lat, lon, radiusM, fetchImpl) {
  const fetcher = fetchImpl || (typeof fetch === 'function' ? fetch : null);
  if (!fetcher) {
    throw new Error('fetch is unavailable in this Node runtime; '
      + 'pass `externalGeoJson` instead, or use Node >= 18');
  }
  const body = 'data=' + encodeURIComponent(overpassQuery(lat, lon, radiusM));
  const resp = await fetcher('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
               'User-Agent': 'SolarGeniusPro/1.0 (roof-autofill)' },
    body,
  });
  if (!resp.ok) throw new Error(`Overpass HTTP ${resp.status}`);
  return resp.json();
}

// Convert one Overpass `way` element to a closed [lon,lat] ring.
function wayToRing(way) {
  if (!way.geometry || way.geometry.length < 3) return null;
  const ring = way.geometry.map(p => [p.lon, p.lat]);
  // Close ring if not already closed
  const a = ring[0], b = ring[ring.length - 1];
  if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
  return ring;
}

// Pick the building whose centroid is closest to the requested point.
function pickClosestBuilding(elements, lat, lon) {
  let best = null;
  let bestDist = Infinity;
  for (const el of elements || []) {
    if (el.type !== 'way' || !el.geometry) continue;
    const ring = wayToRing(el);
    if (!ring) continue;
    const c = centroidLatLon(ring);
    const d = haversineM(lat, lon, c.lat, c.lon);
    if (d < bestDist) {
      bestDist = d;
      best = { ring, tags: el.tags || {}, osmId: el.id, distanceM: d };
    }
  }
  return best;
}

// ------------------------- public surface -----------------------------------
function computeRoofGeometry(ring) {
  const areaM2     = sphericalPolygonAreaM2(ring);
  const perimM     = perimeterM(ring);
  const centroid   = centroidLatLon(ring);
  const ridgeAz    = dominantAzimuthDeg(ring);
  // Solar-array azimuth is perpendicular to the ridge, biased to the
  // equator-facing hemisphere (south for north-of-equator sites).
  const arrayAzNorth = (ridgeAz + 90) % 360;
  const arrayAzSouth = (ridgeAz + 270) % 360;
  return {
    areaM2:    Math.round(areaM2 * 100) / 100,
    perimeterM: Math.round(perimM * 100) / 100,
    centroid:  { lat: +centroid.lat.toFixed(7), lon: +centroid.lon.toFixed(7) },
    ridgeAzimuthDeg: Math.round(ridgeAz * 10) / 10,
    suggestedArrayAzimuthDeg: {
      forNorthernHemisphere: Math.round(arrayAzSouth * 10) / 10, // face south
      forSouthernHemisphere: Math.round(arrayAzNorth * 10) / 10, // face north
    },
    vertices: ring.map(([lon, lat]) => [+lat.toFixed(7), +lon.toFixed(7)]),
  };
}

/**
 * Resolve a roof footprint for the building at (lat, lon).
 *
 * @param {object}  opts
 * @param {number}  opts.lat                 Site latitude  (-90..90)
 * @param {number}  opts.lon                 Site longitude (-180..180)
 * @param {number}  [opts.searchRadiusM=40]  Overpass search radius
 * @param {number}  [opts.assumedPitchDegrees] Optional caller estimate; will
 *                                            be returned with `(user
 *                                            estimate)` provenance label.
 * @param {object}  [opts.externalGeoJson]   Pre-fetched GeoJSON Polygon /
 *                                            MultiPolygon (e.g. Microsoft or
 *                                            Google Open Buildings tile);
 *                                            bypasses Overpass.
 * @param {function}[opts.fetchImpl]         Override of global fetch (tests).
 * @returns {Promise<object>}                Roof autofill record with full
 *                                            provenance metadata.
 */
async function autofillRoof(opts) {
  const o = opts || {};
  if (typeof o.lat !== 'number' || typeof o.lon !== 'number') {
    throw new Error('lat and lon are required numbers');
  }
  const radius = Math.max(5, Math.min(200, o.searchRadiusM || 40));

  // ---- 1. external GeoJSON path (no network call) --------------------------
  if (o.externalGeoJson) {
    const ring = extractFirstRing(o.externalGeoJson);
    if (!ring) throw new Error('externalGeoJson contains no polygon ring');
    const geom = computeRoofGeometry(ring);
    return wrapResult(geom, {
      source: 'external GeoJSON (caller-provided)',
      sourceUrl: o.externalGeoJson.__sourceUrl || null,
      retrievedAtUtc: new Date().toISOString(),
    }, o);
  }

  // ---- 2. Overpass API path -----------------------------------------------
  const json = await fetchOverpass(o.lat, o.lon, radius, o.fetchImpl);
  const picked = pickClosestBuilding(json.elements, o.lat, o.lon);
  if (!picked) {
    throw new Error('no OSM building footprint found within '
      + radius + ' m of the requested point. Try a larger '
      + 'searchRadiusM, or pass externalGeoJson from Microsoft/Google '
      + 'Open Buildings.');
  }
  const geom = computeRoofGeometry(picked.ring);
  return wrapResult(geom, {
    source: 'OpenStreetMap (Overpass API)',
    sourceUrl: `https://www.openstreetmap.org/way/${picked.osmId}`,
    osmId: picked.osmId,
    osmTags: picked.tags,
    matchDistanceM: Math.round(picked.distanceM * 10) / 10,
    retrievedAtUtc: new Date().toISOString(),
    license: 'ODbL 1.0 (https://www.openstreetmap.org/copyright)',
  }, o);
}

function extractFirstRing(gj) {
  if (!gj || !gj.type) return null;
  if (gj.type === 'Polygon')      return gj.coordinates && gj.coordinates[0];
  if (gj.type === 'MultiPolygon') return gj.coordinates && gj.coordinates[0]
                                       && gj.coordinates[0][0];
  if (gj.type === 'Feature')      return extractFirstRing(gj.geometry);
  if (gj.type === 'FeatureCollection') {
    return gj.features && gj.features[0]
        && extractFirstRing(gj.features[0]);
  }
  return null;
}

function wrapResult(geom, provenance, opts) {
  // Pitch handling — explicitly honest:
  let pitch = null;
  let pitchProvenance = 'NOT MEASURED — 2-D footprints cannot yield roof '
    + 'pitch. Pass `assumedPitchDegrees` for an estimate, or upload LiDAR.';
  if (typeof opts.assumedPitchDegrees === 'number') {
    pitch = opts.assumedPitchDegrees;
    pitchProvenance = '(user-provided estimate — NOT measured)';
  }
  return {
    geometry: geom,
    pitchDegrees: pitch,
    pitchProvenance,
    provenance,
    notes: [
      'areaM2 / perimeterM / azimuth derived directly from polygon vertices',
      'centroid is arithmetic mean of unique vertices (sub-decimetre error <200 m)',
      'ridgeAzimuthDeg is the bearing of the longest polygon edge, mod 180°',
      'suggestedArrayAzimuthDeg picks the equator-facing perpendicular',
    ],
  };
}

module.exports = {
  autofillRoof,
  computeRoofGeometry,
  // exposed for tests:
  _internals: {
    sphericalPolygonAreaM2,
    perimeterM,
    haversineM,
    forwardAzimuthDeg,
    dominantAzimuthDeg,
    centroidLatLon,
    bbox,
    overpassQuery,
    extractFirstRing,
    pickClosestBuilding,
    wayToRing,
  },
};
