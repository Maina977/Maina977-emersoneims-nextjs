/**
 * REAL Solar Physics Calculations
 * Based on PVSyst methodology and NREL standards
 */

export interface SolarSystemConfig {
  systemSizeKw: number;
  latitude: number;
  longitude: number;
  roofAngleDegrees: number;
  roofOrientationDegrees: number;
  panelCount: number;
}

export interface SolarPosition {
  altitude: number;
  azimuth: number;
  declination: number;
}

export interface ShadingAnalysis {
  shadingPercentage: number;
  affectedPanels: number;
  estimatedLossKwh: number;
  severity: 'excellent' | 'good' | 'warning' | 'critical';
}

/**
 * Calculate solar position (altitude & azimuth) for a given time and location
 * Based on Spencer (1971) algorithm
 */
export function calculateSolarPosition(
  date: Date,
  latitude: number,
  longitude: number
): SolarPosition {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Solar declination (Spencer 1971)
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365;
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.00221 * Math.cos(3 * gamma) +
    0.00441 * Math.sin(3 * gamma);

  const declinationDeg = (declination * 180) / Math.PI;

  // Hour angle
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
  const standardMeridian = Math.round(longitude / 15) * 15;
  const solarTime = utcHours + (longitude - standardMeridian) / 15;
  const hourAngleDeg = (solarTime - 12) * 15;

  // Solar altitude (elevation angle)
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declinationDeg * Math.PI) / 180;
  const hourRad = (hourAngleDeg * Math.PI) / 180;

  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourRad);

  const altitude = (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;

  // Solar azimuth (0° = North, 90° = East, 180° = South, 270° = West)
  const numerator =
    Math.sin(decRad) * Math.cos(latRad) -
    Math.cos(decRad) * Math.sin(latRad) * Math.cos(hourRad);
  const denominator = Math.sin(hourRad) * Math.cos(decRad);
  let azimuth = (Math.atan2(denominator, numerator) * 180) / Math.PI;
  azimuth = (azimuth + 360) % 360;

  return {
    altitude: Math.round(altitude * 100) / 100,
    azimuth: Math.round(azimuth * 100) / 100,
    declination: Math.round(declinationDeg * 100) / 100,
  };
}

/**
 * Analyze shading impact using real solar geometry
 * Returns percentage of panel area affected by shading
 */
export function analyzeShadingImpact(
  config: SolarSystemConfig,
  obstacleHeight: number = 5 // meters
): ShadingAnalysis {
  const now = new Date();
  const solarPos = calculateSolarPosition(now, config.latitude, config.longitude);

  // Calculate angle of incidence on the panel surface
  const panelTiltRad = (config.roofAngleDegrees * Math.PI) / 180;
  const panelAzimuthRad = (config.roofOrientationDegrees * Math.PI) / 180;
  const solarAltRad = (solarPos.altitude * Math.PI) / 180;
  const solarAzimuthRad = (solarPos.azimuth * Math.PI) / 180;

  // Angle between sun ray and panel normal
  const cosIncidence =
    Math.sin(solarAltRad) * Math.cos(panelTiltRad) +
    Math.cos(solarAltRad) *
      Math.sin(panelTiltRad) *
      Math.cos(solarAzimuthRad - panelAzimuthRad);

  const incidenceAngle = (Math.acos(Math.max(-1, Math.min(1, cosIncidence))) * 180) / Math.PI;

  // Calculate shading percentage
  let shadingPercentage = 0;

  // If sun is below horizon, no direct radiation
  if (solarPos.altitude < 0) {
    shadingPercentage = 100;
  }
  // If angle of incidence > 90°, panel faces away from sun
  else if (incidenceAngle > 90) {
    shadingPercentage = 100;
  }
  // Shading from obstacles (simplified: based on solar altitude)
  else if (solarPos.altitude < 15) {
    // Low sun angle = more shading from obstacles
    const shadowLength = obstacleHeight / Math.tan((solarPos.altitude * Math.PI) / 180);
    shadingPercentage = Math.min(100, (shadowLength / 10) * 20); // Normalize
  }

  const affectedPanels = Math.floor((config.panelCount * shadingPercentage) / 100);
  
  // Estimate energy loss (W per panel * affected panels * hours equivalent)
  const wattPerPanel = (config.systemSizeKw * 1000) / config.panelCount;
  const estimatedLossKwh = (wattPerPanel * affectedPanels * 5) / 1000; // Rough 5h equivalent

  let severity: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
  if (shadingPercentage > 25) severity = 'critical';
  else if (shadingPercentage > 15) severity = 'warning';
  else if (shadingPercentage > 5) severity = 'good';

  return {
    shadingPercentage: Math.round(shadingPercentage),
    affectedPanels,
    estimatedLossKwh: Math.round(estimatedLossKwh * 100) / 100,
    severity,
  };
}

/**
 * Calculate daily energy production
 * Based on solar irradiance model
 */
export function calculateDailyProduction(
  config: SolarSystemConfig,
  peakSunHours: number
): number {
  // System efficiency losses
  const inverterEfficiency = 0.97;
  const wiring = 0.98;
  const temperature = 0.95; // Temperature derating
  const soiling = 0.97; // Dust/dirt losses
  const mismatch = 0.98;
  const dcToAc = inverterEfficiency * wiring * temperature * soiling * mismatch;

  // Shading impact
  const shading = analyzeShadingImpact(config);
  const shadingFactor = 1 - shading.shadingPercentage / 100;

  // Daily production: System Size (kW) * Peak Sun Hours * DC-to-AC efficiency * Shading factor
  const dailyProductionKwh =
    config.systemSizeKw * peakSunHours * dcToAc * shadingFactor;

  return Math.round(dailyProductionKwh * 100) / 100;
}

/**
 * Estimate annual production with degradation
 */
export function calculateAnnualProduction(
  config: SolarSystemConfig,
  peakSunHours: number,
  years: number = 25
): number {
  let totalProduction = 0;
  const degradationRate = 0.008; // 0.8% per year

  for (let year = 0; year < years; year++) {
    const degradation = Math.pow(1 - degradationRate, year);
    const dailyProd = calculateDailyProduction(config, peakSunHours);
    const yearlyProd = dailyProd * 365 * degradation;
    totalProduction += yearlyProd;
  }

  return Math.round(totalProduction * 100) / 100;
}
