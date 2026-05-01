import { ContaminationSource } from './types';

export class ContaminationDetector {
  private readonly CONTAMINATION_KEYWORDS = {
    sewage: ['sewage', 'wastewater', 'drain', 'toilet', 'latrine', 'septic', 'effluent'],
    factory: ['factory', 'industrial', 'plant', 'manufacturing', 'chemical', 'smoke', 'chimney'],
    agricultural: ['farm', 'agriculture', 'pesticide', 'fertilizer', 'crop', 'livestock', 'pasture'],
    landfill: ['landfill', 'dump', 'garbage', 'waste', 'rubbish', 'trash', 'refuse'],
    industrial: ['industry', 'mining', 'refinery', 'processing', 'workshop', 'warehouse']
  };

  private readonly CHEMICAL_INDICATORS = {
    sewage: ['E.coli', 'Nitrates', 'Phosphates', 'Ammonia', 'Chlorides'],
    factory: ['Heavy metals', 'Solvents', 'PCBs', 'Dioxins', 'VOCs'],
    agricultural: ['Pesticides', 'Nitrates', 'Herbicides', 'Fungicides', 'Phosphates'],
    landfill: ['Leachate', 'Methane', 'VOCs', 'PFAS', 'Heavy metals'],
    industrial: ['Cyanide', 'Mercury', 'Lead', 'Arsenic', 'Chromium', 'Cadmium']
  };

  detectContamination(imageAnalysis: any, terrainType: string, waterProbability: number): ContaminationSource[] {
    const sources: ContaminationSource[] = [];
    const vegetationScore = imageAnalysis?.vegetationScore ?? 0.3;
    const isReliable = imageAnalysis?.isReliableTerrainImage !== false;
    
    // Only detect contamination from MobileNet label evidence, NOT from terrain type alone.
    // Terrain type was causing false positives on every image (every flat terrain → factory, etc.)
    const detectedTypes = this.detectContaminationTypes(imageAnalysis);
    
    for (const type of detectedTypes) {
      const distance = this.estimateDistance(type, waterProbability, terrainType, vegetationScore);
      sources.push({
        type: type as any,
        distance: distance,
        direction: this.estimateDirection(type, terrainType, waterProbability),
        severity: this.assessSeverity(type, waterProbability),
        chemicals: this.CHEMICAL_INDICATORS[type as keyof typeof this.CHEMICAL_INDICATORS],
        riskLevel: this.calculateRiskLevel(type, waterProbability, distance)
      });
    }

    // If NO visual contamination evidence detected, add a single low-risk
    // "agricultural" advisory for rural areas with high vegetation (common sense)
    // but only if image looks like outdoor terrain
    if (sources.length === 0 && isReliable && vegetationScore > 0.4 && waterProbability > 0.2) {
      sources.push({
        type: 'agricultural',
        distance: 500,
        direction: 'variable',
        severity: 'low',
        chemicals: ['Nitrates (potential)'],
        riskLevel: 0.15
      });
    }
    
    return sources;
  }

  /**
   * Detect contamination ONLY from MobileNet image labels.
   * Requires actual visual evidence of contamination sources — NOT terrain type.
   * Minimum probability threshold: 0.15 (strong MobileNet detection).
   */
  private detectContaminationTypes(imageAnalysis: any): string[] {
    const detected: string[] = [];
    const predictions = imageAnalysis?.predictions || [];
    
    for (const [type, keywords] of Object.entries(this.CONTAMINATION_KEYWORDS)) {
      let score = 0;
      for (const pred of predictions) {
        if (keywords.some(k => pred.className?.toLowerCase().includes(k))) {
          score += pred.probability || 0;
        }
      }
      // Require strong visual evidence — threshold 0.15 (was 0.25 + false terrain triggers)
      if (score > 0.15) {
        detected.push(type);
      }
    }
    
    return detected;
  }

  /**
   * Estimate contamination distance using source-type base distances,
   * adjusted by water probability (proxy for proximity to drainage),
   * terrain type (valley/drainage = closer water table), and
   * vegetation density from image analysis (denser veg = more moisture = closer water).
   */
  private estimateDistance(type: string, waterProb: number, terrainType: string, vegetationScore: number): number {
    // Base distances from hydrogeological literature (WHO guidelines for setback distances)
    const baseDistance: Record<string, number> = {
      sewage: 150,      // WHO minimum setback: 30m, typical: 100-200m
      factory: 500,     // Industrial buffer zones: 300-1000m
      agricultural: 250, // Pesticide drift zones: 100-500m
      landfill: 700,    // Landfill leachate plumes: 500-2000m
      industrial: 500   // Industrial setback: 300-1000m
    };

    let distance = baseDistance[type] || 400;

    // Terrain adjustment: valleys and drainage areas concentrate contaminants closer
    const terrainMultiplier: Record<string, number> = {
      valley: 0.7,    // Contaminants concentrate in valleys
      drainage: 0.65,  // Drainage channels carry contaminants
      flat: 1.0,      // No topographic concentration
      slope: 1.15     // Slopes disperse contaminants further
    };
    distance *= terrainMultiplier[terrainType] ?? 1.0;

    // Water probability adjustment: higher water presence = shallower water table = more vulnerable
    if (waterProb > 0.6) {
      distance *= 0.7;
    } else if (waterProb > 0.4) {
      distance *= 0.85;
    } else if (waterProb < 0.2) {
      distance *= 1.2;
    }

    // Vegetation density: dense vegetation near contamination sources
    // indicates moisture — contamination may be traveling through subsurface
    if (vegetationScore > 0.6) {
      distance *= 0.9;
    }

    return Math.round(Math.max(30, distance));
  }

  /**
   * Determine contamination direction based on terrain type and water flow.
   *
   * In hydrogeology, contamination travels along groundwater flow paths.
   * Flow direction is governed by topography:
   * - Valleys: contamination flows downstream (South/Southwest in Kenya's rift)
   * - Slopes: contamination flows downhill
   * - Drainage: follows drainage channel direction
   * - Flat: disperses radially — direction based on source type placement
   *
   * Uses terrain + source-type to produce a deterministic, physically-motivated direction.
   */
  private estimateDirection(type: string, terrainType: string, waterProb: number): string {
    // Terrain-based dominant flow direction (hydrogeological convention)
    const terrainFlowDir: Record<string, string> = {
      valley: 'South',       // Valleys drain downstream
      slope: 'Southwest',    // Slopes: downhill flow (predominant in East Africa)
      drainage: 'Southeast',  // Drainage channels
      flat: 'variable'       // No dominant direction
    };

    const flowDir = terrainFlowDir[terrainType] || 'variable';

    if (flowDir !== 'variable') {
      return flowDir;
    }

    // For flat terrain, direction depends on source type placement patterns
    // (based on typical land-use zoning around settlements)
    const sourcePlacementDir: Record<string, string> = {
      sewage: 'South',        // Sewage facilities typically placed downstream/south of settlements
      factory: 'West',        // Industrial zones often west (downwind in East Africa)
      agricultural: 'North',  // Farmland often surrounds settlements on upland side
      landfill: 'Southwest',  // Waste sites placed away from prevailing wind
      industrial: 'Northwest' // Industrial zones in peri-urban areas
    };

    return sourcePlacementDir[type] || 'South';
  }

  private assessSeverity(type: string, waterProb: number): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, number> = {
      sewage: 0.7,
      factory: 0.8,
      agricultural: 0.5,
      landfill: 0.6,
      industrial: 0.9
    };
    
    const baseSeverity = severityMap[type] || 0.5;
    const adjusted = baseSeverity + (waterProb * 0.2);
    
    if (adjusted > 0.85) return 'critical';
    if (adjusted > 0.65) return 'high';
    if (adjusted > 0.4) return 'medium';
    return 'low';
  }

  private calculateRiskLevel(type: string, waterProb: number, distance: number): number {
    const typeRisk: Record<string, number> = {
      sewage: 0.6,
      factory: 0.8,
      agricultural: 0.4,
      landfill: 0.7,
      industrial: 0.85
    };
    
    let risk = typeRisk[type] || 0.5;
    risk += waterProb * 0.2;
    
    const distanceFactor = Math.min(distance / 500, 1);
    risk = risk * (1 - distanceFactor * 0.5);
    
    return Math.min(risk, 0.95);
  }

  getMitigationStrategies(sources: ContaminationSource[]): string[] {
    const strategies: string[] = [];
    
    for (const source of sources) {
      switch (source.type) {
        case 'sewage':
          strategies.push('Install sanitary seal and casing to minimum 30m depth');
          strategies.push('Conduct bacteriological testing before consumption');
          strategies.push('Consider UV treatment system');
          strategies.push('Install backflow prevention devices');
          break;
        case 'factory':
          strategies.push('Chemical testing panel required for heavy metals');
          strategies.push('Reverse osmosis treatment recommended');
          strategies.push('Install monitoring wells for quarterly testing');
          strategies.push('Conduct Environmental Impact Assessment');
          break;
        case 'agricultural':
          strategies.push('Test for nitrates and pesticides');
          strategies.push('Activated carbon filtration recommended');
          strategies.push('Seasonal water quality monitoring required');
          strategies.push('Establish protection buffer zone');
          break;
        case 'landfill':
          strategies.push('Extended casing depth to bypass contaminated zones');
          strategies.push('Install bentonite seal around casing');
          strategies.push('Regular leachate monitoring program');
          strategies.push('Consider alternative location if possible');
          break;
        case 'industrial':
          strategies.push('Comprehensive chemical analysis mandatory');
          strategies.push('Advanced treatment system required');
          strategies.push('Legal compliance assessment needed');
          strategies.push('Install multiple barrier protection system');
          break;
      }
    }
    
    return [...new Set(strategies)];
  }
}