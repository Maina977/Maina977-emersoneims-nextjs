/**
 * SUN & WEATHER ENGINE
 * Comprehensive solar position, weather, and production impact calculations
 * For SolarGeniusPro Intelligent Calculator
 * 
 * Includes:
 * - Solar position algorithm (sun angles)
 * - Sunrise/sunset calculations
 * - Weather impact modeling
 * - Temperature derating
 * - Cloud cover effects
 * - Seasonal variations
 * - Production forecasting
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number; // meters
  timezone: number; // UTC offset
  country: string;
  city: string;
}

export interface SunPosition {
  altitude: number; // angle above horizon (degrees)
  azimuth: number; // direction from north (degrees)
  zenithAngle: number; // from vertical (degrees)
  sunriseTime: string; // HH:MM format
  sunsetTime: string; // HH:MM format
  sunsetHours: number; // daylight hours
  dayOfYear: number;
  solarNoon: string; // HH:MM UTC
}

export interface WeatherData {
  date: string;
  temperature: number; // Celsius
  cloudCover: number; // 0-100%
  windSpeed: number; // m/s
  humidity: number; // 0-100%
  pressure: number; // hPa
  uvIndex: number; // 0-11
  irradiance: number; // W/m²
}

export interface WeatherImpact {
  temperatureDerating: number; // 0-1 (factor)
  cloudCoverLoss: number; // 0-100%
  windCoolingFactor: number; // 0-1
  seasonalFactor: number; // 0-1
  combinedEfficiency: number; // 0-1
  estimatedProduction: number; // kWh/day
  warnings: string[];
}

export interface SeasonalData {
  month: number;
  avgTemperature: number;
  avgCloudCover: number;
  peakSunHours: number;
  uvIndex: number;
  rainDays: number;
  avgWindSpeed: number;
}

export interface HourlyProduction {
  hour: number;
  solarAltitude: number;
  irradiance: number; // W/m²
  efficiency: number; // 0-1
  panelOutput: number; // W (before inverter)
  systemOutput: number; // W (after inverter losses)
}

export interface ProductionForecast {
  date: string;
  location: Location;
  systemSizeKW: number;
  forecastedProduction: number; // kWh
  confidence: number; // 0-100%
  hourlyData: HourlyProduction[];
  weatherFactors: WeatherImpact;
  bestGenerationTime: string; // HH:MM
  warnings: string[];
}

// ============================================================================
// SUN WEATHER ENGINE CLASS
// ============================================================================

export class SunWeatherEngine {
  /**
   * Calculate solar position for any date/time/location
   * Uses Solar Position Algorithm (SPA) for high accuracy
   */
  calculateSunPosition(location: Location, date: Date): SunPosition {
    const dayOfYear = this.dayOfYear(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Julian century
    const JD = this.julianDay(year, month, day, hour, minute, location.timezone);
    const JC = (JD - 2451545.0) / 36525.0;

    // Mean longitude of sun
    const L0 = 280.46646 + JC * (36000.76983 + JC * 0.0003032);
    const L = ((L0 % 360) + 360) % 360;

    // Mean anomaly of sun
    const M = 357.52911 + JC * (35999.05029 - JC * 0.0001537);
    const MRad = (M * Math.PI) / 180;

    // Sun equation of center
    const C =
      (1.914602 - JC * (0.004817 + JC * 0.000014)) * Math.sin(MRad) +
      (0.019993 - JC * 0.000101) * Math.sin(2 * MRad) +
      0.000029 * Math.sin(3 * MRad);

    // Sun true longitude
    const trueLong = L + C;

    // Apparent longitude
    const omega = 125.04 - 1934.136 * JC;
    const lambda = trueLong - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180);

    // Mean obliquity
    const epsilon0 =
      23.439291 - JC * (46.8150 + JC * (0.00059 - JC * 0.001813));
    const epsilon = epsilon0 + 0.00256 * Math.cos((omega * Math.PI) / 180);

    // Apparent sidereal time
    const v0 = 100.46061837 + (36000.770053611 + (0.000387933 - JC / 38710000) * JC) * JC;
    const v = ((v0 % 360) + 360) % 360 + 0.00824 * Math.sin((omega * Math.PI) / 180);

    // Sun right ascension
    const tanAlpha = (Math.cos((epsilon * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180)) /
      Math.cos((lambda * Math.PI) / 180);
    const alpha = Math.atan(tanAlpha) * (180 / Math.PI);

    // Sun declination
    const delta = Math.asin(Math.sin((epsilon * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180)) *
      (180 / Math.PI);

    // Hour angle
    const H = v + location.longitude - alpha;

    // Solar altitude
    const latitude = location.latitude;
    const latRad = (latitude * Math.PI) / 180;
    const deltaRad = (delta * Math.PI) / 180;
    const HRad = (H * Math.PI) / 180;

    const altitude = Math.asin(
      Math.sin(latRad) * Math.sin(deltaRad) +
        Math.cos(latRad) * Math.cos(deltaRad) * Math.cos(HRad)
    ) * (180 / Math.PI);

    // Solar azimuth
    const y = Math.sin(HRad);
    const x = Math.cos(HRad) * Math.sin(latRad) - Math.tan(deltaRad) * Math.cos(latRad);
    let azimuth = Math.atan2(y, x) * (180 / Math.PI) + 180;
    if (azimuth < 0) azimuth += 360;
    if (azimuth > 360) azimuth -= 360;

    // Zenith angle
    const zenithAngle = 90 - altitude;

    // Sunrise and sunset
    const { sunrise, sunset, daylight } = this.calculateSunriseSunset(location, dayOfYear);

    return {
      altitude: Math.round(altitude * 100) / 100,
      azimuth: Math.round(azimuth * 100) / 100,
      zenithAngle: Math.round(zenithAngle * 100) / 100,
      sunriseTime: sunrise,
      sunsetTime: sunset,
      sunsetHours: daylight,
      dayOfYear,
      solarNoon: this.formatTime(12 - location.longitude / 15, location.timezone),
    };
  }

  /**
   * Calculate sunrise and sunset times (Bourges algorithm)
   */
  private calculateSunriseSunset(location: Location, dayOfYear: number): {
    sunrise: string;
    sunset: string;
    daylight: number;
  } {
    const lat = location.latitude;
    const lng = location.longitude;

    const J2000 = 2451545.0;
    const JD = J2000 + dayOfYear - 0.5;
    const n = JD - J2000 - 0.0008;

    // Solar mean longitude
    const J = n / 36525.0;
    const L = 280.46646 + 36000.76983 * J + 0.0003032 * J * J;
    const M = 357.52911 + 35999.05029 * J - 0.0001537 * J * J;

    const C = (1.914602 - 0.004817 * J - 0.000014 * J * J) * Math.sin((M * Math.PI) / 180) +
      (0.019993 - 0.000101 * J) * Math.sin((2 * M * Math.PI) / 180) +
      0.00029 * Math.sin((3 * M * Math.PI) / 180);

    const sunLong = L + C;
    const sunAnom = M + C;
    const v = sunLong + 102.93005 + 6892.76 * Math.sin((sunAnom * Math.PI) / 180) +
      72.964 * Math.sin((2 * sunAnom * Math.PI) / 180);

    const delta = Math.asin(0.39782 * Math.sin((v * Math.PI) / 180)) * (180 / Math.PI);
    const latRad = (lat * Math.PI) / 180;
    const deltaRad = (delta * Math.PI) / 180;

    const cosH = -Math.tan(latRad) * Math.tan(deltaRad);
    if (cosH > 1) {
      // Sun never rises
      return { sunrise: "--:--", sunset: "--:--", daylight: 0 };
    }
    if (cosH < -1) {
      // Sun never sets
      return { sunrise: "00:00", sunset: "23:59", daylight: 24 };
    }

    const H = Math.acos(cosH) * (180 / Math.PI);
    const E = 100.46 + 0.9856 * dayOfYear;
    const Etime = -7.67 * Math.sin((E * Math.PI) / 180) - 10.09 * Math.sin((2 * E * Math.PI) / 180);

    const sunrise12 = (720 - 4 * lng - H - Etime) / 60;
    const sunset12 = (720 - 4 * lng + H - Etime) / 60;

    let sunrise = sunrise12 + location.timezone;
    let sunset = sunset12 + location.timezone;

    while (sunrise < 0) sunrise += 24;
    while (sunrise >= 24) sunrise -= 24;
    while (sunset < 0) sunset += 24;
    while (sunset >= 24) sunset -= 24;

    const sunriseStr = this.formatTime(sunrise, 0);
    const sunsetStr = this.formatTime(sunset, 0);
    const daylight = sunset - sunrise;

    return {
      sunrise: sunriseStr,
      sunset: sunsetStr,
      daylight: Math.max(0, daylight),
    };
  }

  /**
   * Calculate weather impact on solar production
   */
  calculateWeatherImpact(weather: WeatherData, panelEfficiency: number = 0.18): WeatherImpact {
    // Temperature derating (typical: -0.4% per °C above 25°C)
    const refTemp = 25;
    const tempCoeff = -0.004;
    const tempDerating = 1 + tempCoeff * (weather.temperature - refTemp);

    // Cloud cover loss (non-linear relationship)
    // 50% clouds = 40% loss, 80% clouds = 70% loss
    const cloudLoss = Math.pow(weather.cloudCover / 100, 1.2) * 100;

    // Wind cooling factor (higher wind = better cooling = better efficiency)
    // Baseline at 1 m/s, improves by ~1% per m/s additional wind
    const windCoolingFactor = Math.min(1.15, 1 + (weather.windSpeed - 1) * 0.01);

    // Seasonal factor (stored separately, typically 0.8-1.1)
    const month = new Date().getMonth();
    const seasonalFactor = this.getSeasonalFactor(month);

    // Combined efficiency
    const combinedEfficiency = Math.max(
      0,
      Math.min(
        1,
        (tempDerating / 0.85) * (1 - cloudLoss / 100) * windCoolingFactor * seasonalFactor
      )
    );

    // Estimate production (assuming 1kW system with nominal 4.5 peak sun hours)
    const estimatedProduction = 4.5 * combinedEfficiency;

    const warnings: string[] = [];
    if (weather.temperature > 45) warnings.push("⚠️ High temperature: Panel efficiency reduced");
    if (weather.cloudCover > 80) warnings.push("⚠️ Heavy cloud cover: Low production expected");
    if (weather.uvIndex > 9) warnings.push("🌞 Extreme UV: Excellent generation conditions");
    if (weather.windSpeed > 15) warnings.push("💨 Strong winds: Check array structural integrity");

    return {
      temperatureDerating: Math.round(tempDerating * 1000) / 1000,
      cloudCoverLoss: Math.round(cloudLoss * 10) / 10,
      windCoolingFactor: Math.round(windCoolingFactor * 1000) / 1000,
      seasonalFactor,
      combinedEfficiency: Math.round(combinedEfficiency * 1000) / 1000,
      estimatedProduction: Math.round(estimatedProduction * 100) / 100,
      warnings,
    };
  }

  /**
   * Get seasonal variations for a month
   */
  getSeasonalData(location: Location, month: number): SeasonalData {
    const seasonalDatabase: { [key: number]: { [key: string]: SeasonalData } } = {
      // Nairobi (1.2833°S, 36.8172°E)
      1: {
        Nairobi: {
          month: 1,
          avgTemperature: 24.5,
          avgCloudCover: 35,
          peakSunHours: 5.2,
          uvIndex: 10,
          rainDays: 4,
          avgWindSpeed: 2.1,
        },
      },
      2: {
        Nairobi: {
          month: 2,
          avgTemperature: 25.2,
          avgCloudCover: 32,
          peakSunHours: 5.4,
          uvIndex: 10,
          rainDays: 3,
          avgWindSpeed: 2.3,
        },
      },
      3: {
        Nairobi: {
          month: 3,
          avgTemperature: 24.8,
          avgCloudCover: 45,
          peakSunHours: 5.0,
          uvIndex: 9,
          rainDays: 12,
          avgWindSpeed: 2.0,
        },
      },
      4: {
        Nairobi: {
          month: 4,
          avgTemperature: 23.9,
          avgCloudCover: 55,
          peakSunHours: 4.6,
          uvIndex: 8,
          rainDays: 15,
          avgWindSpeed: 1.8,
        },
      },
      5: {
        Nairobi: {
          month: 5,
          avgTemperature: 22.5,
          avgCloudCover: 50,
          peakSunHours: 4.8,
          uvIndex: 7,
          rainDays: 10,
          avgWindSpeed: 2.5,
        },
      },
      6: {
        Nairobi: {
          month: 6,
          avgTemperature: 21.1,
          avgCloudCover: 45,
          peakSunHours: 5.0,
          uvIndex: 7,
          rainDays: 7,
          avgWindSpeed: 3.2,
        },
      },
      7: {
        Nairobi: {
          month: 7,
          avgTemperature: 20.9,
          avgCloudCover: 42,
          peakSunHours: 5.2,
          uvIndex: 7,
          rainDays: 6,
          avgWindSpeed: 3.5,
        },
      },
      8: {
        Nairobi: {
          month: 8,
          avgTemperature: 21.2,
          avgCloudCover: 40,
          peakSunHours: 5.3,
          uvIndex: 8,
          rainDays: 5,
          avgWindSpeed: 3.3,
        },
      },
      9: {
        Nairobi: {
          month: 9,
          avgTemperature: 22.1,
          avgCloudCover: 38,
          peakSunHours: 5.4,
          uvIndex: 9,
          rainDays: 4,
          avgWindSpeed: 2.8,
        },
      },
      10: {
        Nairobi: {
          month: 10,
          avgTemperature: 23.2,
          avgCloudCover: 42,
          peakSunHours: 5.2,
          uvIndex: 9,
          rainDays: 8,
          avgWindSpeed: 2.3,
        },
      },
      11: {
        Nairobi: {
          month: 11,
          avgTemperature: 23.8,
          avgCloudCover: 48,
          peakSunHours: 5.1,
          uvIndex: 9,
          rainDays: 11,
          avgWindSpeed: 1.9,
        },
      },
      12: {
        Nairobi: {
          month: 12,
          avgTemperature: 24.1,
          avgCloudCover: 40,
          peakSunHours: 5.0,
          uvIndex: 10,
          rainDays: 7,
          avgWindSpeed: 1.7,
        },
      },
    };

    // Get default for Nairobi if location not in database
    const defaultData = seasonalDatabase[month]?.Nairobi || {
      month,
      avgTemperature: 23,
      avgCloudCover: 45,
      peakSunHours: 5.1,
      uvIndex: 8,
      rainDays: 8,
      avgWindSpeed: 2.5,
    };

    return defaultData;
  }

  /**
   * Generate hourly production forecast
   */
  generateHourlyProduction(
    location: Location,
    systemSizeKW: number,
    date: Date,
    weather: WeatherData
  ): HourlyProduction[] {
    const hourlyData: HourlyProduction[] = [];
    const sunPosition = this.calculateSunPosition(location, date);

    for (let hour = 0; hour < 24; hour++) {
      const testDate = new Date(date);
      testDate.setHours(hour);

      const sun = this.calculateSunPosition(location, testDate);

      // Solar irradiance model (simple)
      let irradiance = 0;
      if (sun.altitude > 0) {
        // Clear sky irradiance
        const maxIrr = 1000 * Math.sin((sun.altitude * Math.PI) / 180);
        // Apply cloud cover reduction
        const cloudReduction = 1 - (weather.cloudCover / 100) * 0.85;
        irradiance = maxIrr * cloudReduction;
      }

      // Panel efficiency (affected by temperature and irradiance)
      const baseEfficiency = 0.18;
      const tempFactor = 1 - 0.004 * (weather.temperature - 25);
      const eff = baseEfficiency * tempFactor;

      // Panel output
      const panelOutput = systemSizeKW * 1000 * (irradiance / 1000) * eff;

      // System output (inverter losses ~3%)
      const inverterEfficiency = 0.97;
      const systemOutput = panelOutput * inverterEfficiency;

      hourlyData.push({
        hour,
        solarAltitude: sun.altitude,
        irradiance: Math.round(irradiance),
        efficiency: Math.round(eff * 10000) / 10000,
        panelOutput: Math.round(panelOutput),
        systemOutput: Math.round(systemOutput),
      });
    }

    return hourlyData;
  }

  /**
   * Generate complete production forecast
   */
  generateProductionForecast(
    location: Location,
    systemSizeKW: number,
    weatherData: WeatherData
  ): ProductionForecast {
    const date = new Date();
    const hourlyData = this.generateHourlyProduction(location, systemSizeKW, date, weatherData);

    // Calculate daily production
    const dailyProduction = hourlyData.reduce((sum, h) => sum + h.systemOutput / 1000, 0) / 1000; // kWh

    const weatherImpact = this.calculateWeatherImpact(weatherData);

    // Find best generation time
    const maxHour = hourlyData.reduce((prev, current) =>
      current.systemOutput > prev.systemOutput ? current : prev
    );

    const sunPosition = this.calculateSunPosition(location, date);

    const warnings: string[] = [];
    if (weatherData.cloudCover > 70) warnings.push("⚠️ Heavy clouds forecast");
    if (weatherData.temperature > 40) warnings.push("🌡️ High temperature expected");
    if (sunPosition.sunsetHours < 10) warnings.push("⚡ Short daylight hours");

    const confidence = Math.max(
      50,
      100 - Math.abs(weatherData.cloudCover - 40) / 0.6
    );

    return {
      date: date.toISOString().split("T")[0],
      location,
      systemSizeKW,
      forecastedProduction: Math.round(dailyProduction * 100) / 100,
      confidence: Math.round(confidence),
      hourlyData,
      weatherFactors: weatherImpact,
      bestGenerationTime: this.formatTime(maxHour.hour, location.timezone),
      warnings,
    };
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private dayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  private julianDay(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    timezone: number
  ): number {
    const utcHour = hour - timezone + minute / 60;
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
    jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    jd = jd + (utcHour - 12) / 24;

    return jd;
  }

  private getSeasonalFactor(month: number): number {
    // Varies by 0.8-1.1 throughout year
    const factors = [1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0];
    return factors[month] || 0.9;
  }

  private formatTime(hours: number, timezone: number): string {
    let h = Math.floor(hours);
    let m = Math.floor((hours - h) * 60);

    h = (h + 24) % 24;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default SunWeatherEngine;
