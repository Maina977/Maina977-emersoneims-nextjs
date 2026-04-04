// Kenya Building Construction Prices (KES)
export const DEFAULT_PRICES = {
  // Foundation
  excavation: 350, // per cubic meter
  murramFilling: 1800, // per cubic meter
  hardcoreFilling: 2500, // per cubic meter
  dpm: 250, // per sqm
  blinding: 1200, // per sqm
  reinforcement: 180, // per kg
  concrete: {
    class20: 18000, // per cubic meter
    class25: 20000,
    class30: 22000,
  },

  // Walling
  stonework: 4500, // per sqm
  blockwork: {
    '150mm': 2800, // per sqm
    '200mm': 3200,
  },

  // Roofing
  timber: 1800, // per running meter
  ironSheets: {
    gauge28: 850, // per sqm
    gauge30: 750,
  },
  roofTiles: {
    concrete: 1200, // per sqm
    clay: 1800,
  },

  // Finishes
  plaster: 650, // per sqm
  painting: 450, // per sqm
  floorTiles: {
    floor: 1500, // per sqm
    wall: 1200,
  },

  // Electrical (per point)
  lightingPoint: 3500,
  socketPoint: 4000,

  // Plumbing (per point)
  waterPoint: 5000,
  drainagePoint: 4500,

  // Labor rates (per day)
  labor: {
    skilled: 1500,
    unskilled: 800,
    foreman: 2500,
  },

  // Professional fees (percentage of construction cost)
  fees: {
    architect: 6, // 6%
    structuralEngineer: 3,
    quantitySurveyor: 2.5,
    mepEngineer: 2,
  },
};

// Kenya Counties with regions
export const KENYA_COUNTIES = [
  { name: 'Nairobi', region: 'Central' },
  { name: 'Mombasa', region: 'Coastal' },
  { name: 'Kisumu', region: 'Western' },
  { name: 'Nakuru', region: 'Rift Valley' },
  { name: 'Eldoret', region: 'Rift Valley' },
  { name: 'Nyeri', region: 'Central' },
  { name: 'Machakos', region: 'Eastern' },
  { name: 'Kiambu', region: 'Central' },
  { name: 'Kajiado', region: 'Rift Valley' },
  { name: 'Kilifi', region: 'Coastal' },
];

// Building Types
export const BUILDING_TYPES = [
  { id: 'residential', name: 'Residential', icon: '🏠' },
  { id: 'commercial', name: 'Commercial', icon: '🏢' },
  { id: 'industrial', name: 'Industrial', icon: '🏭' },
  { id: 'institutional', name: 'Institutional', icon: '🏫' },
  { id: 'mixed-use', name: 'Mixed Use', icon: '🏬' },
];

// Solar System Sizes (kW)
export const SOLAR_SYSTEM_SIZES = [
  { size: 3, label: '3 kW', suitable: 'Small home' },
  { size: 5, label: '5 kW', suitable: 'Medium home' },
  { size: 10, label: '10 kW', suitable: 'Large home / Small business' },
  { size: 20, label: '20 kW', suitable: 'Medium business' },
  { size: 50, label: '50 kW', suitable: 'Large business' },
  { size: 100, label: '100 kW', suitable: 'Industrial' },
];

// Borehole drilling depths by region (meters)
export const BOREHOLE_DEPTHS = {
  nairobi: { min: 80, max: 200, average: 120 },
  coastal: { min: 30, max: 100, average: 60 },
  riftValley: { min: 100, max: 300, average: 180 },
  western: { min: 50, max: 150, average: 90 },
  eastern: { min: 80, max: 250, average: 150 },
  central: { min: 60, max: 180, average: 100 },
};
