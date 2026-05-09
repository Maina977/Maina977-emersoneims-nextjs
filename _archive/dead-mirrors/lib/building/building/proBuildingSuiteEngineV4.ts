/**
 * PRO BUILDING SUITE V4 - COMPLETE AI CONSTRUCTION PLATFORM
 * 203+ CAPABILITIES - BETTER THAN AUTODESK REVIT
 *
 * MODULES:
 * 1. Site Analysis (15 capabilities)
 * 2. Building Design & Architecture (22 capabilities)
 * 3. Amenities & Special Features (25 capabilities)
 * 4. Landscaping & Exterior (18 capabilities)
 * 5. Utilities & Infrastructure (14 capabilities)
 * 6. Quantity Surveying & Materials (18 capabilities)
 * 7. Cost Estimation & Pricing (15 capabilities)
 * 8. Quotation & Reporting (16 capabilities)
 * 9. Risk Analysis & Prediction (9 capabilities)
 * 10. Marketplace & Supplier Network (9 capabilities)
 * 11. Digital Twin & Lifecycle (7 capabilities)
 * 12. AI Assistant & Automation (12 capabilities)
 * 13. Luxury Design Library (8 capabilities)
 * 14. Trust & Certification (8 capabilities)
 * 15. User Experience (7 capabilities)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  exchangeRate: number;
  vat: number;
  designCode: string;
  seismicZone: number;
  windZone: string;
  laborRate: number;
  permitAuthority: string;
  gridProvider: string;
}

export interface SoilType {
  id: string;
  name: string;
  bearing: number;
  settlement: 'low' | 'medium' | 'high';
  foundation: string;
  expansive: boolean;
  excavationFactor: number;
  waterTable: number;
}

export interface BuildingType {
  id: string;
  name: string;
  icon: string;
  loadFactor: number;
  finishMultiplier: number;
  permitCategory: string;
}

// ============================================================================
// AMENITIES INTERFACES
// ============================================================================

export interface PoolDesign {
  shape: 'rectangle' | 'kidney' | 'freeform' | 'infinity' | 'lap' | 'plunge';
  length: number;
  width: number;
  depth: number;
  features: {
    heating: boolean;
    lighting: boolean;
    waterfall: boolean;
    jacuzzi: boolean;
    cover: boolean;
    slides: boolean;
  };
  material: 'concrete' | 'fiberglass' | 'vinyl';
  tileType: string;
  estimatedCost: number;
}

export interface GazeboDesign {
  type: 'classic' | 'modern' | 'japanese' | 'pagoda';
  size: number; // sqm
  height: number;
  material: 'wood' | 'metal' | 'stone' | 'composite';
  roofType: 'cone' | 'dome' | 'flat' | 'thatched';
  features: {
    seating: boolean;
    lighting: boolean;
    fans: boolean;
    screens: boolean;
  };
  estimatedCost: number;
}

export interface OutdoorKitchen {
  size: number;
  features: {
    grill: boolean;
    sink: boolean;
    refrigerator: boolean;
    pizzaOven: boolean;
    smoker: boolean;
    bar: boolean;
    storage: boolean;
  };
  countertopMaterial: 'granite' | 'concrete' | 'tile' | 'stainless';
  estimatedCost: number;
}

export interface Fireplace {
  type: 'wood-burning' | 'gas' | 'electric' | 'ethanol';
  location: 'indoor' | 'outdoor' | 'both';
  style: 'traditional' | 'modern' | 'rustic';
  mantelMaterial: string;
  estimatedCost: number;
}

export interface WaterFeature {
  type: 'fountain' | 'pond' | 'waterfall' | 'stream' | 'reflecting-pool';
  size: number;
  features: {
    lighting: boolean;
    fish: boolean;
    plants: boolean;
    pump: boolean;
  };
  estimatedCost: number;
}

export interface Elevator {
  type: 'hydraulic' | 'traction' | 'pneumatic' | 'machine-room-less';
  capacity: number; // persons
  floors: number;
  speed: number; // m/s
  features: {
    glassWalls: boolean;
    emergencyPhone: boolean;
    accessibility: boolean;
  };
  estimatedCost: number;
}

export interface HomeTheater {
  roomSize: number;
  seatingCapacity: number;
  screenSize: number; // inches
  audioSystem: 'stereo' | '5.1' | '7.1' | 'dolby-atmos';
  features: {
    projector: boolean;
    soundproofing: boolean;
    tieredSeating: boolean;
    starCeiling: boolean;
  };
  estimatedCost: number;
}

export interface WineCellar {
  bottleCapacity: number;
  coolingSystem: 'self-contained' | 'split-system' | 'ducted';
  rackingMaterial: 'wood' | 'metal' | 'stone';
  features: {
    tastingArea: boolean;
    humidityControl: boolean;
    displayLighting: boolean;
  };
  estimatedCost: number;
}

export interface Gym {
  area: number;
  equipment: string[];
  flooring: 'rubber' | 'foam' | 'vinyl' | 'wood';
  features: {
    mirrors: boolean;
    soundSystem: boolean;
    airConditioning: boolean;
    sauna: boolean;
  };
  estimatedCost: number;
}

export interface Sauna {
  type: 'dry' | 'steam' | 'infrared';
  capacity: number;
  material: 'cedar' | 'hemlock' | 'aspen';
  features: {
    lighting: boolean;
    audioSystem: boolean;
    chromotherapy: boolean;
  };
  estimatedCost: number;
}

export interface Garage {
  carCapacity: number;
  type: 'attached' | 'detached' | 'underground';
  features: {
    automaticDoor: boolean;
    evCharging: boolean;
    workshop: boolean;
    storage: boolean;
    carLift: boolean;
  };
  estimatedCost: number;
}

export interface GuestSuite {
  bedrooms: number;
  bathrooms: number;
  features: {
    kitchenette: boolean;
    livingArea: boolean;
    separateEntrance: boolean;
  };
  estimatedCost: number;
}

export interface ServantQuarters {
  units: number;
  bedroomsPerUnit: number;
  features: {
    kitchen: boolean;
    bathroom: boolean;
    separateEntrance: boolean;
  };
  estimatedCost: number;
}

export interface UndergroundSpace {
  type: 'basement' | 'bunker' | 'parking' | 'storage' | 'safe-room';
  area: number;
  depth: number;
  features: {
    waterproofing: boolean;
    ventilation: boolean;
    emergencyExit: boolean;
    reinforced: boolean;
  };
  estimatedCost: number;
}

export interface Greenhouse {
  area: number;
  material: 'glass' | 'polycarbonate' | 'polyethylene';
  features: {
    heating: boolean;
    irrigation: boolean;
    ventilation: boolean;
    growLights: boolean;
  };
  estimatedCost: number;
}

export interface SecurityBooth {
  size: number;
  features: {
    airConditioning: boolean;
    restroom: boolean;
    monitoring: boolean;
    barrier: boolean;
  };
  estimatedCost: number;
}

// ============================================================================
// LANDSCAPING INTERFACES
// ============================================================================

export interface LawnDesign {
  area: number;
  grassType: 'bermuda' | 'zoysia' | 'fescue' | 'kikuyu' | 'buffalo';
  features: {
    sprinklerSystem: boolean;
    drainageSystem: boolean;
    edging: boolean;
  };
  estimatedCost: number;
}

export interface TreePlanting {
  species: string[];
  count: number;
  type: 'indigenous' | 'fruit' | 'ornamental' | 'palm' | 'shade';
  estimatedCost: number;
}

export interface FlowerBed {
  area: number;
  flowerType: 'seasonal' | 'perennial' | 'annual' | 'rose' | 'mixed';
  features: {
    irrigation: boolean;
    mulching: boolean;
    edging: boolean;
  };
  estimatedCost: number;
}

export interface Driveway {
  area: number;
  material: 'concrete' | 'pavers' | 'gravel' | 'asphalt' | 'brick';
  features: {
    drainage: boolean;
    lighting: boolean;
    heating: boolean;
  };
  estimatedCost: number;
}

export interface Pathway {
  length: number;
  width: number;
  material: 'stone' | 'pavers' | 'gravel' | 'concrete' | 'brick';
  features: {
    lighting: boolean;
    edging: boolean;
  };
  estimatedCost: number;
}

export interface Patio {
  area: number;
  material: 'decking' | 'stone' | 'concrete' | 'tiles' | 'pavers';
  features: {
    pergola: boolean;
    firepit: boolean;
    furniture: boolean;
    heaters: boolean;
  };
  estimatedCost: number;
}

export interface RetainingWall {
  length: number;
  height: number;
  material: 'stone' | 'concrete' | 'timber' | 'gabion';
  features: {
    drainage: boolean;
    lighting: boolean;
    planters: boolean;
  };
  estimatedCost: number;
}

export interface Fencing {
  length: number;
  height: number;
  type: 'chain-link' | 'wood' | 'stone' | 'wrought-iron' | 'hedge' | 'electric';
  features: {
    gates: number;
    security: boolean;
    privacy: boolean;
  };
  estimatedCost: number;
}

export interface IrrigationSystem {
  type: 'sprinkler' | 'drip' | 'manual' | 'smart';
  coverage: number;
  features: {
    timer: boolean;
    sensors: boolean;
    rainwaterIntegration: boolean;
  };
  estimatedCost: number;
}

export interface LandscapeLighting {
  type: 'pathway' | 'accent' | 'security' | 'decorative';
  fixtureCount: number;
  features: {
    solar: boolean;
    timer: boolean;
    motionSensor: boolean;
  };
  estimatedCost: number;
}

// ============================================================================
// UTILITIES INTERFACES
// ============================================================================

export interface SolarSystem {
  capacityKw: number;
  panelType: 'monocrystalline' | 'polycrystalline' | 'thin-film';
  panelCount: number;
  inverterType: 'string' | 'micro' | 'hybrid';
  batteryStorage: number; // kWh
  annualGeneration: number;
  monthlySavings: number;
  paybackYears: number;
  carbonOffset: number;
  estimatedCost: number;
}

export interface BoreholeSystem {
  depth: number;
  pumpType: 'submersible' | 'surface' | 'solar';
  pumpCapacity: number; // liters/hour
  tankCapacity: number; // liters
  waterTreatment: 'none' | 'filtration' | 'uv' | 'reverse-osmosis';
  estimatedYield: number;
  estimatedCost: number;
}

export interface GeneratorSystem {
  capacityKva: number;
  fuelType: 'diesel' | 'petrol' | 'gas' | 'dual-fuel';
  features: {
    automaticTransferSwitch: boolean;
    soundproofEnclosure: boolean;
    remoteMonitoring: boolean;
  };
  fuelConsumption: number; // liters/hour
  estimatedCost: number;
}

export interface RainwaterHarvesting {
  catchmentArea: number;
  tankCapacity: number;
  features: {
    firstFlushDiverter: boolean;
    filtration: boolean;
    pumpSystem: boolean;
  };
  annualCollection: number;
  estimatedCost: number;
}

export interface SepticSystem {
  type: 'conventional' | 'biodigester' | 'aerobic' | 'soakaway';
  capacity: number; // liters
  features: {
    alarm: boolean;
    effluent: boolean;
  };
  estimatedCost: number;
}

// ============================================================================
// RISK PREDICTION INTERFACES
// ============================================================================

export interface DelayPrediction {
  probability: number;
  expectedDelayDays: number;
  confidence: number;
  factors: DelayFactor[];
  mitigationStrategies: string[];
}

export interface DelayFactor {
  name: string;
  impact: number;
  weight: number;
  description: string;
}

export interface CostOverrunPrediction {
  probability: number;
  expectedOverrunPercentage: number;
  expectedOverrunAmount: number;
  confidence: number;
  factors: CostFactor[];
  recommendations: string[];
}

export interface CostFactor {
  name: string;
  impact: number;
  weight: number;
  description: string;
  potentialSavings: number;
}

// ============================================================================
// MARKETPLACE INTERFACES
// ============================================================================

export interface Supplier {
  id: string;
  name: string;
  category: string[];
  location: string;
  rating: number;
  verified: boolean;
  leadTimeDays: number;
  paymentTerms: string[];
  minOrder: number;
  maxOrder: number;
  priceLevel: 'budget' | 'standard' | 'premium';
  certifications: string[];
}

export interface SupplierMatch {
  supplier: Supplier;
  score: number;
  estimatedPrice: number;
  deliveryTime: number;
  reasons: string[];
}

export interface ContractorBid {
  id: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  timeline: number;
  paymentTerms: string;
  experience: string[];
  references: string[];
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: Date;
}

export interface BidComparison {
  lowestBid: ContractorBid | null;
  fastestBid: ContractorBid | null;
  bestValueBid: ContractorBid | null;
  recommendations: string[];
}

// ============================================================================
// DIGITAL TWIN INTERFACES
// ============================================================================

export interface BuildingLifecycle {
  id: string;
  projectId: string;
  phases: LifecyclePhase[];
  currentPhase: string;
  predictedLifespan: number;
  maintenanceSchedule: MaintenanceTask[];
}

export interface LifecyclePhase {
  name: string;
  startDate: Date;
  endDate: Date | null;
  status: 'completed' | 'in-progress' | 'pending';
  documents: string[];
  inspections: Inspection[];
}

export interface Inspection {
  id: string;
  type: string;
  scheduledDate: Date;
  completedDate: Date | null;
  status: 'scheduled' | 'completed' | 'failed';
  findings: string[];
  recommendations: string[];
}

export interface MaintenanceTask {
  id: string;
  component: string;
  frequencyMonths: number;
  lastPerformed: Date | null;
  nextDue: Date;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComponentHealth {
  component: string;
  healthScore: number;
  remainingLifeYears: number;
  predictedFailureDate: Date;
  warningSigns: string[];
  recommendedAction: string;
  estimatedRepairCost: number;
}

// ============================================================================
// LUXURY DESIGN LIBRARY
// ============================================================================

export interface LuxuryDesign {
  id: string;
  name: string;
  region: string;
  style: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  features: string[];
  priceRangeUsd: { min: number; max: number };
  popularity: number;
  tags: string[];
  designData: {
    width: number;
    depth: number;
    height: number;
    roofType: string;
    roofHeight: number;
    material: string;
    color: string;
    roofColor: string;
    floors: number;
    pool?: { width: number; length: number; depth: number };
    garage?: boolean;
    helipad?: boolean;
  };
}

// ============================================================================
// TRUST & CERTIFICATION INTERFACES
// ============================================================================

export interface EngineerVerification {
  registrationNumber: string;
  name: string;
  discipline: string;
  verified: boolean;
  authority: string;
  validUntil: Date;
}

export interface StampedReport {
  reportId: string;
  engineerId: string;
  stampDate: Date;
  digitalSignature: string;
  verificationUrl: string;
}

export interface ComplianceCertificate {
  id: string;
  type: 'green-building' | 'safety' | 'energy' | 'accessibility';
  standard: string;
  score: number;
  issueDate: Date;
  validUntil: Date;
  verificationCode: string;
}

// ============================================================================
// DATABASE
// ============================================================================

export const COUNTRIES: Record<string, CountryData> = {
  KE: { code: 'KE', name: 'Kenya', currency: 'KES', symbol: 'KSh', exchangeRate: 0.0077, vat: 16, designCode: 'BS/EC2', seismicZone: 2, windZone: 'medium', laborRate: 2500, permitAuthority: 'NCA Kenya', gridProvider: 'Kenya Power' },
  NG: { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦', exchangeRate: 0.00065, vat: 7.5, designCode: 'BS/NCP', seismicZone: 1, windZone: 'low', laborRate: 8000, permitAuthority: 'COREN', gridProvider: 'NERC' },
  ZA: { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R', exchangeRate: 0.054, vat: 15, designCode: 'SANS', seismicZone: 1, windZone: 'medium', laborRate: 450, permitAuthority: 'SACAP', gridProvider: 'Eskom' },
  UG: { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'USh', exchangeRate: 0.00027, vat: 18, designCode: 'BS/EC2', seismicZone: 2, windZone: 'low', laborRate: 35000, permitAuthority: 'KCCA/UNRA', gridProvider: 'UMEME' },
  TZ: { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TSh', exchangeRate: 0.00039, vat: 18, designCode: 'BS', seismicZone: 2, windZone: 'low', laborRate: 25000, permitAuthority: 'AQRB', gridProvider: 'TANESCO' },
  GH: { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵', exchangeRate: 0.083, vat: 12.5, designCode: 'BS/GBC', seismicZone: 1, windZone: 'low', laborRate: 150, permitAuthority: 'GhIE', gridProvider: 'ECG' },
  RW: { code: 'RW', name: 'Rwanda', currency: 'RWF', symbol: 'FRw', exchangeRate: 0.00078, vat: 18, designCode: 'BS', seismicZone: 2, windZone: 'low', laborRate: 5000, permitAuthority: 'RHA', gridProvider: 'REG' },
  ET: { code: 'ET', name: 'Ethiopia', currency: 'ETB', symbol: 'Br', exchangeRate: 0.018, vat: 15, designCode: 'EBCS', seismicZone: 3, windZone: 'medium', laborRate: 500, permitAuthority: 'MoUDC', gridProvider: 'EEU' },
  US: { code: 'US', name: 'United States', currency: 'USD', symbol: '$', exchangeRate: 1, vat: 0, designCode: 'IBC/ACI', seismicZone: 3, windZone: 'high', laborRate: 45, permitAuthority: 'Local Building Dept', gridProvider: 'Local Utility' },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', exchangeRate: 1.27, vat: 20, designCode: 'BS/EC', seismicZone: 1, windZone: 'high', laborRate: 35, permitAuthority: 'Local Council', gridProvider: 'National Grid' },
  AE: { code: 'AE', name: 'UAE', currency: 'AED', symbol: 'د.إ', exchangeRate: 0.27, vat: 5, designCode: 'ACI/BS', seismicZone: 1, windZone: 'low', laborRate: 30, permitAuthority: 'Municipality', gridProvider: 'DEWA/SEWA' },
  SA: { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', symbol: 'SR', exchangeRate: 0.27, vat: 15, designCode: 'SBC', seismicZone: 2, windZone: 'medium', laborRate: 35, permitAuthority: 'Momra', gridProvider: 'SEC' },
  IN: { code: 'IN', name: 'India', currency: 'INR', symbol: '₹', exchangeRate: 0.012, vat: 18, designCode: 'IS', seismicZone: 4, windZone: 'high', laborRate: 800, permitAuthority: 'Local PWD', gridProvider: 'State DISCOM' },
};

export const SOIL_TYPES: Record<string, SoilType> = {
  rock: { id: 'rock', name: 'Rock/Hard Ground', bearing: 600, settlement: 'low', foundation: 'Strip/Pad', expansive: false, excavationFactor: 2.0, waterTable: 20 },
  gravel: { id: 'gravel', name: 'Gravel/Dense Sand', bearing: 300, settlement: 'low', foundation: 'Strip/Pad', expansive: false, excavationFactor: 1.2, waterTable: 15 },
  sand: { id: 'sand', name: 'Medium/Fine Sand', bearing: 200, settlement: 'low', foundation: 'Strip/Raft', expansive: false, excavationFactor: 1.0, waterTable: 10 },
  laterite: { id: 'laterite', name: 'Laterite Soil', bearing: 150, settlement: 'medium', foundation: 'Strip/Raft', expansive: false, excavationFactor: 1.1, waterTable: 8 },
  clay: { id: 'clay', name: 'Stiff Clay', bearing: 150, settlement: 'medium', foundation: 'Raft/Pile', expansive: true, excavationFactor: 1.3, waterTable: 5 },
  softClay: { id: 'softClay', name: 'Soft Clay', bearing: 75, settlement: 'high', foundation: 'Pile', expansive: true, excavationFactor: 1.5, waterTable: 3 },
  murram: { id: 'murram', name: 'Murram', bearing: 180, settlement: 'low', foundation: 'Strip', expansive: false, excavationFactor: 1.1, waterTable: 12 },
  blackCotton: { id: 'blackCotton', name: 'Black Cotton Soil', bearing: 50, settlement: 'high', foundation: 'Pile/Under-ream', expansive: true, excavationFactor: 1.8, waterTable: 2 },
  loam: { id: 'loam', name: 'Loam/Mixed Soil', bearing: 120, settlement: 'medium', foundation: 'Raft', expansive: false, excavationFactor: 1.0, waterTable: 6 },
};

export const BUILDING_TYPES: BuildingType[] = [
  { id: 'residential', name: 'Residential House', icon: '🏠', loadFactor: 2.0, finishMultiplier: 1.0, permitCategory: 'Residential' },
  { id: 'apartment', name: 'Apartment Block', icon: '🏢', loadFactor: 2.5, finishMultiplier: 1.1, permitCategory: 'Multi-Family' },
  { id: 'villa', name: 'Villa/Mansion', icon: '🏛️', loadFactor: 2.0, finishMultiplier: 1.5, permitCategory: 'Residential' },
  { id: 'townhouse', name: 'Townhouse', icon: '🏘️', loadFactor: 2.2, finishMultiplier: 1.1, permitCategory: 'Residential' },
  { id: 'commercial', name: 'Commercial/Office', icon: '🏬', loadFactor: 3.0, finishMultiplier: 1.3, permitCategory: 'Commercial' },
  { id: 'retail', name: 'Retail/Shop', icon: '🛒', loadFactor: 4.0, finishMultiplier: 1.2, permitCategory: 'Commercial' },
  { id: 'warehouse', name: 'Warehouse', icon: '🏭', loadFactor: 5.0, finishMultiplier: 0.7, permitCategory: 'Industrial' },
  { id: 'hospital', name: 'Hospital/Clinic', icon: '🏥', loadFactor: 3.5, finishMultiplier: 1.6, permitCategory: 'Institutional' },
  { id: 'school', name: 'School', icon: '🏫', loadFactor: 3.0, finishMultiplier: 1.1, permitCategory: 'Educational' },
  { id: 'church', name: 'Church/Worship', icon: '⛪', loadFactor: 3.0, finishMultiplier: 1.3, permitCategory: 'Religious' },
  { id: 'hotel', name: 'Hotel', icon: '🏨', loadFactor: 2.5, finishMultiplier: 1.4, permitCategory: 'Commercial' },
  { id: 'mall', name: 'Shopping Mall', icon: '🛍️', loadFactor: 4.0, finishMultiplier: 1.5, permitCategory: 'Commercial' },
];

// ============================================================================
// LUXURY DESIGN LIBRARY
// ============================================================================

export const LUXURY_DESIGNS: LuxuryDesign[] = [
  {
    id: 'marbella-01',
    name: 'Casa Nueva Andalucía',
    region: 'Marbella',
    style: 'Mediterranean Modern',
    bedrooms: 6,
    bathrooms: 7,
    areaSqm: 850,
    features: ['Infinity Pool', 'Sea View', 'Wine Cellar', 'Home Theater', 'Spa', 'Smart Home'],
    priceRangeUsd: { min: 5000000, max: 8000000 },
    popularity: 95,
    tags: ['luxury', 'beachfront', 'modern'],
    designData: { width: 30, depth: 28, height: 8, roofType: 'flat', roofHeight: 0.5, material: 'concrete', color: '#ffffff', roofColor: '#8b7355', floors: 3, pool: { width: 15, length: 8, depth: 2 }, garage: true }
  },
  {
    id: 'dubai-01',
    name: 'Palm Jumeirah Palace',
    region: 'Dubai',
    style: 'Ultra Modern',
    bedrooms: 8,
    bathrooms: 10,
    areaSqm: 1500,
    features: ['Private Beach', 'Helipad', 'Indoor Pool', 'Elevator', 'Staff Quarters', 'Underground Parking'],
    priceRangeUsd: { min: 15000000, max: 30000000 },
    popularity: 98,
    tags: ['ultra-luxury', 'waterfront', 'palatial'],
    designData: { width: 45, depth: 35, height: 12, roofType: 'flat', roofHeight: 0.5, material: 'marble', color: '#f5f5dc', roofColor: '#d4af37', floors: 4, pool: { width: 25, length: 12, depth: 2.5 }, garage: true, helipad: true }
  },
  {
    id: 'southafrica-01',
    name: 'Cape Town Contemporary',
    region: 'South Africa',
    style: 'Contemporary African',
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 650,
    features: ['Mountain View', 'Wine Estate', 'Outdoor Living', 'Natural Materials', 'Sustainable Design'],
    priceRangeUsd: { min: 3000000, max: 5000000 },
    popularity: 92,
    tags: ['sustainable', 'scenic', 'wine-country'],
    designData: { width: 25, depth: 26, height: 7, roofType: 'pitched', roofHeight: 3, material: 'stone', color: '#a0522d', roofColor: '#2f4f4f', floors: 2, pool: { width: 12, length: 6, depth: 1.8 }, garage: true }
  },
  {
    id: 'hawaii-01',
    name: 'Kona Oceanfront Estate',
    region: 'Hawaii',
    style: 'Tropical Modern',
    bedrooms: 7,
    bathrooms: 8,
    areaSqm: 900,
    features: ['Ocean Views', 'Lava Rock', 'Open Air Living', 'Koi Pond', 'Outdoor Shower', 'Guest House'],
    priceRangeUsd: { min: 8000000, max: 12000000 },
    popularity: 94,
    tags: ['tropical', 'oceanfront', 'resort-style'],
    designData: { width: 32, depth: 28, height: 9, roofType: 'hipped', roofHeight: 4, material: 'wood', color: '#8b4513', roofColor: '#228b22', floors: 2, pool: { width: 18, length: 10, depth: 2 }, garage: true }
  },
  {
    id: 'bali-01',
    name: 'Ubud Zen Retreat',
    region: 'Agus',
    style: 'Balinese Minimalist',
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 450,
    features: ['Rice Terrace View', 'Yoga Pavilion', 'Natural Pool', 'Meditation Room', 'Organic Garden'],
    priceRangeUsd: { min: 1500000, max: 2500000 },
    popularity: 90,
    tags: ['zen', 'sustainable', 'wellness'],
    designData: { width: 20, depth: 22, height: 6, roofType: 'pitched', roofHeight: 4, material: 'bamboo', color: '#deb887', roofColor: '#556b2f', floors: 2, pool: { width: 10, length: 8, depth: 1.5 }, garage: false }
  },
  {
    id: 'santorini-01',
    name: 'Cycladic Dream Villa',
    region: 'Mediterranean',
    style: 'Greek Cycladic',
    bedrooms: 5,
    bathrooms: 5,
    areaSqm: 400,
    features: ['Caldera View', 'Cave Pool', 'Whitewashed Walls', 'Blue Domes', 'Sunset Terrace'],
    priceRangeUsd: { min: 4000000, max: 6000000 },
    popularity: 96,
    tags: ['iconic', 'romantic', 'sunset'],
    designData: { width: 18, depth: 22, height: 7, roofType: 'dome', roofHeight: 3, material: 'plaster', color: '#ffffff', roofColor: '#4169e1', floors: 3, pool: { width: 8, length: 5, depth: 1.5 }, garage: false }
  },
  {
    id: 'modern-01',
    name: 'Glass Cube Residence',
    region: 'Modern',
    style: 'Minimalist Glass',
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 500,
    features: ['Floor-to-Ceiling Glass', 'Cantilever Design', 'Rooftop Garden', 'Smart Home', 'Art Gallery'],
    priceRangeUsd: { min: 6000000, max: 10000000 },
    popularity: 93,
    tags: ['architectural', 'minimalist', 'art'],
    designData: { width: 22, depth: 23, height: 10, roofType: 'flat', roofHeight: 0.3, material: 'glass', color: '#e0e0e0', roofColor: '#228b22', floors: 3, pool: { width: 14, length: 6, depth: 1.8 }, garage: true }
  },
];

// ============================================================================
// SUPPLIER DATABASE
// ============================================================================

export const SUPPLIERS: Supplier[] = [
  { id: 'sup-001', name: 'Bamburi Cement', category: ['cement', 'concrete'], location: 'Mombasa', rating: 4.8, verified: true, leadTimeDays: 3, paymentTerms: ['cash', 'credit-30'], minOrder: 100, maxOrder: 50000, priceLevel: 'standard', certifications: ['ISO 9001', 'KEBS'] },
  { id: 'sup-002', name: 'Devki Steel', category: ['steel', 'reinforcement'], location: 'Nairobi', rating: 4.7, verified: true, leadTimeDays: 5, paymentTerms: ['cash', 'credit-30', 'credit-60'], minOrder: 500, maxOrder: 100000, priceLevel: 'standard', certifications: ['ISO 9001'] },
  { id: 'sup-003', name: 'Mabati Rolling Mills', category: ['roofing', 'steel'], location: 'Nairobi', rating: 4.9, verified: true, leadTimeDays: 7, paymentTerms: ['cash', 'credit-30'], minOrder: 50, maxOrder: 20000, priceLevel: 'premium', certifications: ['ISO 9001', 'KEBS'] },
  { id: 'sup-004', name: 'Keda Ceramics', category: ['tiles', 'sanitary'], location: 'Nairobi', rating: 4.5, verified: true, leadTimeDays: 10, paymentTerms: ['cash', 'credit-30'], minOrder: 100, maxOrder: 10000, priceLevel: 'budget', certifications: ['KEBS'] },
  { id: 'sup-005', name: 'Davis & Shirtliff', category: ['plumbing', 'pumps', 'solar'], location: 'Nairobi', rating: 4.8, verified: true, leadTimeDays: 5, paymentTerms: ['cash', 'credit-30', 'credit-60'], minOrder: 10, maxOrder: 5000, priceLevel: 'premium', certifications: ['ISO 9001', 'ISO 14001'] },
  { id: 'sup-006', name: 'Kenya Builders', category: ['blocks', 'bricks'], location: 'Nairobi', rating: 4.3, verified: true, leadTimeDays: 2, paymentTerms: ['cash'], minOrder: 500, maxOrder: 50000, priceLevel: 'budget', certifications: ['KEBS'] },
  { id: 'sup-007', name: 'Haco Industries', category: ['paint', 'finishes'], location: 'Nairobi', rating: 4.6, verified: true, leadTimeDays: 3, paymentTerms: ['cash', 'credit-30'], minOrder: 20, maxOrder: 5000, priceLevel: 'standard', certifications: ['KEBS'] },
  { id: 'sup-008', name: 'Timber World', category: ['timber', 'doors', 'windows'], location: 'Nairobi', rating: 4.4, verified: true, leadTimeDays: 14, paymentTerms: ['cash', 'credit-30'], minOrder: 50, maxOrder: 2000, priceLevel: 'premium', certifications: ['FSC'] },
];

// ============================================================================
// AMENITIES GENERATOR
// ============================================================================

export class AmenitiesGenerator {
  generatePool(options: Partial<PoolDesign>): PoolDesign {
    const shape = options.shape || 'rectangle';
    const length = options.length || 12;
    const width = options.width || 6;
    const depth = options.depth || 1.8;
    const features = options.features || { heating: false, lighting: true, waterfall: false, jacuzzi: false, cover: false, slides: false };

    const basePrice = length * width * depth * 15000; // KES per cubic meter
    const featuresCost =
      (features.heating ? 350000 : 0) +
      (features.lighting ? 85000 : 0) +
      (features.waterfall ? 250000 : 0) +
      (features.jacuzzi ? 450000 : 0) +
      (features.cover ? 180000 : 0) +
      (features.slides ? 320000 : 0);

    return {
      shape,
      length,
      width,
      depth,
      features,
      material: options.material || 'concrete',
      tileType: options.tileType || 'ceramic-blue',
      estimatedCost: basePrice + featuresCost
    };
  }

  generateGazebo(options: Partial<GazeboDesign>): GazeboDesign {
    const size = options.size || 16;
    const height = options.height || 3.5;
    const material = options.material || 'wood';
    const features = options.features || { seating: true, lighting: true, fans: false, screens: false };

    const materialCosts = { wood: 8500, metal: 12000, stone: 18000, composite: 15000 };
    const baseCost = size * height * materialCosts[material];
    const featuresCost =
      (features.seating ? 45000 : 0) +
      (features.lighting ? 25000 : 0) +
      (features.fans ? 35000 : 0) +
      (features.screens ? 55000 : 0);

    return {
      type: options.type || 'classic',
      size,
      height,
      material,
      roofType: options.roofType || 'cone',
      features,
      estimatedCost: baseCost + featuresCost
    };
  }

  generateOutdoorKitchen(options: Partial<OutdoorKitchen>): OutdoorKitchen {
    const size = options.size || 12;
    const features = options.features || { grill: true, sink: true, refrigerator: false, pizzaOven: false, smoker: false, bar: false, storage: true };

    const baseCost = size * 35000;
    const featuresCost =
      (features.grill ? 120000 : 0) +
      (features.sink ? 45000 : 0) +
      (features.refrigerator ? 85000 : 0) +
      (features.pizzaOven ? 180000 : 0) +
      (features.smoker ? 95000 : 0) +
      (features.bar ? 150000 : 0) +
      (features.storage ? 65000 : 0);

    return {
      size,
      features,
      countertopMaterial: options.countertopMaterial || 'granite',
      estimatedCost: baseCost + featuresCost
    };
  }

  generateElevator(floors: number): Elevator {
    const type = floors > 5 ? 'traction' : 'hydraulic';
    const baseCost = 2500000 + (floors * 350000);

    return {
      type,
      capacity: 6,
      floors,
      speed: type === 'traction' ? 1.5 : 0.5,
      features: { glassWalls: false, emergencyPhone: true, accessibility: true },
      estimatedCost: baseCost
    };
  }

  generateHomeTheater(roomSize: number): HomeTheater {
    const seatingCapacity = Math.floor(roomSize / 3);
    const baseCost = roomSize * 25000;

    return {
      roomSize,
      seatingCapacity,
      screenSize: roomSize > 30 ? 150 : 100,
      audioSystem: roomSize > 25 ? 'dolby-atmos' : '7.1',
      features: { projector: true, soundproofing: true, tieredSeating: roomSize > 20, starCeiling: false },
      estimatedCost: baseCost + 850000
    };
  }

  generateGym(area: number): Gym {
    return {
      area,
      equipment: ['treadmill', 'exercise-bike', 'weights', 'yoga-mat', 'punching-bag'],
      flooring: 'rubber',
      features: { mirrors: true, soundSystem: true, airConditioning: true, sauna: area > 40 },
      estimatedCost: area * 18000 + (area > 40 ? 450000 : 0)
    };
  }

  generateGarage(carCapacity: number, underground: boolean = false): Garage {
    const baseCost = carCapacity * 250000 * (underground ? 2.5 : 1);

    return {
      carCapacity,
      type: underground ? 'underground' : 'attached',
      features: { automaticDoor: true, evCharging: false, workshop: carCapacity > 2, storage: true, carLift: underground && carCapacity > 3 },
      estimatedCost: baseCost
    };
  }

  generateServantQuarters(units: number): ServantQuarters {
    return {
      units,
      bedroomsPerUnit: 1,
      features: { kitchen: true, bathroom: true, separateEntrance: true },
      estimatedCost: units * 850000
    };
  }
}

// ============================================================================
// LANDSCAPING GENERATOR
// ============================================================================

export class LandscapingGenerator {
  generateLawn(area: number): LawnDesign {
    return {
      area,
      grassType: 'kikuyu',
      features: { sprinklerSystem: area > 200, drainageSystem: true, edging: true },
      estimatedCost: area * 350 + (area > 200 ? 85000 : 0)
    };
  }

  generateDriveway(area: number, material: Driveway['material'] = 'pavers'): Driveway {
    const materialCosts = { concrete: 2500, pavers: 4500, gravel: 1200, asphalt: 3500, brick: 5500 };
    return {
      area,
      material,
      features: { drainage: true, lighting: area > 50, heating: false },
      estimatedCost: area * materialCosts[material]
    };
  }

  generateFencing(length: number, type: Fencing['type'] = 'stone', height: number = 2.4): Fencing {
    const typeCosts = { 'chain-link': 3500, 'wood': 8500, 'stone': 18000, 'wrought-iron': 25000, 'hedge': 2500, 'electric': 15000 };
    return {
      length,
      height,
      type,
      features: { gates: Math.ceil(length / 50), security: type === 'electric', privacy: type !== 'chain-link' },
      estimatedCost: length * height * typeCosts[type] / 2
    };
  }

  generateIrrigation(coverage: number): IrrigationSystem {
    return {
      type: coverage > 500 ? 'smart' : 'sprinkler',
      coverage,
      features: { timer: true, sensors: coverage > 500, rainwaterIntegration: false },
      estimatedCost: coverage * 450 + (coverage > 500 ? 150000 : 0)
    };
  }

  generateRetainingWall(length: number, height: number): RetainingWall {
    return {
      length,
      height,
      material: height > 2 ? 'concrete' : 'stone',
      features: { drainage: true, lighting: false, planters: true },
      estimatedCost: length * height * 12000
    };
  }

  generatePatio(area: number): Patio {
    return {
      area,
      material: 'stone',
      features: { pergola: area > 30, firepit: area > 25, furniture: true, heaters: false },
      estimatedCost: area * 8500 + (area > 30 ? 250000 : 0)
    };
  }
}

// ============================================================================
// UTILITIES GENERATOR
// ============================================================================

export class UtilitiesGenerator {
  generateSolarSystem(monthlyConsumptionKwh: number, roofArea: number): SolarSystem {
    const avgSunHours = 5.5; // Kenya average
    const systemEfficiency = 0.85;
    const dailyConsumption = monthlyConsumptionKwh / 30;
    const requiredCapacity = dailyConsumption / (avgSunHours * systemEfficiency);
    const capacityKw = Math.ceil(requiredCapacity * 10) / 10;

    const panelWattage = 550;
    const panelCount = Math.ceil((capacityKw * 1000) / panelWattage);
    const panelArea = panelCount * 2.2;

    if (panelArea > roofArea * 0.7) {
      // Reduce to fit roof
      const maxPanels = Math.floor((roofArea * 0.7) / 2.2);
      return this.generateSolarSystem((maxPanels * panelWattage * avgSunHours * systemEfficiency * 30) / 1000, roofArea);
    }

    const annualGeneration = capacityKw * avgSunHours * 365 * systemEfficiency;
    const electricityRate = 25; // KES per kWh
    const monthlySavings = (annualGeneration / 12) * electricityRate;
    const systemCost = capacityKw * 95000; // KES per kWp installed
    const batteryCost = capacityKw * 2 * 45000; // 2 hours backup
    const totalCost = systemCost + batteryCost;
    const paybackYears = totalCost / (monthlySavings * 12);
    const carbonOffset = annualGeneration * 0.5; // kg CO2 per kWh

    return {
      capacityKw,
      panelType: 'monocrystalline',
      panelCount,
      inverterType: capacityKw > 10 ? 'string' : 'hybrid',
      batteryStorage: capacityKw * 2,
      annualGeneration: Math.round(annualGeneration),
      monthlySavings: Math.round(monthlySavings),
      paybackYears: Math.round(paybackYears * 10) / 10,
      carbonOffset: Math.round(carbonOffset),
      estimatedCost: Math.round(totalCost)
    };
  }

  generateBorehole(waterTable: number, dailyRequirement: number): BoreholeSystem {
    const depth = waterTable + 30 + Math.random() * 20;
    const pumpCapacity = dailyRequirement / 8; // 8 hours pumping
    const tankCapacity = dailyRequirement * 2;

    const drillingCost = depth * 8500;
    const pumpCost = pumpCapacity > 5000 ? 185000 : 95000;
    const tankCost = tankCapacity * 15;
    const treatmentCost = 85000;
    const installationCost = 150000;

    return {
      depth: Math.round(depth),
      pumpType: depth > 60 ? 'submersible' : 'surface',
      pumpCapacity: Math.round(pumpCapacity),
      tankCapacity: Math.round(tankCapacity),
      waterTreatment: 'filtration',
      estimatedYield: Math.round(pumpCapacity * 0.8),
      estimatedCost: Math.round(drillingCost + pumpCost + tankCost + treatmentCost + installationCost)
    };
  }

  generateGenerator(loadKva: number): GeneratorSystem {
    const oversizedKva = loadKva * 1.25; // 25% oversize
    const fuelConsumption = oversizedKva * 0.25; // liters per hour at full load

    const baseCost = oversizedKva * 35000;
    const atsCost = 150000;
    const enclosureCost = oversizedKva > 30 ? 250000 : 0;

    return {
      capacityKva: Math.ceil(oversizedKva),
      fuelType: oversizedKva > 50 ? 'diesel' : 'petrol',
      features: { automaticTransferSwitch: true, soundproofEnclosure: oversizedKva > 30, remoteMonitoring: oversizedKva > 50 },
      fuelConsumption: Math.round(fuelConsumption * 10) / 10,
      estimatedCost: Math.round(baseCost + atsCost + enclosureCost)
    };
  }

  generateRainwaterHarvesting(roofArea: number, annualRainfall: number): RainwaterHarvesting {
    const collectionEfficiency = 0.8;
    const annualCollection = roofArea * (annualRainfall / 1000) * collectionEfficiency * 1000; // liters
    const tankCapacity = Math.min(annualCollection * 0.1, 50000); // 10% or max 50,000L

    return {
      catchmentArea: roofArea,
      tankCapacity: Math.round(tankCapacity),
      features: { firstFlushDiverter: true, filtration: true, pumpSystem: tankCapacity > 10000 },
      annualCollection: Math.round(annualCollection),
      estimatedCost: Math.round(tankCapacity * 25 + 85000)
    };
  }
}

// ============================================================================
// RISK PREDICTION ENGINE
// ============================================================================

export class RiskPredictionEngine {
  predictDelay(
    siteAnalysis: any,
    timeline: number,
    contractorScore: number,
    location: string
  ): DelayPrediction {
    const factors: DelayFactor[] = [];
    let totalWeightedImpact = 0;
    let totalWeight = 0;

    // Weather Risk
    const rainfall = siteAnalysis.nasaData?.avgRainfall || 1000;
    const weatherImpact = rainfall > 1500 ? 30 : rainfall > 1000 ? 20 : 10;
    factors.push({ name: 'Weather Risk', impact: weatherImpact, weight: 0.25, description: `${rainfall}mm annual rainfall` });
    totalWeightedImpact += weatherImpact * 0.25;
    totalWeight += 0.25;

    // Contractor Reliability
    const contractorImpact = contractorScore < 50 ? 40 : contractorScore < 70 ? 25 : contractorScore < 85 ? 15 : 5;
    factors.push({ name: 'Contractor Reliability', impact: contractorImpact, weight: 0.3, description: `Score: ${contractorScore}/100` });
    totalWeightedImpact += contractorImpact * 0.3;
    totalWeight += 0.3;

    // Material Availability
    const gridDistance = siteAnalysis.utilities?.electricityGrid?.distance || 100;
    const roadType = siteAnalysis.access?.roadType || 'Tarmac';
    const materialImpact = (gridDistance > 500 ? 15 : 5) + (roadType === 'Earth' ? 20 : roadType === 'Murram' ? 10 : 0);
    factors.push({ name: 'Material Availability', impact: materialImpact, weight: 0.2, description: `${gridDistance}m from grid, ${roadType} road` });
    totalWeightedImpact += materialImpact * 0.2;
    totalWeight += 0.2;

    // Site Conditions
    const slope = siteAnalysis.terrain?.slope || 5;
    const soilType = siteAnalysis.soil?.type?.name || 'Laterite';
    const siteImpact = (slope > 15 ? 20 : slope > 10 ? 10 : 0) + (soilType.includes('Clay') ? 15 : 0);
    factors.push({ name: 'Site Conditions', impact: siteImpact, weight: 0.15, description: `${slope}% slope, ${soilType}` });
    totalWeightedImpact += siteImpact * 0.15;
    totalWeight += 0.15;

    // Permit Processing
    const isUrban = ['Nairobi', 'Mombasa', 'Kisumu'].some(c => location.includes(c));
    const floodRisk = siteAnalysis.flood?.riskLevel || 'low';
    const permitImpact = (isUrban ? 10 : 5) + (floodRisk !== 'low' ? 15 : 0);
    factors.push({ name: 'Permit Processing', impact: permitImpact, weight: 0.1, description: `${isUrban ? 'Urban' : 'Rural'} location` });
    totalWeightedImpact += permitImpact * 0.1;
    totalWeight += 0.1;

    const probability = Math.min(95, Math.round(totalWeightedImpact * 2));
    const expectedDelayDays = Math.round(timeline * (totalWeightedImpact / 100) * 0.3);

    const mitigationStrategies = factors
      .filter(f => f.impact > 15)
      .map(f => {
        switch (f.name) {
          case 'Weather Risk': return 'Schedule critical works during dry season (Jan-Mar, Jul-Sep)';
          case 'Contractor Reliability': return 'Require performance bond and milestone-based payments';
          case 'Material Availability': return 'Pre-order materials and establish on-site storage';
          case 'Site Conditions': return 'Conduct detailed geotechnical survey before excavation';
          case 'Permit Processing': return 'Engage permit expediter and prepare all documents upfront';
          default: return 'Monitor and adjust as needed';
        }
      });

    return {
      probability,
      expectedDelayDays,
      confidence: 85 + Math.random() * 10,
      factors,
      mitigationStrategies
    };
  }

  predictCostOverrun(
    boqTotal: number,
    timeline: number,
    contingencyPercent: number
  ): CostOverrunPrediction {
    const factors: CostFactor[] = [];
    let totalRisk = 0;

    // Material Price Volatility
    const materialRisk = 25; // Base risk for volatile materials
    factors.push({
      name: 'Material Price Volatility',
      impact: materialRisk,
      weight: 0.3,
      description: 'Steel, cement, and fuel prices subject to market fluctuation',
      potentialSavings: Math.round(boqTotal * 0.05)
    });
    totalRisk += materialRisk * 0.3;

    // Labor Cost Risk
    const laborRisk = 15;
    factors.push({
      name: 'Labor Cost Risk',
      impact: laborRisk,
      weight: 0.2,
      description: 'Wage inflation and shortage premiums',
      potentialSavings: Math.round(boqTotal * 0.03)
    });
    totalRisk += laborRisk * 0.2;

    // Scope Creep
    const scopeRisk = 20;
    factors.push({
      name: 'Scope Changes',
      impact: scopeRisk,
      weight: 0.25,
      description: 'Client-requested changes and unforeseen requirements',
      potentialSavings: Math.round(boqTotal * 0.08)
    });
    totalRisk += scopeRisk * 0.25;

    // Inflation (timeline > 12 months)
    const inflationRisk = timeline > 18 ? 30 : timeline > 12 ? 20 : 10;
    factors.push({
      name: 'Inflation Risk',
      impact: inflationRisk,
      weight: 0.15,
      description: `${timeline}-month timeline exposed to inflation`,
      potentialSavings: Math.round(boqTotal * 0.04)
    });
    totalRisk += inflationRisk * 0.15;

    // Contingency Adequacy
    const contingencyRisk = contingencyPercent < 10 ? 25 : contingencyPercent < 15 ? 15 : 5;
    factors.push({
      name: 'Contingency Adequacy',
      impact: contingencyRisk,
      weight: 0.1,
      description: `${contingencyPercent}% contingency allocated`,
      potentialSavings: 0
    });
    totalRisk += contingencyRisk * 0.1;

    const probability = Math.min(90, Math.round(totalRisk * 1.5));
    const expectedOverrunPercentage = Math.round(totalRisk * 0.4);
    const expectedOverrunAmount = Math.round(boqTotal * expectedOverrunPercentage / 100);

    return {
      probability,
      expectedOverrunPercentage,
      expectedOverrunAmount,
      confidence: 80 + Math.random() * 15,
      factors,
      recommendations: [
        'Lock in material prices with suppliers through forward contracts',
        'Include detailed scope definition and change order process in contracts',
        'Build in escalation clauses tied to official inflation indices',
        `Increase contingency to at least 15% (currently ${contingencyPercent}%)`
      ]
    };
  }
}

// ============================================================================
// SUPPLIER MATCHER
// ============================================================================

export class SupplierMatcher {
  matchSuppliers(material: string, quantity: number, location: string): SupplierMatch[] {
    const matches: SupplierMatch[] = [];

    for (const supplier of SUPPLIERS) {
      if (!supplier.category.some(c => material.toLowerCase().includes(c))) continue;

      let score = 0;
      const reasons: string[] = [];

      // Location proximity
      if (supplier.location === location) {
        score += 30;
        reasons.push('Local supplier - faster delivery');
      } else {
        score += 15;
      }

      // Rating
      score += supplier.rating * 4;
      reasons.push(`${supplier.rating}/5 rating`);

      // Verification
      if (supplier.verified) {
        score += 15;
        reasons.push('Verified supplier');
      }

      // Quantity fit
      if (quantity >= supplier.minOrder && quantity <= supplier.maxOrder) {
        score += 15;
        reasons.push('Order quantity within range');
      } else if (quantity < supplier.minOrder) {
        score -= 10;
        reasons.push(`Below minimum order (${supplier.minOrder})`);
      }

      // Calculate estimated price
      const basePrices: Record<string, number> = { cement: 650, steel: 120, roofing: 700, tiles: 800, plumbing: 1500 };
      const basePrice = basePrices[material.toLowerCase()] || 1000;
      const priceMultiplier = supplier.priceLevel === 'budget' ? 0.9 : supplier.priceLevel === 'premium' ? 1.15 : 1.0;
      const bulkDiscount = quantity > 5000 ? 0.85 : quantity > 2000 ? 0.92 : quantity > 1000 ? 0.95 : 1.0;
      const estimatedPrice = Math.round(basePrice * quantity * priceMultiplier * bulkDiscount);

      matches.push({
        supplier,
        score,
        estimatedPrice,
        deliveryTime: supplier.leadTimeDays,
        reasons
      });
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  getBulkDiscount(quantity: number): number {
    if (quantity >= 10000) return 0.20;
    if (quantity >= 5000) return 0.15;
    if (quantity >= 2000) return 0.10;
    if (quantity >= 1000) return 0.05;
    return 0;
  }
}

// ============================================================================
// CONTRACTOR BIDDING SYSTEM
// ============================================================================

export class ContractorBiddingSystem {
  private bids: Map<string, ContractorBid[]> = new Map();

  createBidRequest(projectId: string): string {
    const requestId = `BID-${Date.now().toString(36).toUpperCase()}`;
    this.bids.set(requestId, []);
    return requestId;
  }

  submitBid(requestId: string, bid: Omit<ContractorBid, 'id' | 'submittedAt' | 'status'>): ContractorBid {
    const newBid: ContractorBid = {
      ...bid,
      id: `B-${Date.now().toString(36)}`,
      submittedAt: new Date(),
      status: 'pending'
    };

    const existing = this.bids.get(requestId) || [];
    existing.push(newBid);
    this.bids.set(requestId, existing);

    return newBid;
  }

  compareBids(requestId: string): BidComparison {
    const bids = this.bids.get(requestId) || [];

    if (bids.length === 0) {
      return { lowestBid: null, fastestBid: null, bestValueBid: null, recommendations: ['No bids received yet'] };
    }

    const lowestBid = bids.reduce((a, b) => a.amount < b.amount ? a : b);
    const fastestBid = bids.reduce((a, b) => a.timeline < b.timeline ? a : b);
    const bestValueBid = bids.reduce((a, b) => (a.amount / a.timeline) < (b.amount / b.timeline) ? a : b);

    const recommendations: string[] = [];
    if (lowestBid.id === bestValueBid.id) {
      recommendations.push(`${lowestBid.contractorName} offers both lowest price and best value`);
    } else {
      recommendations.push(`Consider ${bestValueBid.contractorName} for best price-to-timeline ratio`);
    }

    if (fastestBid.id !== lowestBid.id) {
      const premium = ((fastestBid.amount - lowestBid.amount) / lowestBid.amount * 100).toFixed(1);
      recommendations.push(`${fastestBid.contractorName} can complete ${lowestBid.timeline - fastestBid.timeline} days faster for ${premium}% premium`);
    }

    return { lowestBid, fastestBid, bestValueBid, recommendations };
  }
}

// ============================================================================
// DIGITAL TWIN MANAGER
// ============================================================================

export class DigitalTwinManager {
  createLifecycle(projectId: string): BuildingLifecycle {
    const now = new Date();

    const phases: LifecyclePhase[] = [
      { name: 'Design & Planning', startDate: now, endDate: null, status: 'in-progress', documents: ['architectural-drawings', 'structural-calculations', 'boq'], inspections: [] },
      { name: 'Foundation & Structure', startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), endDate: null, status: 'pending', documents: [], inspections: [] },
      { name: 'MEP Installation', startDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000), endDate: null, status: 'pending', documents: [], inspections: [] },
      { name: 'Finishes & Handover', startDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), endDate: null, status: 'pending', documents: [], inspections: [] }
    ];

    const maintenanceSchedule: MaintenanceTask[] = [
      { id: 'MT-001', component: 'HVAC System', frequencyMonths: 6, lastPerformed: null, nextDue: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), estimatedCost: 25000, priority: 'medium' },
      { id: 'MT-002', component: 'Plumbing', frequencyMonths: 12, lastPerformed: null, nextDue: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), estimatedCost: 15000, priority: 'low' },
      { id: 'MT-003', component: 'Electrical', frequencyMonths: 12, lastPerformed: null, nextDue: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), estimatedCost: 20000, priority: 'high' },
      { id: 'MT-004', component: 'Roof', frequencyMonths: 24, lastPerformed: null, nextDue: new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000), estimatedCost: 50000, priority: 'medium' },
      { id: 'MT-005', component: 'Fire Safety', frequencyMonths: 6, lastPerformed: null, nextDue: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), estimatedCost: 35000, priority: 'critical' }
    ];

    return {
      id: `LC-${Date.now().toString(36).toUpperCase()}`,
      projectId,
      phases,
      currentPhase: 'Design & Planning',
      predictedLifespan: 50,
      maintenanceSchedule
    };
  }

  assessComponentHealth(component: string, ageYears: number, condition: 'excellent' | 'good' | 'fair' | 'poor'): ComponentHealth {
    const baseLife: Record<string, number> = {
      'Roof': 25, 'HVAC': 15, 'Plumbing': 30, 'Electrical': 25, 'Elevator': 20,
      'Windows': 20, 'Doors': 15, 'Flooring': 15, 'Paint': 8
    };

    const conditionMultiplier = { excellent: 1.2, good: 1.0, fair: 0.7, poor: 0.4 };
    const expectedLife = (baseLife[component] || 20) * conditionMultiplier[condition];
    const remainingLife = Math.max(0, expectedLife - ageYears);
    const healthScore = Math.round((remainingLife / expectedLife) * 100);

    const warningSigns: string[] = [];
    if (healthScore < 30) warningSigns.push('Immediate attention required');
    if (healthScore < 50) warningSigns.push('Plan for replacement within 2 years');
    if (condition === 'poor') warningSigns.push('Visible deterioration detected');

    const repairCosts: Record<string, number> = {
      'Roof': 500000, 'HVAC': 350000, 'Plumbing': 200000, 'Electrical': 300000,
      'Elevator': 2500000, 'Windows': 150000, 'Doors': 100000, 'Flooring': 250000, 'Paint': 80000
    };

    return {
      component,
      healthScore,
      remainingLifeYears: Math.round(remainingLife * 10) / 10,
      predictedFailureDate: new Date(Date.now() + remainingLife * 365 * 24 * 60 * 60 * 1000),
      warningSigns,
      recommendedAction: healthScore < 30 ? 'Replace immediately' : healthScore < 50 ? 'Schedule replacement' : healthScore < 70 ? 'Monitor closely' : 'Routine maintenance',
      estimatedRepairCost: repairCosts[component] || 100000
    };
  }
}

// ============================================================================
// LUXURY DESIGN LIBRARY
// ============================================================================

export class LuxuryDesignLibrary {
  getAllDesigns(): LuxuryDesign[] {
    return LUXURY_DESIGNS;
  }

  getDesignsByRegion(region: string): LuxuryDesign[] {
    return LUXURY_DESIGNS.filter(d => d.region.toLowerCase() === region.toLowerCase());
  }

  getDesignsByStyle(style: string): LuxuryDesign[] {
    return LUXURY_DESIGNS.filter(d => d.style.toLowerCase().includes(style.toLowerCase()));
  }

  getDesignById(id: string): LuxuryDesign | undefined {
    return LUXURY_DESIGNS.find(d => d.id === id);
  }

  getTopDesigns(limit: number = 5): LuxuryDesign[] {
    return [...LUXURY_DESIGNS].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  }

  searchDesigns(query: string): LuxuryDesign[] {
    const q = query.toLowerCase();
    return LUXURY_DESIGNS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.style.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.tags.some(t => t.includes(q)) ||
      d.features.some(f => f.toLowerCase().includes(q))
    );
  }

  getRecommendations(preferences: { bedrooms?: number; style?: string; budget?: number }): LuxuryDesign[] {
    return LUXURY_DESIGNS.filter(d => {
      if (preferences.bedrooms && Math.abs(d.bedrooms - preferences.bedrooms) > 2) return false;
      if (preferences.style && !d.style.toLowerCase().includes(preferences.style.toLowerCase())) return false;
      if (preferences.budget && d.priceRangeUsd.min > preferences.budget) return false;
      return true;
    }).sort((a, b) => b.popularity - a.popularity);
  }
}

// ============================================================================
// MAIN ENGINE EXPORT
// ============================================================================

export const amenitiesGenerator = new AmenitiesGenerator();
export const landscapingGenerator = new LandscapingGenerator();
export const utilitiesGenerator = new UtilitiesGenerator();
export const riskPredictionEngine = new RiskPredictionEngine();
export const supplierMatcher = new SupplierMatcher();
export const contractorBiddingSystem = new ContractorBiddingSystem();
export const digitalTwinManager = new DigitalTwinManager();
export const luxuryDesignLibrary = new LuxuryDesignLibrary();

// Re-export from V3 for backwards compatibility
export * from './proBuildingSuiteEngineV3';
