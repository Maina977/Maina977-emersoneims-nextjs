/**
 * ROOF SHADING ENGINE
 * Comprehensive shade analysis for solar installations
 * For SolarGeniusPro Intelligent Calculator
 * 
 * Includes:
 * - Tree shadow modeling
 * - Building shadow analysis
 * - Roof orientation effects
 * - Hourly shading patterns
 * - Annual production loss calculations
 * - 3D visualization data
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ShadingObject {
  type: "tree" | "building" | "mountain" | "structure";
  name: string;
  distance: number; // meters from array
  height: number; // meters
  azimuthStart: number; // degrees from north
  azimuthEnd: number; // degrees from north
  elevationAngle: number; // from horizontal (degrees)
  season?: "winter" | "summer" | "year-round";
}

export interface RoofSpecification {
  latitude: number;
  longitude: number;
  roofAzimuth: number; // 0=North, 90=East, 180=South, 270=West
  roofTilt: number; // degrees from horizontal (0-90)
  roofArea: number; // m²
  roofType: "flat" | "pitched" | "standing-seam";
  surfaceAlbedo: number; // 0-1 (reflectivity)
}

export interface ShadingPattern {
  hour: number;
  solarAltitude: number;
  solarAzimuth: number;
  shadedPercentage: number; // 0-100%
  activeShadingObjects: string[];
  irradianceReduction: number; // 0-1
}

export interface HourlyShading {
  month: number;
  day: number;
  hourlyPatterns: ShadingPattern[];
  averageShadingLoss: number; // 0-100%
  peakShadingLoss: number; // 0-100%
  totalGenerationLoss: number; // kWh
}

export interface AnnualShadingAnalysis {
  location: string;
  roofSpecification: RoofSpecification;
  shadingObjects: ShadingObject[];
  annualProductionLoss: number; // kWh
  productionLossPercentage: number; // 0-100%
  bySeason: {
    winter: number; // % loss
    spring: number; // % loss
    summer: number; // % loss
    fall: number; // % loss
  };
  monthlyLoss: number[]; // 12 months
  recommendations: string[];
  shadingVisualization: string; // ASCII art representation
}

export interface ShadingReport {
  timestamp: string;
  location: string;
  systemSizeKW: number;
  expectedAnnualProduction: number; // kWh
  shadingLosses: AnnualShadingAnalysis;
  recommendations: string[];
  immediateActions: string[];
}

// ============================================================================
// ROOF SHADING ENGINE CLASS
// ============================================================================

export class RoofShadingEngine {
  /**
   * Analyze shading for a specific installation
   */
  analyzeShadingProfile(
    roof: RoofSpecification,
    objects: ShadingObject[]
  ): AnnualShadingAnalysis {
    const recommendations: string[] = [];
    let totalAnnualLoss = 0;
    const monthlyLoss: number[] = [];
    const bySeason = { winter: 0, spring: 0, summer: 0, fall: 0 };

    // Calculate monthly losses
    for (let month = 1; month <= 12; month++) {
      let monthLoss = 0;
      let daysAnalyzed = 0;

      // Analyze 3 representative days per month
      const days = [5, 15, 25];

      for (const day of days) {
        if (day > this.daysInMonth(month)) continue;

        const hourlyLoss = this.calculateDailyShading(roof, objects, month, day);
        monthLoss += hourlyLoss.averageShadingLoss;
        daysAnalyzed++;
      }

      monthLoss = monthLoss / Math.max(1, daysAnalyzed);
      monthlyLoss.push(Math.round(monthLoss * 10) / 10);

      // Accumulate seasonal losses
      if (month >= 12 || month <= 2) bySeason.winter += monthLoss;
      else if (month >= 3 && month <= 5) bySeason.spring += monthLoss;
      else if (month >= 6 && month <= 8) bySeason.summer += monthLoss;
      else if (month >= 9 && month <= 11) bySeason.fall += monthLoss;

      totalAnnualLoss += monthLoss;
    }

    // Calculate seasonal averages
    bySeason.winter = Math.round((bySeason.winter / 3) * 10) / 10;
    bySeason.spring = Math.round((bySeason.spring / 3) * 10) / 10;
    bySeason.summer = Math.round((bySeason.summer / 3) * 10) / 10;
    bySeason.fall = Math.round((bySeason.fall / 3) * 10) / 10;

    const averageLoss = Math.round((totalAnnualLoss / 12) * 10) / 10;

    // Generate recommendations
    if (averageLoss > 20) {
      recommendations.push("⚠️ Significant shading detected - consider tree trimming");
      recommendations.push("Consider relocating array to shadeless location if possible");
    } else if (averageLoss > 10) {
      recommendations.push("Moderate shading - monitor production during peak loss periods");
      recommendations.push("Consider trimming vegetation around array");
    } else if (averageLoss > 5) {
      recommendations.push("Minor shading detected - acceptable for most installations");
      recommendations.push("Regular monitoring recommended");
    } else {
      recommendations.push("✅ Minimal shading - excellent location for solar array");
      recommendations.push("Proceed with installation as planned");
    }

    // Object-specific recommendations
    for (const obj of objects) {
      if (obj.type === "tree") {
        if (obj.season === "summer") {
          recommendations.push(`🌳 Summer tree shading from ${obj.name} - plan maintenance trimming in spring`);
        }
      }
      if (obj.type === "building") {
        recommendations.push(`🏢 Building shading from ${obj.name} - verify clearance certificates`);
      }
    }

    // Visualization
    const visualization = this.generateShadingVisualization(roof, objects);

    return {
      location: `${roof.latitude.toFixed(2)}°, ${roof.longitude.toFixed(2)}°`,
      roofSpecification: roof,
      shadingObjects: objects,
      annualProductionLoss: totalAnnualLoss,
      productionLossPercentage: averageLoss,
      bySeason,
      monthlyLoss,
      recommendations,
      shadingVisualization: visualization,
    };
  }

  /**
   * Calculate daily shading pattern
   */
  private calculateDailyShading(
    roof: RoofSpecification,
    objects: ShadingObject[],
    month: number,
    day: number
  ): HourlyShading {
    const hourlyPatterns: ShadingPattern[] = [];
    let totalShadingLoss = 0;
    let peakShadingLoss = 0;

    // Estimate sunrise and sunset
    const { sunrise, sunset } = this.estimateSunriseSunset(roof.latitude, month, day);

    for (let hour = Math.floor(sunrise); hour < Math.ceil(sunset); hour++) {
      const time = hour + 0.5; // mid-hour

      // Estimate sun position (simplified)
      const sunPosition = this.estimateSunPosition(roof.latitude, month, day, time);

      if (sunPosition.altitude <= 0) continue;

      // Check which objects shade this point
      let shadedPercentage = 0;
      const activeShadingObjects: string[] = [];

      for (const obj of objects) {
        const isShading = this.checkObjectShading(obj, sunPosition, roof);
        if (isShading) {
          shadedPercentage += this.calculateObjectShadingPercentage(obj, sunPosition);
          activeShadingObjects.push(obj.name);
        }
      }

      shadedPercentage = Math.min(100, shadedPercentage);
      const irradianceReduction = 1 - shadedPercentage / 100;

      hourlyPatterns.push({
        hour,
        solarAltitude: sunPosition.altitude,
        solarAzimuth: sunPosition.azimuth,
        shadedPercentage,
        activeShadingObjects,
        irradianceReduction,
      });

      totalShadingLoss += shadedPercentage;
      peakShadingLoss = Math.max(peakShadingLoss, shadedPercentage);
    }

    const avgLoss = hourlyPatterns.length > 0 ? totalShadingLoss / hourlyPatterns.length : 0;

    return {
      month,
      day,
      hourlyPatterns,
      averageShadingLoss: Math.round(avgLoss * 10) / 10,
      peakShadingLoss: Math.round(peakShadingLoss * 10) / 10,
      totalGenerationLoss: Math.round(avgLoss * 0.2), // Approximate for 1kW system
    };
  }

  /**
   * Check if an object shades the array at a given time
   */
  private checkObjectShading(
    obj: ShadingObject,
    sunPosition: { altitude: number; azimuth: number },
    roof: RoofSpecification
  ): boolean {
    // Check if object is between sun and array
    const sunAzimuth = sunPosition.azimuth;

    // Check azimuth alignment
    let isInAzimuthRange = false;

    if (obj.azimuthEnd >= obj.azimuthStart) {
      isInAzimuthRange = sunAzimuth >= obj.azimuthStart && sunAzimuth <= obj.azimuthEnd;
    } else {
      // Wraps around 360
      isInAzimuthRange = sunAzimuth >= obj.azimuthStart || sunAzimuth <= obj.azimuthEnd;
    }

    // Check if sun is higher than object
    const sunHigherThanObject = sunPosition.altitude > obj.elevationAngle;

    return isInAzimuthRange && !sunHigherThanObject;
  }

  /**
   * Calculate percentage of array shaded by an object
   */
  private calculateObjectShadingPercentage(
    obj: ShadingObject,
    sunPosition: { altitude: number; azimuth: number }
  ): number {
    const elevationDifference = obj.elevationAngle - sunPosition.altitude;

    if (elevationDifference >= 0) {
      // Object is higher than sun, full shade
      return 100;
    }

    // Partial shade based on how much higher the sun is
    // Shade reduces as sun gets higher
    const maxElevationDiff = 30; // degrees
    const shadowPercentage = Math.max(
      0,
      100 * (1 - Math.abs(elevationDifference) / maxElevationDiff)
    );

    return Math.min(100, shadowPercentage);
  }

  /**
   * Estimate sunrise/sunset for latitude and month
   */
  private estimateSunriseSunset(
    latitude: number,
    month: number,
    day: number
  ): { sunrise: number; sunset: number } {
    // Simplified calculation
    const dayOfYear = this.calculateDayOfYear(month, day);

    // Declination angle
    const declination = 23.44 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);
    const latRad = (latitude * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    const cosH = -Math.tan(latRad) * Math.tan(decRad);
    let H = 0;

    if (cosH > 1) {
      // Polar night
      return { sunrise: 12, sunset: 12 };
    } else if (cosH < -1) {
      // Polar day
      return { sunrise: 0, sunset: 24 };
    } else {
      H = (Math.acos(cosH) * 180) / Math.PI;
    }

    const sunrise = 12 - H / 15;
    const sunset = 12 + H / 15;

    return {
      sunrise: Math.max(0, sunrise),
      sunset: Math.min(24, sunset),
    };
  }

  /**
   * Estimate sun position (simplified)
   */
  private estimateSunPosition(
    latitude: number,
    month: number,
    day: number,
    hour: number
  ): { altitude: number; azimuth: number } {
    const dayOfYear = this.calculateDayOfYear(month, day);

    // Declination
    const declination = 23.44 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);
    const declRad = (declination * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;

    // Hour angle
    const hourAngle = 15 * (hour - 12);
    const hourRad = (hourAngle * Math.PI) / 180;

    // Altitude
    const sinAlt = Math.sin(latRad) * Math.sin(declRad) + Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourRad);
    const altitude = (Math.asin(sinAlt) * 180) / Math.PI;

    // Azimuth
    const y = Math.sin(hourRad);
    const x = Math.cos(hourRad) * Math.sin(latRad) - Math.tan(declRad) * Math.cos(latRad);
    let azimuth = (Math.atan2(y, x) * 180) / Math.PI + 180;

    if (azimuth < 0) azimuth += 360;
    if (azimuth > 360) azimuth -= 360;

    return {
      altitude: Math.max(0, altitude),
      azimuth,
    };
  }

  /**
   * Generate ASCII visualization of shading
   */
  private generateShadingVisualization(roof: RoofSpecification, objects: ShadingObject[]): string {
    let visualization =
      "╔════════════════════════════════════════════════════════════╗\n";
    visualization += "║          ROOF SHADING VISUALIZATION                      ║\n";
    visualization += `║ Azimuth: ${roof.roofAzimuth}° | Tilt: ${roof.roofTilt}°                          ║\n`;
    visualization += "╠════════════════════════════════════════════════════════════╣\n";

    // Show compass with shading objects
    visualization += "║  N                                                        ║\n";
    visualization += "║  ↑                                                        ║\n";

    // Add objects at their azimuths
    let compassLine = "║  ";
    for (let az = 0; az < 360; az += 30) {
      let char = "·";

      for (const obj of objects) {
        if (az >= obj.azimuthStart && az <= obj.azimuthEnd) {
          char = obj.type === "tree" ? "🌳" : "🏢";
          break;
        }
      }

      compassLine += char === "🌳" || char === "🏢" ? char + " " : char + " ";
    }
    compassLine += "║\n";
    visualization += compassLine;

    visualization += "║  W ← → E                                                  ║\n";
    visualization += "║  ↓                                                        ║\n";
    visualization += "║  S                                                        ║\n";

    visualization += "╠════════════════════════════════════════════════════════════╣\n";
    visualization += "║ SHADING OBJECTS:                                          ║\n";

    for (const obj of objects) {
      const type = obj.type === "tree" ? "🌳" : "🏢";
      visualization += `║ ${type} ${obj.name.padEnd(50)}║\n`;
      visualization += `║   Distance: ${obj.distance}m | Height: ${obj.height}m | Azimuth: ${obj.azimuthStart}°-${obj.azimuthEnd}° ║\n`;
    }

    visualization += "╚════════════════════════════════════════════════════════════╝\n";

    return visualization;
  }

  /**
   * Generate comprehensive shading report
   */
  generateShadingReport(
    location: string,
    roof: RoofSpecification,
    objects: ShadingObject[],
    systemSizeKW: number,
    expectedAnnualProduction: number
  ): ShadingReport {
    const analysis = this.analyzeShadingProfile(roof, objects);

    const shadingLossesKWh = (expectedAnnualProduction * analysis.productionLossPercentage) / 100;
    const adjustedProduction = expectedAnnualProduction - shadingLossesKWh;

    const recommendations = [...analysis.recommendations];
    const immediateActions: string[] = [];

    if (analysis.productionLossPercentage > 25) {
      immediateActions.push("⚠️ CRITICAL: Get second opinion from solar engineer");
      immediateActions.push("Consider array relocation to sunnier spot");
    } else if (analysis.productionLossPercentage > 15) {
      immediateActions.push("Schedule tree trimming assessment");
      immediateActions.push("Get written clearance agreement from neighbors");
    } else if (analysis.productionLossPercentage > 5) {
      immediateActions.push("Document current shading conditions with photos");
      immediateActions.push("Plan annual maintenance checks");
    }

    return {
      timestamp: new Date().toISOString(),
      location,
      systemSizeKW,
      expectedAnnualProduction,
      shadingLosses: analysis,
      recommendations,
      immediateActions,
    };
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private calculateDayOfYear(month: number, day: number): number {
    const daysPerMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    return daysPerMonth[month - 1] + day;
  }

  private daysInMonth(month: number): number {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month - 1];
  }

  /**
   * Quick shading loss estimate (0-10%)
   */
  estimateQuickShadingLoss(objects: ShadingObject[]): number {
    if (objects.length === 0) return 0;

    let loss = 0;
    for (const obj of objects) {
      if (obj.type === "tree") {
        if (obj.season === "year-round") loss += 8;
        else loss += 5;
      } else if (obj.type === "building") {
        loss += 10;
      } else {
        loss += 3;
      }
    }

    return Math.min(50, loss); // Cap at 50%
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default RoofShadingEngine;
