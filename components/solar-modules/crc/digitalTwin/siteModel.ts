// DIGITAL TWIN - SITE MODEL
// 3D site reconstruction and modeling

export interface SiteModel {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  geometry: {
    boundaries: number[][];
    area: number;
    perimeter: number;
  };
  terrain: {
    elevation: number;
    slope: number;
    aspect: number;
    hillshade: number;
  };
  buildings: BuildingModel[];
  vegetation: VegetationModel[];
  obstructions: ObstructionModel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingModel {
  id: string;
  footprint: number[][];
  height: number;
  roofType: string;
  roofPitch: number;
  orientation: number;
  area: number;
  material: string;
  age: number;
  solarPotential: number;
}

export interface VegetationModel {
  id: string;
  type: string;
  location: { x: number; y: number };
  height: number;
  canopyDiameter: number;
  species: string;
  seasonalImpact: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  };
}

export interface ObstructionModel {
  id: string;
  type: 'chimney' | 'vent' | 'antenna' | 'other';
  location: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  shadingImpact: number;
}

class SiteModelService {
  private models: Map<string, SiteModel> = new Map();
  
  async createSiteModel(lat: number, lng: number, address: string): Promise<SiteModel> {
    const id = this.generateId();
    
    const siteModel: SiteModel = {
      id,
      name: `Site_${address.substring(0, 20)}`,
      location: { lat, lng, address },
      geometry: await this.calculateGeometry(lat, lng),
      terrain: await this.getTerrainData(lat, lng),
      buildings: await this.detectBuildings(lat, lng),
      vegetation: await this.detectVegetation(lat, lng),
      obstructions: await this.detectObstructions(lat, lng),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.models.set(id, siteModel);
    return siteModel;
  }
  
  async getSiteModel(id: string): Promise<SiteModel | null> {
    return this.models.get(id) || null;
  }
  
  async updateSiteModel(id: string, updates: Partial<SiteModel>): Promise<SiteModel | null> {
    const model = await this.getSiteModel(id);
    if (!model) return null;
    
    const updated = { ...model, ...updates, updatedAt: new Date() };
    this.models.set(id, updated);
    return updated;
  }
  
  async deleteSiteModel(id: string): Promise<boolean> {
    return this.models.delete(id);
  }
  
  async getSolarPotential(siteId: string): Promise<{
    annual: number;
    monthly: number[];
    hourly: number[];
    optimalTilt: number;
    optimalAzimuth: number;
    shadingLoss: number;
  }> {
    const site = await this.getSiteModel(siteId);
    if (!site) throw new Error('Site not found');
    
    // Calculate solar potential based on terrain, buildings, obstructions
    const baseIrradiance = 5.2; // kWh/m²/day
    const shadingFactor = this.calculateShadingFactor(site);
    const tiltFactor = Math.cos(site.buildings[0]?.roofPitch * Math.PI / 180) || 0.95;
    
    return {
      annual: baseIrradiance * 365 * tiltFactor * shadingFactor,
      monthly: this.calculateMonthlyIrradiance(baseIrradiance, tiltFactor, shadingFactor),
      hourly: this.calculateHourlyIrradiance(baseIrradiance, tiltFactor, shadingFactor),
      optimalTilt: Math.abs(site.location.lat) * 0.9 + 10,
      optimalAzimuth: site.location.lat > 0 ? 180 : 0,
      shadingLoss: (1 - shadingFactor) * 100
    };
  }
  
  async exportModel(id: string, format: 'json' | 'gltf' | 'obj' = 'json'): Promise<string> {
    const model = await this.getSiteModel(id);
    if (!model) throw new Error('Site not found');
    
    if (format === 'json') {
      return JSON.stringify(model, null, 2);
    }
    
    // For 3D formats, would convert to appropriate format
    return JSON.stringify(model);
  }
  
  private async calculateGeometry(lat: number, lng: number): Promise<SiteModel['geometry']> {
    // Calculate site boundaries (100m x 100m area)
    const delta = 0.0009; // ~100m
    return {
      boundaries: [
        [lng - delta, lat - delta],
        [lng + delta, lat - delta],
        [lng + delta, lat + delta],
        [lng - delta, lat + delta]
      ],
      area: 10000, // 100m x 100m = 10,000 m²
      perimeter: 400
    };
  }
  
  private async getTerrainData(lat: number, lng: number): Promise<SiteModel['terrain']> {
    // In production, fetch from elevation API
    return {
      elevation: 1795,
      slope: 5.2,
      aspect: 135,
      hillshade: 0.75
    };
  }
  
  private async detectBuildings(lat: number, lng: number): Promise<BuildingModel[]> {
    // In production, use satellite imagery + AI detection
    return [
      {
        id: 'building_1',
        footprint: [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
        height: 6.5,
        roofType: 'gable',
        roofPitch: 22.5,
        orientation: 15,
        area: 48.3,
        material: 'concrete',
        age: 8,
        solarPotential: 0.92
      }
    ];
  }
  
  private async detectVegetation(lat: number, lng: number): Promise<VegetationModel[]> {
    // In production, use satellite NDVI analysis
    return [
      {
        id: 'tree_1',
        type: 'tree',
        location: { x: 8, y: 5 },
        height: 8.5,
        canopyDiameter: 4.2,
        species: 'Acacia',
        seasonalImpact: { spring: 0.7, summer: 0.85, autumn: 0.6, winter: 0.3 }
      }
    ];
  }
  
  private async detectObstructions(lat: number, lng: number): Promise<ObstructionModel[]> {
    return [
      {
        id: 'chimney_1',
        type: 'chimney',
        location: { x: 2.5, y: 3.2, z: 1.8 },
        dimensions: { width: 0.8, height: 1.5, depth: 0.8 },
        shadingImpact: 0.08
      }
    ];
  }
  
  private calculateShadingFactor(site: SiteModel): number {
    let factor = 1.0;
    
    // Reduce for obstructions
    for (const obs of site.obstructions) {
      factor -= obs.shadingImpact;
    }
    
    // Reduce for vegetation
    for (const veg of site.vegetation) {
      factor -= veg.seasonalImpact.summer * 0.1;
    }
    
    return Math.max(0.6, Math.min(1.0, factor));
  }
  
  private calculateMonthlyIrradiance(base: number, tilt: number, shading: number): number[] {
    const monthly = [];
    const seasonalFactors = [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 0.95, 0.9];
    
    for (let i = 0; i < 12; i++) {
      monthly.push(base * seasonalFactors[i] * tilt * shading);
    }
    
    return monthly;
  }
  
  private calculateHourlyIrradiance(base: number, tilt: number, shading: number): number[] {
    const hourly = [];
    for (let hour = 0; hour < 24; hour++) {
      let factor = 0;
      if (hour >= 6 && hour <= 18) {
        factor = Math.sin((hour - 6) / 12 * Math.PI);
      }
      hourly.push(base * factor * tilt * shading);
    }
    return hourly;
  }
  
  private generateId(): string {
    return `site_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const siteModel = new SiteModelService();