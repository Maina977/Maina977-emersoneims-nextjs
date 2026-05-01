// CORE SIMULATION - 8760 HOUR SHADING ANALYSIS
// Comprehensive shading simulation for every hour of the year

export interface ShadingInput {
  location: {
    lat: number;
    lng: number;
  };
  roof: {
    pitch: number;
    azimuth: number;
    dimensions: { width: number; length: number };
  };
  obstructions: Obstruction[];
  panels: PanelPlacement[];
}

export interface Obstruction {
  type: 'tree' | 'building' | 'chimney' | 'vent';
  position: { x: number; y: number; z: number };
  height: number;
  width: number;
  distance: number;
  seasonalVariation?: number[];
}

export interface PanelPlacement {
  id: string;
  position: { x: number; y: number; z: number };
  orientation: number;
  tilt: number;
}

export interface ShadingResult {
  hourlyShading: number[];
  dailyShading: number[];
  monthlyShading: number[];
  annualLoss: number;
  bestPlacement: PanelPlacement[];
  shadingHeatmap: number[][];
}

class Shading8760 {
  async analyze(input: ShadingInput): Promise<ShadingResult> {
    const hourlyShading: number[] = [];
    const dailyShading: number[] = Array(365).fill(0);
    const monthlyShading: number[] = Array(12).fill(0);
    
    // Calculate sun position for each hour of the year
    for (let day = 0; day < 365; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const sunPosition = this.calculateSunPosition(input.location.lat, input.location.lng, day, hour);
        const shadingFactor = this.calculateShadingFactor(input, sunPosition);
        
        hourlyShading.push(shadingFactor);
        dailyShading[day] += shadingFactor / 24;
      }
    }
    
    // Calculate monthly averages
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let hourIndex = 0;
    for (let month = 0; month < 12; month++) {
      let monthSum = 0;
      for (let day = 0; day < daysPerMonth[month]; day++) {
        for (let hour = 0; hour < 24; hour++) {
          monthSum += hourlyShading[hourIndex++];
        }
      }
      monthlyShading[month] = monthSum / (daysPerMonth[month] * 24);
    }
    
    const annualLoss = (1 - hourlyShading.reduce((a, b) => a + b, 0) / hourlyShading.length) * 100;
    
    // Find best placement (minimize shading)
    const bestPlacement = this.optimizePlacement(input);
    
    // Generate shading heatmap (grid of roof)
    const shadingHeatmap = this.generateHeatmap(input);
    
    return {
      hourlyShading,
      dailyShading,
      monthlyShading,
      annualLoss: Math.round(annualLoss * 10) / 10,
      bestPlacement,
      shadingHeatmap
    };
  }
  
  private calculateSunPosition(lat: number, lng: number, day: number, hour: number): {
    altitude: number;
    azimuth: number;
  } {
    // Solar position algorithm (simplified)
    const declination = 23.45 * Math.sin((360 / 365) * (day - 81) * Math.PI / 180);
    const hourAngle = (hour - 12) * 15;
    
    const latRad = lat * Math.PI / 180;
    const decRad = declination * Math.PI / 180;
    const haRad = hourAngle * Math.PI / 180;
    
    const altitudeRad = Math.asin(
      Math.sin(latRad) * Math.sin(decRad) +
      Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
    );
    
    const azimuthRad = Math.acos(
      (Math.sin(decRad) - Math.sin(latRad) * Math.sin(altitudeRad)) /
      (Math.cos(latRad) * Math.cos(altitudeRad))
    );
    
    return {
      altitude: altitudeRad * 180 / Math.PI,
      azimuth: azimuthRad * 180 / Math.PI * (hourAngle > 0 ? 1 : -1)
    };
  }
  
  private calculateShadingFactor(input: ShadingInput, sunPosition: { altitude: number; azimuth: number }): number {
    if (sunPosition.altitude <= 0) return 0; // Night time
    
    let shadingFactor = 1.0;
    
    for (const obstruction of input.obstructions) {
      const obstructionAngle = Math.atan2(obstruction.height, obstruction.distance) * 180 / Math.PI;
      const azimuthDifference = Math.abs(sunPosition.azimuth - this.getObstructionAzimuth(obstruction));
      
      if (sunPosition.altitude < obstructionAngle && azimuthDifference < 30) {
        shadingFactor *= 0.7; // Significant shading
      } else if (sunPosition.altitude < obstructionAngle * 0.8 && azimuthDifference < 45) {
        shadingFactor *= 0.85; // Partial shading
      }
      
      // Apply seasonal variation for trees
      if (obstruction.type === 'tree' && obstruction.seasonalVariation) {
        const month = new Date().getMonth();
        shadingFactor *= obstruction.seasonalVariation[month] || 1;
      }
    }
    
    return Math.max(0, Math.min(1, shadingFactor));
  }
  
  private getObstructionAzimuth(obstruction: Obstruction): number {
    // Calculate azimuth from roof center to obstruction
    return Math.atan2(obstruction.position.y, obstruction.position.x) * 180 / Math.PI;
  }
  
  private optimizePlacement(input: ShadingInput): PanelPlacement[] {
    // Greedy algorithm for optimal panel placement
    const optimized: PanelPlacement[] = [];
    const gridSize = 0.5; // 0.5 meter grid
    const roofWidth = input.roof.dimensions.width;
    const roofLength = input.roof.dimensions.length;
    
    // Score each potential panel position
    const scores: { x: number; y: number; score: number }[] = [];
    
    for (let x = -roofWidth/2; x < roofWidth/2; x += gridSize) {
      for (let y = -roofLength/2; y < roofLength/2; y += gridSize) {
        let score = 0;
        
        // Calculate average shading for this position
        for (let day = 0; day < 365; day += 30) {
          for (let hour = 6; hour <= 18; hour += 3) {
            const sunPos = this.calculateSunPosition(input.location.lat, input.location.lng, day, hour);
            const shading = this.calculatePointShading(input, { x, y, z: 0 }, sunPos);
            score += shading;
          }
        }
        
        scores.push({ x, y, score: score / (365/30 * 13) });
      }
    }
    
    // Select top positions (non-overlapping)
    scores.sort((a, b) => b.score - a.score);
    
    for (const pos of scores) {
      if (optimized.length >= input.panels.length) break;
      
      // Check overlap with existing panels
      let overlaps = false;
      for (const existing of optimized) {
        const distance = Math.hypot(pos.x - existing.position.x, pos.y - existing.position.y);
        if (distance < 1.7) { // Panel width is ~1.7m
          overlaps = true;
          break;
        }
      }
      
      if (!overlaps) {
        optimized.push({
          id: `panel_${optimized.length + 1}`,
          position: { x: pos.x, y: pos.y, z: 0 },
          orientation: input.roof.azimuth,
          tilt: input.roof.pitch
        });
      }
    }
    
    return optimized;
  }
  
  private calculatePointShading(input: ShadingInput, point: { x: number; y: number; z: number }, sunPosition: { altitude: number; azimuth: number }): number {
    let factor = 1.0;
    
    for (const obstruction of input.obstructions) {
      const dx = obstruction.position.x - point.x;
      const dy = obstruction.position.y - point.y;
      const distance = Math.hypot(dx, dy);
      const obstructionAngle = Math.atan2(obstruction.height, distance) * 180 / Math.PI;
      const azimuthDiff = Math.abs(sunPosition.azimuth - Math.atan2(dy, dx) * 180 / Math.PI);
      
      if (sunPosition.altitude < obstructionAngle && azimuthDiff < 30) {
        factor *= 0.6;
      }
    }
    
    return factor;
  }
  
  private generateHeatmap(input: ShadingInput): number[][] {
    const resolution = 20;
    const heatmap: number[][] = [];
    const roofWidth = input.roof.dimensions.width;
    const roofLength = input.roof.dimensions.length;
    
    for (let i = 0; i < resolution; i++) {
      heatmap[i] = [];
      for (let j = 0; j < resolution; j++) {
        const x = -roofWidth/2 + (i / resolution) * roofWidth;
        const y = -roofLength/2 + (j / resolution) * roofLength;
        
        let totalShading = 0;
        let samples = 0;
        
        for (let day = 0; day < 365; day += 15) {
          for (let hour = 8; hour <= 16; hour += 2) {
            const sunPos = this.calculateSunPosition(input.location.lat, input.location.lng, day, hour);
            const shading = this.calculatePointShading(input, { x, y, z: 0 }, sunPos);
            totalShading += shading;
            samples++;
          }
        }
        
        heatmap[i][j] = totalShading / samples;
      }
    }
    
    return heatmap;
  }
}

export const shading8760 = new Shading8760();