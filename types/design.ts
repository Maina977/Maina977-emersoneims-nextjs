// Building Design Types

export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'storage' | 'garage' | 'other';
  width: number;
  depth: number;
  height: number;
  floor: number;
  position: { x: number; y: number };
}

export interface WallDesign {
  type: 'stone' | 'block' | 'brick' | 'timber';
  thickness: number;
  finish: 'plastered' | 'fairface' | 'painted';
  insulation?: boolean;
}

export interface FoundationDesign {
  type: 'strip' | 'pad' | 'raft' | 'pile';
  depth: number;
  width: number;
  reinforcement: 'light' | 'medium' | 'heavy';
  concreteClass: 'C20' | 'C25' | 'C30' | 'C35';
}

export interface RoofDesign {
  type: 'pitched' | 'flat' | 'hip' | 'gable' | 'mansard';
  material: 'tiles' | 'iron_sheets' | 'shingles' | 'concrete';
  pitch: number;
  overhang: number;
  guttering: boolean;
}

export interface Door {
  id: string;
  type: 'internal' | 'external' | 'sliding' | 'garage';
  width: number;
  height: number;
  material: 'wood' | 'steel' | 'glass' | 'upvc';
  position: { x: number; y: number };
}

export interface Window {
  id: string;
  type: 'casement' | 'sliding' | 'fixed' | 'louvre';
  width: number;
  height: number;
  material: 'aluminum' | 'upvc' | 'wood';
  glazing: 'single' | 'double';
  position: { x: number; y: number };
}

export interface ElectricalDesign {
  lightingPoints: number;
  socketPoints: number;
  acPoints: number;
  mainBreakerAmps: number;
  phases: 1 | 3;
  solarReady: boolean;
  backupGenerator: boolean;
}

export interface PlumbingDesign {
  waterPoints: number;
  drainagePoints: number;
  hotWaterSystem: 'electric' | 'solar' | 'gas' | 'none';
  tankCapacity: number;
  boreholeConnection: boolean;
}

export interface HVACDesign {
  cooling: 'split' | 'central' | 'none';
  heating: 'electric' | 'gas' | 'none';
  ventilation: 'natural' | 'mechanical';
  acUnits: number;
}

export interface StructuralDesign {
  beams: {
    type: string;
    size: string;
    material: string;
    count: number;
  }[];
  columns: {
    type: string;
    size: string;
    material: string;
    count: number;
  }[];
  slabs: {
    type: string;
    thickness: number;
    reinforcement: string;
  }[];
  loadBearingWalls: boolean;
}

export interface FinishesDesign {
  flooring: {
    type: 'tiles' | 'wood' | 'concrete' | 'carpet' | 'terrazzo';
    grade: 'standard' | 'premium' | 'luxury';
  };
  walls: {
    finish: 'paint' | 'wallpaper' | 'texture';
    grade: 'standard' | 'premium';
  };
  ceilings: {
    type: 'gypsum' | 'timber' | 'exposed' | 'acoustic';
  };
}

export interface AmenitiesDesign {
  pool: boolean;
  poolSize?: { width: number; length: number; depth: number };
  garden: boolean;
  gardenArea?: number;
  parking: number;
  security: {
    cctv: boolean;
    alarm: boolean;
    electricFence: boolean;
    intercom: boolean;
  };
}

export interface LandscapingDesign {
  lawn: number; // square meters
  paving: number;
  driveway: number;
  trees: number;
  irrigation: boolean;
  retainingWalls: number;
}

export interface EnergySystems {
  solarPanels: {
    installed: boolean;
    capacity: number; // kW
    batteryBackup: boolean;
    batteryCapacity?: number; // kWh
  };
  rainwaterHarvesting: {
    installed: boolean;
    tankCapacity?: number; // liters
  };
  greyWaterRecycling: boolean;
}

export interface DesignData {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  county: string;

  // Site
  plotSize: number;
  buildingFootprint: number;
  totalArea: number;
  floors: number;

  // Design elements
  rooms: Room[];
  walls: WallDesign;
  foundation: FoundationDesign;
  roof: RoofDesign;
  doors: Door[];
  windows: Window[];

  // MEP
  electrical: ElectricalDesign;
  plumbing: PlumbingDesign;
  hvac?: HVACDesign;

  // Structural
  structural: StructuralDesign;

  // Finishes & Amenities
  finishes: FinishesDesign;
  amenities: AmenitiesDesign;
  landscaping: LandscapingDesign;
  energy: EnergySystems;

  // Metadata
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'approved' | 'construction';
}
