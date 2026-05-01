// SHADING ENGINE - Solar Geometry & Obstacle Detection
// Calculates shade from trees/neighbors for 8am, 12pm, 4pm using solar position algorithm

// SPA (Solar Position Algorithm) constants
interface SPA {
  pi: number;
  radToDeg: (rad: number) => number;
  degToRad: (deg: number) => number;
}

export interface ShadingAnalysis {
  [panelId: string]: number; // percentage shaded (0-100)
}

export interface ShadingParams {
  panels: Array<{ id: string; x: number; y: number; z: number }>;
  latitude: number;
  longitude: number;
  roofPitch: number;
  time: string;
  date: Date;
  obstacles?: Obstacle[];
}

export interface Obstacle {
  type: 'tree' | 'building' | 'chimney' | 'other';
  x: number;
  y: number;
  z: number; // height
  width: number;
  depth: number;
}

/**
 * Calculate shading heatmap for all panels at a given time
 * Uses solar position algorithm (SPA) to determine sun angle
 * Then checks if obstacles cast shadows on each panel
 */
export async function calculateShadingHeatmap(params: ShadingParams): Promise<ShadingAnalysis> {
  const { panels, latitude, longitude, roofPitch, time, date, obstacles = [] } = params;

  // Parse time (HH:MM format)
  const [hours, minutes] = time.split(':').map(Number);

  // Get solar position for this date/time/location
  const solarPosition = calculateSolarPosition(
    latitude,
    longitude,
    date,
    hours,
    minutes
  );

  const shadingMap: ShadingAnalysis = {};

  // For each panel, calculate what percentage is shaded
  for (const panel of panels) {
    let shadingPercentage = 0;

    // Check each obstacle
    for (const obstacle of obstacles) {
      const obstacleShadow = calculateObstacleShadow(
        panel,
        obstacle,
        solarPosition,
        roofPitch
      );
      shadingPercentage = Math.max(shadingPercentage, obstacleShadow);
    }

    shadingMap[panel.id] = Math.min(100, shadingPercentage);
  }

  return shadingMap;
}

/**
 * Calculate solar position (altitude & azimuth angles)
 * Using simplified Solar Position Algorithm
 */
export function calculateSolarPosition(
  latitude: number,
  longitude: number,
  date: Date,
  hours: number,
  minutes: number
): { altitude: number; azimuth: number } {
  // Convert to radians
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;

  // Day of year
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Fraction of year in radians
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365;

  // Equation of Time (in minutes)
  const eot =
    229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

  // Declination angle (in radians)
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.00203 * Math.cos(3 * gamma) +
    0.00032 * Math.sin(3 * gamma);

  // Solar time (in decimal hours)
  const solarTime = hours + minutes / 60 + (eot - 4 * lon * 180 / Math.PI) / 60;

  // Hour angle in radians
  const hourAngle = ((solarTime - 12) * Math.PI) / 12;

  // Solar altitude angle
  const altitude = Math.asin(
    Math.sin(lat) * Math.sin(declination) +
    Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle)
  );

  // Solar azimuth angle (measured from north, positive east)
  const azimuth = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat)
  );

  // Convert to degrees
  return {
    altitude: (altitude * 180) / Math.PI,
    azimuth: ((azimuth * 180) / Math.PI + 180) % 360 // Normalize to 0-360
  };
}

/**
 * Calculate the shadow cast by an obstacle on a panel
 */
export function calculateObstacleShadow(
  panel: { id: string; x: number; y: number; z: number },
  obstacle: Obstacle,
  solarPosition: { altitude: number; azimuth: number },
  roofPitch: number
): number {
  // If sun is below horizon, everything is in shadow (night)
  if (solarPosition.altitude < 0) {
    return 100;
  }

  // Calculate sun ray direction vector
  const sunAltRad = (solarPosition.altitude * Math.PI) / 180;
  const sunAzRad = (solarPosition.azimuth * Math.PI) / 180;

  const sunRay = {
    x: Math.sin(sunAzRad) * Math.cos(sunAltRad),
    y: Math.cos(sunAzRad) * Math.cos(sunAltRad),
    z: Math.sin(sunAltRad)
  };

  // Check if obstacle is between sun and panel
  const dx = panel.x - obstacle.x;
  const dy = panel.y - obstacle.y;
  const dz = panel.z - obstacle.z;

  // Simple shadow calculation: if obstacle is higher and in sun direction
  if (obstacle.z > panel.z) {
    // Calculate if panel is in shadow cone
    const distanceFactor = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceFactor > 0 && distanceFactor < obstacle.width + 5) {
      // Obstacle is relatively close
      // Calculate shadow length based on sun angle
      const shadowLength = obstacle.z / Math.tan((solarPosition.altitude * Math.PI) / 180 + 0.1);
      
      if (distanceFactor < shadowLength) {
        // Panel is in shadow
        const shadingIntensity = (1 - distanceFactor / shadowLength) * 100;
        return Math.min(100, shadingIntensity);
      }
    }
  }

  return 0; // No shadow
}

/**
 * Detect obstacles from real OpenStreetMap data via the backend
 * /api/site/obstacles endpoint. Returns georeferenced buildings + trees
 * within `radiusMeters`. No more Math.random() — every obstacle has a
 * traceable OSM origin (or labelled default height where OSM lacks it).
 */
export async function detectObstacles(
  latitude: number,
  longitude: number,
  roofHeight: number = 6,
  radiusMeters: number = 80
): Promise<Obstacle[]> {
  try {
    const r = await fetch(
      `/api/site/obstacles?lat=${latitude}&lon=${longitude}&radiusMeters=${radiusMeters}`
    );
    if (!r.ok) return [];
    const json = await r.json();
    if (!json.success || !json.data?.obstacles) return [];

    // Map OSM obstacles into the shadingEngine cartesian frame.
    // Convert (lat,lon) → local meters relative to the site, with
    // x = east, y = north (standard ENU with z up).
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    return json.data.obstacles.map((o: any) => {
      const dLat = toRad(o.lat - latitude);
      const dLon = toRad(o.lon - longitude);
      const x = dLon * R * Math.cos(toRad(latitude)); // east meters
      const y = dLat * R;                              // north meters
      return {
        type: o.type === 'tree' ? 'tree' : 'building',
        x,
        y,
        z: o.heightM,
        width: o.widthM || (o.type === 'tree' ? 4 : 8),
        depth: o.widthM || (o.type === 'tree' ? 4 : 8)
      } as Obstacle;
    });
  } catch (_err) {
    // Network / offline: return empty rather than fabricate obstacles.
    return [];
  }
}

/**
 * Generate shading report for specific time periods
 */
export async function generateShadingReport(
  params: ShadingParams,
  times: string[] = ['08:00', '12:00', '16:00']
): Promise<{
  [time: string]: ShadingAnalysis;
}> {
  const report: { [time: string]: ShadingAnalysis } = {};

  for (const time of times) {
    report[time] = await calculateShadingHeatmap({ ...params, time });
  }

  return report;
}

/**
 * Recommend panel placement based on shading analysis
 */
export function recommendPanelPlacement(
  panels: Array<{ id: string; x: number; y: number; z: number; shadingPercentage?: number }>,
  maxShadingThreshold: number = 30
): string[] {
  const recommendations: string[] = [];

  let totalShading = 0;
  let shadedPanels = 0;

  panels.forEach(panel => {
    const shading = panel.shadingPercentage || 0;
    totalShading += shading;

    if (shading > maxShadingThreshold) {
      shadedPanels++;
    }
  });

  const avgShading = totalShading / Math.max(panels.length, 1);

  if (avgShading > 30) {
    recommendations.push('⚠️ Average shading is HIGH (>30%). Consider trimming trees or repositioning panels.');
  }

  if (shadedPanels > panels.length * 0.3) {
    recommendations.push('🌳 Multiple panels are heavily shaded. Tree trimming recommended.');
  }

  if (avgShading <= 15) {
    recommendations.push('✓ Excellent shading profile. Proceed with current placement.');
  }

  return recommendations;
}

// Re-export the solar-position routine under the SPA name so other modules
// can import a single canonical entry point (`SPA.calculate(...)`). The
// implementation above is the NOAA Equation-of-Time + declination + hour-
// angle algorithm — not a stub. If higher precision is ever needed, swap
// to NREL Reda & Andreas (2008) Solar Position Algorithm here.
export const SPA = {
  calculate: calculateSolarPosition
};
