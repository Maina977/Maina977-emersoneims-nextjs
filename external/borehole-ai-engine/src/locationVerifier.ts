/**
 * Location Verification Toolkit
 *
 * Provides external verification tools for cross-checking image location:
 * - Reverse image search (Google, TinEye, Bing, Yandex)
 * - Map verification links (Google Maps, Earth, OSM, Mapillary)
 * - Location confidence scoring with drilling-grade accuracy assessment
 * - OSINT verification checklist
 *
 * CRITICAL: Borehole drilling is expensive ($5,000-$50,000+).
 * Wrong location = wrong geological data = wrong drilling advice = wasted money.
 * This module ensures we NEVER present unverified locations as confirmed.
 */

export interface VerificationLink {
  service: string;
  icon: string;
  url: string;
  description: string;
  type: 'reverse-image' | 'map' | 'satellite' | 'streetview' | 'osint';
  requiresManualUpload?: boolean;
}

export interface LocationConfidence {
  score: number;          // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
  drillingReliability: 'VERIFIED' | 'HIGH' | 'MODERATE' | 'LOW' | 'UNVERIFIED';
  warnings: string[];
  recommendations: string[];
  dataSources: string[];
}

export interface VerificationResult {
  links: VerificationLink[];
  confidence: LocationConfidence;
  crossCheckStatus: 'not-started' | 'pending' | 'verified' | 'mismatch';
}

/**
 * Generate reverse image search URLs for location verification.
 * Most services require the user to upload manually from a client-side app.
 */
export function generateReverseImageSearchLinks(): VerificationLink[] {
  return [
    {
      service: 'Google Lens',
      icon: '🔍',
      url: 'https://lens.google.com/',
      description: 'Upload image to Google Lens for visual location matching, landmark recognition, and place identification',
      type: 'reverse-image',
      requiresManualUpload: true,
    },
    {
      service: 'Google Images',
      icon: '🖼️',
      url: 'https://images.google.com/',
      description: 'Reverse image search — find where this image appears online and identify the actual location',
      type: 'reverse-image',
      requiresManualUpload: true,
    },
    {
      service: 'TinEye',
      icon: '👁️',
      url: 'https://tineye.com/',
      description: 'Specialized reverse image search — find exact and modified copies across the web',
      type: 'reverse-image',
      requiresManualUpload: true,
    },
    {
      service: 'Bing Visual Search',
      icon: '🔎',
      url: 'https://www.bing.com/visualsearch',
      description: 'Microsoft Bing visual search — location context from similar images worldwide',
      type: 'reverse-image',
      requiresManualUpload: true,
    },
    {
      service: 'Yandex Images',
      icon: '🌐',
      url: 'https://yandex.com/images/',
      description: 'Yandex reverse image search — strong coverage of Eastern Europe, Asia, and Africa',
      type: 'reverse-image',
      requiresManualUpload: true,
    },
  ];
}

/**
 * Generate map verification links for given coordinates.
 */
export function generateMapLinks(lat: number, lon: number): VerificationLink[] {
  return [
    {
      service: 'Google Maps',
      icon: '🗺️',
      url: `https://www.google.com/maps/@${lat},${lon},15z`,
      description: 'View location on Google Maps — verify terrain, roads, and nearby features',
      type: 'map',
    },
    {
      service: 'Google Earth',
      icon: '🌍',
      url: `https://earth.google.com/web/@${lat},${lon},500a,1000d,35y,0h,0t,0r`,
      description: 'View in Google Earth — 3D terrain, historical imagery, high-resolution satellite',
      type: 'satellite',
    },
    {
      service: 'OpenStreetMap',
      icon: '🗾',
      url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`,
      description: 'OpenStreetMap — community-mapped features, water bodies, roads, buildings',
      type: 'map',
    },
    {
      service: 'Mapillary',
      icon: '📸',
      url: `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=15`,
      description: 'Street-level imagery — see actual ground conditions at this location',
      type: 'streetview',
    },
    {
      service: 'Sentinel Hub',
      icon: '🛰️',
      url: `https://apps.sentinel-hub.com/eo-browser/?zoom=14&lat=${lat}&lng=${lon}&themeId=DEFAULT-THEME`,
      description: 'Sentinel-2 satellite imagery — view NDVI, NDWI, true color, false color composites',
      type: 'satellite',
    },
    {
      service: 'Google Earth Engine',
      icon: '🌐',
      url: `https://earthengine.google.com/timelapse#v=${lat},${lon},12,latLng&t=3.04`,
      description: 'Time-lapse satellite imagery — see how the terrain has changed over decades',
      type: 'satellite',
    },
  ];
}

/**
 * Calculate location confidence score for drilling decisions.
 * This is the CRITICAL safety gate — determines if we should trust
 * the location enough to base drilling recommendations on it.
 */
export function calculateLocationConfidence(
  locationMethod: string,
  gpsAccuracy: number,
  gpsSource: string,
  hasResolvedLocation: boolean,
  resolvedLocationSource?: string,
  geoEstimateConfidence?: number,
): LocationConfidence {
  let score = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const dataSources: string[] = [];

  // ═══ SCORING BY LOCATION METHOD ═══

  if (locationMethod === 'exif-gps') {
    // EXIF GPS: embedded in the photo — highest reliability
    score = 92;
    dataSources.push('EXIF GPS (embedded in photo)');
    if (gpsAccuracy <= 10) score = 98;
    else if (gpsAccuracy <= 50) score = 95;
    else if (gpsAccuracy <= 500) score = 88;
    else { score = 75; warnings.push('GPS accuracy is low (>500m) — may affect geological analysis'); }

  } else if (locationMethod === 'device-gps' || gpsSource === 'device') {
    // Device GPS: user confirmed they're at the site
    score = 85;
    dataSources.push('Device GPS (user at site)');
    if (gpsAccuracy <= 20) score = 90;
    else if (gpsAccuracy > 100) {
      score = 70;
      warnings.push('Device GPS accuracy is low — ensure clear sky view');
    }
    recommendations.push('Confirm: are you physically at the proposed drilling site?');

  } else if (locationMethod === 'manual-entry' || gpsSource === 'manual') {
    // Manual entry: user typed coordinates
    score = 75;
    dataSources.push('Manual coordinates (user-provided)');
    warnings.push('Manually entered coordinates — verify on map before drilling');
    recommendations.push('Cross-check coordinates on Google Maps or Google Earth');

  } else if (locationMethod === 'filename-geocode') {
    // Filename geocoding: matched place name from filename via Nominatim
    score = 55;
    dataSources.push('Filename text → OpenStreetMap geocoding');
    warnings.push('Location derived from filename text — may not be the exact drilling site');
    warnings.push('Filename geocoding identifies the AREA, not the precise coordinates');
    recommendations.push('Verify this is the correct location using Google Maps link below');
    recommendations.push('Enter exact GPS coordinates for drilling-grade accuracy');

  } else if (locationMethod === 'iptc-geocode') {
    // IPTC metadata geocoding
    score = 50;
    dataSources.push('Photo metadata text → OpenStreetMap geocoding');
    warnings.push('Location from photo metadata text — area-level, not precise');
    recommendations.push('Verify location and enter exact coordinates');

  } else if (locationMethod === 'visual-estimate') {
    // Visual estimation: pixel analysis matched to terrain profiles
    score = 20;
    dataSources.push('Visual terrain analysis (pixel matching)');
    warnings.push('⚠️ LOCATION IS VISUALLY ESTIMATED — NOT VERIFIED');
    warnings.push('Visual estimation identifies a REGION, not a specific site');
    warnings.push('All drilling data below is based on an unverified estimated location');
    recommendations.push('🔴 DO NOT BASE DRILLING DECISIONS ON VISUAL ESTIMATES ALONE');
    recommendations.push('Use reverse image search tools to identify the actual location');
    recommendations.push('Enter exact GPS coordinates before considering any drilling');
    if (geoEstimateConfidence !== undefined) {
      score = Math.round(10 + geoEstimateConfidence * 30); // 10-40 range
    }

  } else {
    // No location at all
    score = 0;
    warnings.push('🔴 NO LOCATION DATA — all analysis results are GENERIC, not site-specific');
    warnings.push('Without a location, soil, geological, and water data are NOT reliable');
    recommendations.push('Upload an image with GPS data (EXIF) or enter coordinates manually');
    recommendations.push('Use Google Maps to find your site coordinates');
  }

  // ═══ BONUS/PENALTY FOR REVERSE GEOCODING ═══
  if (hasResolvedLocation && resolvedLocationSource !== 'none') {
    score = Math.min(100, score + 3);
    dataSources.push(`Reverse geocoded via ${resolvedLocationSource === 'nominatim' ? 'OpenStreetMap' : 'BigDataCloud'}`);
  }

  // ═══ GRADE ASSIGNMENT ═══
  let grade: LocationConfidence['grade'];
  let label: string;
  let drillingReliability: LocationConfidence['drillingReliability'];

  if (score >= 90) {
    grade = 'A'; label = 'Verified — Drilling-Grade Accuracy';
    drillingReliability = 'VERIFIED';
  } else if (score >= 75) {
    grade = 'B'; label = 'High Confidence — Suitable for Planning';
    drillingReliability = 'HIGH';
  } else if (score >= 50) {
    grade = 'C'; label = 'Moderate — Verify Before Drilling';
    drillingReliability = 'MODERATE';
  } else if (score >= 20) {
    grade = 'D'; label = 'Low — Estimated Location Only';
    drillingReliability = 'LOW';
  } else {
    grade = 'F'; label = 'Unverified — No Reliable Location';
    drillingReliability = 'UNVERIFIED';
  }

  return { score, grade, label, drillingReliability, warnings, recommendations, dataSources };
}

/**
 * OSINT verification checklist — systematic steps to verify an image's location.
 */
export function getOSINTChecklist(): { step: string; tool: string; description: string }[] {
  return [
    { step: '1. Reverse Image Search', tool: 'Google Lens / TinEye', description: 'Search for the image online — if it appears on a real estate site, news article, or social media, the actual location may be identified' },
    { step: '2. Metadata Analysis', tool: 'EXIF/IPTC extraction', description: 'Check for embedded GPS, camera info, timestamps, and location text in image metadata' },
    { step: '3. Landmark Identification', tool: 'Google Lens / Manual', description: 'Identify buildings, signs, vegetation, road markings, power lines, or other distinctive features' },
    { step: '4. Shadow Analysis', tool: 'SunCalc / Manual', description: 'Shadow direction + length can indicate latitude and time of day (helps confirm hemisphere)' },
    { step: '5. Vegetation Analysis', tool: 'Visual / NDVI', description: 'Plant species, growth patterns, and seasonal state indicate climate zone and geography' },
    { step: '6. Satellite Cross-Check', tool: 'Google Earth / Sentinel', description: 'Compare the photo against satellite imagery of the claimed location — does terrain match?' },
    { step: '7. Street View', tool: 'Google Street View / Mapillary', description: 'Check if street-level imagery exists near the coordinates — does it look like the photo?' },
    { step: '8. Document Context', tool: 'OSINT', description: 'Check the source of the image — who shared it, when, from what platform, what context?' },
  ];
}

/**
 * Generate comprehensive verification result.
 */
export function generateVerificationResult(
  lat: number | undefined,
  lon: number | undefined,
  locationMethod: string,
  gpsSource: string,
  gpsAccuracy: number,
  hasResolvedLocation: boolean,
  resolvedLocationSource?: string,
  geoEstimateConfidence?: number,
): VerificationResult {
  const links: VerificationLink[] = [
    ...generateReverseImageSearchLinks(),
    ...(lat !== undefined && lon !== undefined ? generateMapLinks(lat, lon) : []),
  ];

  const confidence = calculateLocationConfidence(
    locationMethod, gpsAccuracy, gpsSource,
    hasResolvedLocation, resolvedLocationSource, geoEstimateConfidence,
  );

  return { links, confidence, crossCheckStatus: 'not-started' };
}
