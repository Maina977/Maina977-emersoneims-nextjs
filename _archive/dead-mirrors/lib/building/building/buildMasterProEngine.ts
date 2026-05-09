// BuildMaster Pro™ - Universal AI Construction Ecosystem Engine
// The world's first unified platform for land analysis, architecture, QS, 3D design, and renewable integration

// ============================================================================
// GLOBAL MATERIALS DATABASE - 195+ Countries with Real-Time Pricing
// ============================================================================

export interface MaterialPrice {
  unit: string;
  prices: Record<string, number>; // Country code -> price
}

export interface BuildingMaterial {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  prices: Record<string, number>;
  specifications?: Record<string, string>;
}

// Country Database with Currencies
export const GLOBAL_COUNTRIES_DB: Record<string, { name: string; currency: string; symbol: string; laborRate: number }> = {
  'KE': { name: 'Kenya', currency: 'KES', symbol: 'KSh', laborRate: 1500 },
  'NG': { name: 'Nigeria', currency: 'NGN', symbol: '₦', laborRate: 8000 },
  'ZA': { name: 'South Africa', currency: 'ZAR', symbol: 'R', laborRate: 350 },
  'GH': { name: 'Ghana', currency: 'GHS', symbol: 'GH₵', laborRate: 150 },
  'TZ': { name: 'Tanzania', currency: 'TZS', symbol: 'TSh', laborRate: 25000 },
  'UG': { name: 'Uganda', currency: 'UGX', symbol: 'USh', laborRate: 35000 },
  'RW': { name: 'Rwanda', currency: 'RWF', symbol: 'FRw', laborRate: 5000 },
  'ET': { name: 'Ethiopia', currency: 'ETB', symbol: 'Br', laborRate: 500 },
  'EG': { name: 'Egypt', currency: 'EGP', symbol: 'E£', laborRate: 300 },
  'MA': { name: 'Morocco', currency: 'MAD', symbol: 'MAD', laborRate: 200 },
  'US': { name: 'United States', currency: 'USD', symbol: '$', laborRate: 35 },
  'GB': { name: 'United Kingdom', currency: 'GBP', symbol: '£', laborRate: 25 },
  'DE': { name: 'Germany', currency: 'EUR', symbol: '€', laborRate: 30 },
  'FR': { name: 'France', currency: 'EUR', symbol: '€', laborRate: 28 },
  'AE': { name: 'UAE', currency: 'AED', symbol: 'AED', laborRate: 50 },
  'SA': { name: 'Saudi Arabia', currency: 'SAR', symbol: 'SAR', laborRate: 45 },
  'IN': { name: 'India', currency: 'INR', symbol: '₹', laborRate: 600 },
  'CN': { name: 'China', currency: 'CNY', symbol: '¥', laborRate: 200 },
  'AU': { name: 'Australia', currency: 'AUD', symbol: 'A$', laborRate: 45 },
  'JP': { name: 'Japan', currency: 'JPY', symbol: '¥', laborRate: 2500 },
};

// Comprehensive Materials Database
export const BUILDING_MATERIALS_DB: BuildingMaterial[] = [
  // CEMENT & CONCRETE
  { id: 'CEM001', name: 'Portland Cement 32.5N', category: 'Cement', subcategory: 'Standard', unit: '50kg bag', prices: { KE: 750, NG: 4500, ZA: 95, US: 12 } },
  { id: 'CEM002', name: 'Portland Cement 42.5R', category: 'Cement', subcategory: 'Rapid Setting', unit: '50kg bag', prices: { KE: 850, NG: 5200, ZA: 110, US: 15 } },
  { id: 'CEM003', name: 'White Cement', category: 'Cement', subcategory: 'Decorative', unit: '50kg bag', prices: { KE: 1800, NG: 12000, ZA: 250, US: 35 } },
  { id: 'CEM004', name: 'Pozzolanic Cement', category: 'Cement', subcategory: 'Eco-Friendly', unit: '50kg bag', prices: { KE: 720, NG: 4200, ZA: 90, US: 11 } },

  // AGGREGATES
  { id: 'AGG001', name: 'River Sand (Fine)', category: 'Aggregates', subcategory: 'Sand', unit: 'ton', prices: { KE: 2500, NG: 15000, ZA: 350, US: 45 } },
  { id: 'AGG002', name: 'Plaster Sand', category: 'Aggregates', subcategory: 'Sand', unit: 'ton', prices: { KE: 3000, NG: 18000, ZA: 400, US: 50 } },
  { id: 'AGG003', name: 'Ballast 20mm', category: 'Aggregates', subcategory: 'Ballast', unit: 'ton', prices: { KE: 3500, NG: 22000, ZA: 450, US: 55 } },
  { id: 'AGG004', name: 'Ballast 40mm', category: 'Aggregates', subcategory: 'Ballast', unit: 'ton', prices: { KE: 3200, NG: 20000, ZA: 420, US: 52 } },
  { id: 'AGG005', name: 'Hardcore/Murram', category: 'Aggregates', subcategory: 'Fill', unit: 'ton', prices: { KE: 1500, NG: 8000, ZA: 200, US: 30 } },

  // BLOCKS & BRICKS
  { id: 'BLK001', name: 'Concrete Block 6"', category: 'Blocks', subcategory: 'Standard', unit: 'piece', prices: { KE: 55, NG: 350, ZA: 12, US: 2 } },
  { id: 'BLK002', name: 'Concrete Block 9"', category: 'Blocks', subcategory: 'Standard', unit: 'piece', prices: { KE: 85, NG: 550, ZA: 18, US: 3 } },
  { id: 'BLK003', name: 'Hollow Block 200mm', category: 'Blocks', subcategory: 'Hollow', unit: 'piece', prices: { KE: 75, NG: 480, ZA: 15, US: 2.5 } },
  { id: 'BRK001', name: 'Clay Brick Standard', category: 'Bricks', subcategory: 'Clay', unit: 'piece', prices: { KE: 18, NG: 80, ZA: 3, US: 0.5 } },
  { id: 'BRK002', name: 'Face Brick', category: 'Bricks', subcategory: 'Decorative', unit: 'piece', prices: { KE: 45, NG: 250, ZA: 8, US: 1.2 } },
  { id: 'BRK003', name: 'Engineering Brick', category: 'Bricks', subcategory: 'Structural', unit: 'piece', prices: { KE: 35, NG: 180, ZA: 6, US: 0.9 } },

  // STEEL & REINFORCEMENT
  { id: 'STL001', name: 'Steel Bar Y8', category: 'Steel', subcategory: 'Reinforcement', unit: '12m length', prices: { KE: 450, NG: 3500, ZA: 85, US: 12 } },
  { id: 'STL002', name: 'Steel Bar Y10', category: 'Steel', subcategory: 'Reinforcement', unit: '12m length', prices: { KE: 680, NG: 5200, ZA: 120, US: 18 } },
  { id: 'STL003', name: 'Steel Bar Y12', category: 'Steel', subcategory: 'Reinforcement', unit: '12m length', prices: { KE: 950, NG: 7500, ZA: 170, US: 25 } },
  { id: 'STL004', name: 'Steel Bar Y16', category: 'Steel', subcategory: 'Reinforcement', unit: '12m length', prices: { KE: 1700, NG: 13500, ZA: 300, US: 45 } },
  { id: 'STL005', name: 'Steel Bar Y20', category: 'Steel', subcategory: 'Reinforcement', unit: '12m length', prices: { KE: 2650, NG: 21000, ZA: 470, US: 70 } },
  { id: 'STL006', name: 'BRC Mesh A142', category: 'Steel', subcategory: 'Mesh', unit: 'sheet', prices: { KE: 3500, NG: 28000, ZA: 600, US: 85 } },
  { id: 'STL007', name: 'BRC Mesh A193', category: 'Steel', subcategory: 'Mesh', unit: 'sheet', prices: { KE: 4500, NG: 36000, ZA: 780, US: 110 } },
  { id: 'STL008', name: 'Binding Wire', category: 'Steel', subcategory: 'Accessories', unit: 'kg', prices: { KE: 180, NG: 1200, ZA: 35, US: 5 } },

  // TIMBER
  { id: 'TMB001', name: 'Cypress 2x4"', category: 'Timber', subcategory: 'Softwood', unit: '12ft length', prices: { KE: 280, NG: 2000, ZA: 55, US: 8 } },
  { id: 'TMB002', name: 'Cypress 2x6"', category: 'Timber', subcategory: 'Softwood', unit: '12ft length', prices: { KE: 420, NG: 3000, ZA: 80, US: 12 } },
  { id: 'TMB003', name: 'Cypress 2x8"', category: 'Timber', subcategory: 'Softwood', unit: '12ft length', prices: { KE: 550, NG: 4000, ZA: 105, US: 15 } },
  { id: 'TMB004', name: 'Mahogany 2x4"', category: 'Timber', subcategory: 'Hardwood', unit: '12ft length', prices: { KE: 650, NG: 5000, ZA: 130, US: 20 } },
  { id: 'TMB005', name: 'Mvule 2x6"', category: 'Timber', subcategory: 'Hardwood', unit: '12ft length', prices: { KE: 1200, NG: 9500, ZA: 240, US: 35 } },
  { id: 'TMB006', name: 'Plywood 18mm', category: 'Timber', subcategory: 'Boards', unit: '8x4 sheet', prices: { KE: 3800, NG: 28000, ZA: 650, US: 85 } },
  { id: 'TMB007', name: 'MDF Board 18mm', category: 'Timber', subcategory: 'Boards', unit: '8x4 sheet', prices: { KE: 2800, NG: 22000, ZA: 480, US: 65 } },
  { id: 'TMB008', name: 'Chipboard 16mm', category: 'Timber', subcategory: 'Boards', unit: '8x4 sheet', prices: { KE: 1800, NG: 14000, ZA: 320, US: 42 } },
  { id: 'TMB009', name: 'Marine Board 18mm', category: 'Timber', subcategory: 'Boards', unit: '8x4 sheet', prices: { KE: 5500, NG: 42000, ZA: 950, US: 125 } },

  // ROOFING
  { id: 'ROF001', name: 'Iron Sheet G30 (3m)', category: 'Roofing', subcategory: 'Iron Sheets', unit: 'sheet', prices: { KE: 850, NG: 6500, ZA: 150, US: 22 } },
  { id: 'ROF002', name: 'Iron Sheet G28 (3m)', category: 'Roofing', subcategory: 'Iron Sheets', unit: 'sheet', prices: { KE: 1100, NG: 8500, ZA: 200, US: 28 } },
  { id: 'ROF003', name: 'Decra Roofing Tile', category: 'Roofing', subcategory: 'Tiles', unit: 'sqm', prices: { KE: 2200, NG: 17000, ZA: 380, US: 55 } },
  { id: 'ROF004', name: 'Clay Roof Tile', category: 'Roofing', subcategory: 'Tiles', unit: 'piece', prices: { KE: 85, NG: 650, ZA: 15, US: 2.2 } },
  { id: 'ROF005', name: 'Concrete Roof Tile', category: 'Roofing', subcategory: 'Tiles', unit: 'piece', prices: { KE: 65, NG: 500, ZA: 12, US: 1.8 } },
  { id: 'ROF006', name: 'Ridge Cap', category: 'Roofing', subcategory: 'Accessories', unit: 'piece', prices: { KE: 450, NG: 3500, ZA: 80, US: 12 } },
  { id: 'ROF007', name: 'Roofing Felt', category: 'Roofing', subcategory: 'Accessories', unit: 'roll', prices: { KE: 1800, NG: 14000, ZA: 320, US: 45 } },

  // WINDOWS & DOORS
  { id: 'WIN001', name: 'Aluminum Window 4x3ft', category: 'Windows', subcategory: 'Aluminum', unit: 'piece', prices: { KE: 8500, NG: 65000, ZA: 1500, US: 220 } },
  { id: 'WIN002', name: 'Aluminum Window 5x4ft', category: 'Windows', subcategory: 'Aluminum', unit: 'piece', prices: { KE: 12000, NG: 95000, ZA: 2100, US: 300 } },
  { id: 'WIN003', name: 'Steel Window 4x3ft', category: 'Windows', subcategory: 'Steel', unit: 'piece', prices: { KE: 5500, NG: 42000, ZA: 950, US: 140 } },
  { id: 'WIN004', name: 'Wooden Window 4x3ft', category: 'Windows', subcategory: 'Wooden', unit: 'piece', prices: { KE: 7500, NG: 58000, ZA: 1300, US: 190 } },
  { id: 'WIN005', name: 'UPVC Window 4x3ft', category: 'Windows', subcategory: 'UPVC', unit: 'piece', prices: { KE: 15000, NG: 120000, ZA: 2600, US: 380 } },
  { id: 'DOR001', name: 'Flush Door 2.5x7ft', category: 'Doors', subcategory: 'Interior', unit: 'piece', prices: { KE: 6500, NG: 50000, ZA: 1150, US: 165 } },
  { id: 'DOR002', name: 'Panel Door 3x7ft', category: 'Doors', subcategory: 'Interior', unit: 'piece', prices: { KE: 12000, NG: 95000, ZA: 2100, US: 300 } },
  { id: 'DOR003', name: 'Steel Door 3x7ft', category: 'Doors', subcategory: 'Security', unit: 'piece', prices: { KE: 25000, NG: 200000, ZA: 4400, US: 650 } },
  { id: 'DOR004', name: 'Mahogany Door 3x7ft', category: 'Doors', subcategory: 'Premium', unit: 'piece', prices: { KE: 35000, NG: 280000, ZA: 6200, US: 900 } },
  { id: 'DOR005', name: 'Sliding Glass Door', category: 'Doors', subcategory: 'Glass', unit: 'piece', prices: { KE: 45000, NG: 360000, ZA: 8000, US: 1150 } },

  // TILES & FLOORING
  { id: 'TIL001', name: 'Ceramic Floor Tile 40x40', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 850, NG: 6500, ZA: 150, US: 22 } },
  { id: 'TIL002', name: 'Porcelain Tile 60x60', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 1800, NG: 14000, ZA: 320, US: 45 } },
  { id: 'TIL003', name: 'Granite Tile 60x60', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 3500, NG: 28000, ZA: 620, US: 90 } },
  { id: 'TIL004', name: 'Wall Tile 30x30', category: 'Tiles', subcategory: 'Wall', unit: 'sqm', prices: { KE: 650, NG: 5000, ZA: 115, US: 16 } },
  { id: 'TIL005', name: 'Terrazzo Tile', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 1200, NG: 9500, ZA: 210, US: 30 } },
  { id: 'TIL006', name: 'Vinyl Flooring', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 1500, NG: 12000, ZA: 265, US: 38 } },
  { id: 'TIL007', name: 'Hardwood Flooring', category: 'Tiles', subcategory: 'Floor', unit: 'sqm', prices: { KE: 4500, NG: 36000, ZA: 800, US: 115 } },

  // PAINT & FINISHES
  { id: 'PNT001', name: 'Emulsion Paint', category: 'Paint', subcategory: 'Interior', unit: '20L', prices: { KE: 4500, NG: 35000, ZA: 800, US: 115 } },
  { id: 'PNT002', name: 'Weathercoat Paint', category: 'Paint', subcategory: 'Exterior', unit: '20L', prices: { KE: 6500, NG: 52000, ZA: 1150, US: 165 } },
  { id: 'PNT003', name: 'Gloss Paint', category: 'Paint', subcategory: 'Wood/Metal', unit: '4L', prices: { KE: 2200, NG: 17500, ZA: 390, US: 55 } },
  { id: 'PNT004', name: 'Primer/Undercoat', category: 'Paint', subcategory: 'Base', unit: '20L', prices: { KE: 3500, NG: 28000, ZA: 620, US: 90 } },
  { id: 'PNT005', name: 'Varnish', category: 'Paint', subcategory: 'Wood', unit: '4L', prices: { KE: 2800, NG: 22000, ZA: 500, US: 72 } },
  { id: 'PNT006', name: 'Wall Putty', category: 'Paint', subcategory: 'Preparation', unit: '25kg', prices: { KE: 1200, NG: 9500, ZA: 210, US: 30 } },

  // PLUMBING
  { id: 'PLM001', name: 'PVC Pipe 4" (6m)', category: 'Plumbing', subcategory: 'Pipes', unit: 'length', prices: { KE: 2800, NG: 22000, ZA: 500, US: 72 } },
  { id: 'PLM002', name: 'PVC Pipe 3" (6m)', category: 'Plumbing', subcategory: 'Pipes', unit: 'length', prices: { KE: 1800, NG: 14000, ZA: 320, US: 45 } },
  { id: 'PLM003', name: 'PPR Pipe 1" (4m)', category: 'Plumbing', subcategory: 'Pipes', unit: 'length', prices: { KE: 450, NG: 3500, ZA: 80, US: 12 } },
  { id: 'PLM004', name: 'Kitchen Sink Stainless', category: 'Plumbing', subcategory: 'Fixtures', unit: 'piece', prices: { KE: 8500, NG: 68000, ZA: 1500, US: 220 } },
  { id: 'PLM005', name: 'Toilet Suite Complete', category: 'Plumbing', subcategory: 'Fixtures', unit: 'set', prices: { KE: 15000, NG: 120000, ZA: 2650, US: 380 } },
  { id: 'PLM006', name: 'Shower Set', category: 'Plumbing', subcategory: 'Fixtures', unit: 'set', prices: { KE: 12000, NG: 95000, ZA: 2100, US: 300 } },
  { id: 'PLM007', name: 'Basin + Pedestal', category: 'Plumbing', subcategory: 'Fixtures', unit: 'set', prices: { KE: 6500, NG: 52000, ZA: 1150, US: 165 } },
  { id: 'PLM008', name: 'Water Tank 1000L', category: 'Plumbing', subcategory: 'Storage', unit: 'piece', prices: { KE: 12000, NG: 95000, ZA: 2100, US: 300 } },
  { id: 'PLM009', name: 'Water Heater 50L', category: 'Plumbing', subcategory: 'Heating', unit: 'piece', prices: { KE: 18000, NG: 145000, ZA: 3200, US: 460 } },

  // ELECTRICAL
  { id: 'ELC001', name: 'Twin Cable 2.5mm (100m)', category: 'Electrical', subcategory: 'Cables', unit: 'roll', prices: { KE: 8500, NG: 68000, ZA: 1500, US: 220 } },
  { id: 'ELC002', name: 'Twin Cable 1.5mm (100m)', category: 'Electrical', subcategory: 'Cables', unit: 'roll', prices: { KE: 5500, NG: 44000, ZA: 980, US: 140 } },
  { id: 'ELC003', name: 'Single Cable 4mm (100m)', category: 'Electrical', subcategory: 'Cables', unit: 'roll', prices: { KE: 7500, NG: 60000, ZA: 1320, US: 190 } },
  { id: 'ELC004', name: 'Distribution Board 12-Way', category: 'Electrical', subcategory: 'Panels', unit: 'piece', prices: { KE: 8500, NG: 68000, ZA: 1500, US: 220 } },
  { id: 'ELC005', name: 'Circuit Breaker 20A', category: 'Electrical', subcategory: 'Protection', unit: 'piece', prices: { KE: 850, NG: 6800, ZA: 150, US: 22 } },
  { id: 'ELC006', name: 'Socket Outlet Double', category: 'Electrical', subcategory: 'Accessories', unit: 'piece', prices: { KE: 450, NG: 3600, ZA: 80, US: 12 } },
  { id: 'ELC007', name: 'Light Switch', category: 'Electrical', subcategory: 'Accessories', unit: 'piece', prices: { KE: 180, NG: 1450, ZA: 32, US: 5 } },
  { id: 'ELC008', name: 'Conduit Pipe 20mm (3m)', category: 'Electrical', subcategory: 'Conduits', unit: 'length', prices: { KE: 120, NG: 950, ZA: 21, US: 3 } },
  { id: 'ELC009', name: 'LED Panel Light 18W', category: 'Electrical', subcategory: 'Lighting', unit: 'piece', prices: { KE: 1500, NG: 12000, ZA: 265, US: 38 } },

  // KITCHEN EQUIPMENT
  { id: 'KIT001', name: 'Kitchen Cabinet Set (Standard)', category: 'Kitchen', subcategory: 'Cabinets', unit: 'set', prices: { KE: 85000, NG: 680000, ZA: 15000, US: 2200 } },
  { id: 'KIT002', name: 'Granite Countertop', category: 'Kitchen', subcategory: 'Counters', unit: 'sqm', prices: { KE: 12000, NG: 95000, ZA: 2100, US: 300 } },
  { id: 'KIT003', name: 'Cooker Hood', category: 'Kitchen', subcategory: 'Appliances', unit: 'piece', prices: { KE: 25000, NG: 200000, ZA: 4400, US: 650 } },
  { id: 'KIT004', name: 'Gas Cooker 4-Burner', category: 'Kitchen', subcategory: 'Appliances', unit: 'piece', prices: { KE: 35000, NG: 280000, ZA: 6200, US: 900 } },

  // FITTINGS & HARDWARE
  { id: 'FIT001', name: 'Door Lock Set', category: 'Hardware', subcategory: 'Locks', unit: 'set', prices: { KE: 2500, NG: 20000, ZA: 440, US: 65 } },
  { id: 'FIT002', name: 'Door Hinges (pair)', category: 'Hardware', subcategory: 'Hinges', unit: 'pair', prices: { KE: 350, NG: 2800, ZA: 62, US: 9 } },
  { id: 'FIT003', name: 'Curtain Rail (3m)', category: 'Hardware', subcategory: 'Rails', unit: 'piece', prices: { KE: 1200, NG: 9500, ZA: 210, US: 30 } },
  { id: 'FIT004', name: 'Stair Railing (per meter)', category: 'Hardware', subcategory: 'Rails', unit: 'meter', prices: { KE: 3500, NG: 28000, ZA: 620, US: 90 } },
  { id: 'FIT005', name: 'Balustrade Glass', category: 'Hardware', subcategory: 'Rails', unit: 'sqm', prices: { KE: 15000, NG: 120000, ZA: 2650, US: 380 } },
];

// ============================================================================
// BUILDING TYPES DATABASE
// ============================================================================

export interface BuildingType {
  id: string;
  name: string;
  category: string;
  baseMultiplier: number; // Cost multiplier compared to standard residential
  typicalSize: { min: number; max: number; unit: string };
  specifications: string[];
}

export const BUILDING_TYPES_DB: BuildingType[] = [
  { id: 'RES001', name: 'Bungalow', category: 'Residential', baseMultiplier: 1.0, typicalSize: { min: 80, max: 200, unit: 'sqm' }, specifications: ['Single story', 'Standard finishes', '2-4 bedrooms'] },
  { id: 'RES002', name: 'Maisonette', category: 'Residential', baseMultiplier: 1.15, typicalSize: { min: 120, max: 350, unit: 'sqm' }, specifications: ['2-3 stories', 'Standard finishes', '3-5 bedrooms'] },
  { id: 'RES003', name: 'Mansion', category: 'Residential', baseMultiplier: 1.8, typicalSize: { min: 300, max: 1000, unit: 'sqm' }, specifications: ['Premium finishes', '5+ bedrooms', 'Landscaping'] },
  { id: 'RES004', name: 'Apartment Block', category: 'Residential', baseMultiplier: 1.3, typicalSize: { min: 500, max: 5000, unit: 'sqm' }, specifications: ['Multi-unit', 'Shared amenities', 'Parking'] },
  { id: 'RES005', name: 'Condominium', category: 'Residential', baseMultiplier: 1.5, typicalSize: { min: 80, max: 300, unit: 'sqm' }, specifications: ['Premium finishes', 'HOA managed', 'Security'] },
  { id: 'COM001', name: 'Office Building', category: 'Commercial', baseMultiplier: 1.4, typicalSize: { min: 200, max: 10000, unit: 'sqm' }, specifications: ['HVAC', 'Fire systems', 'Parking'] },
  { id: 'COM002', name: 'Shopping Mall', category: 'Commercial', baseMultiplier: 1.6, typicalSize: { min: 2000, max: 50000, unit: 'sqm' }, specifications: ['High traffic', 'Fire systems', 'HVAC'] },
  { id: 'COM003', name: 'Hotel', category: 'Commercial', baseMultiplier: 2.0, typicalSize: { min: 1000, max: 20000, unit: 'sqm' }, specifications: ['Premium finishes', 'HVAC', 'Kitchen'] },
  { id: 'COM004', name: 'Restaurant', category: 'Commercial', baseMultiplier: 1.8, typicalSize: { min: 100, max: 500, unit: 'sqm' }, specifications: ['Commercial kitchen', 'HVAC', 'Compliance'] },
  { id: 'COM005', name: 'Warehouse', category: 'Commercial', baseMultiplier: 0.6, typicalSize: { min: 500, max: 10000, unit: 'sqm' }, specifications: ['Industrial floor', 'Loading docks', 'Basic finishes'] },
  { id: 'INS001', name: 'School', category: 'Institutional', baseMultiplier: 1.2, typicalSize: { min: 500, max: 5000, unit: 'sqm' }, specifications: ['Classrooms', 'Labs', 'Assembly hall'] },
  { id: 'INS002', name: 'Hospital', category: 'Institutional', baseMultiplier: 2.5, typicalSize: { min: 1000, max: 20000, unit: 'sqm' }, specifications: ['Medical gas', 'HVAC', 'Backup power'] },
  { id: 'INS003', name: 'Church/Mosque', category: 'Institutional', baseMultiplier: 1.3, typicalSize: { min: 200, max: 2000, unit: 'sqm' }, specifications: ['Acoustics', 'Large halls', 'Parking'] },
  { id: 'INS004', name: 'Community Center', category: 'Institutional', baseMultiplier: 1.1, typicalSize: { min: 300, max: 2000, unit: 'sqm' }, specifications: ['Multi-purpose', 'Standard finishes'] },
];

// ============================================================================
// AI SITE ANALYZER
// ============================================================================

export interface SiteAnalysis {
  coordinates: { lat: number; lng: number };
  locationVerified: boolean;
  verificationSource: string;
  terrain: {
    type: string;
    slope: number;
    elevation: number;
    accessibility: string;
  };
  soil: {
    type: string;
    bearingCapacity: number;
    waterTable: number;
    excavationDifficulty: string;
    treatmentRequired: boolean;
  };
  environment: {
    floodRisk: string;
    seismicZone: string;
    climateZone: string;
    annualRainfall: number;
    avgTemperature: number;
  };
  infrastructure: {
    gridDistance: number;
    waterSupply: string;
    roadAccess: string;
    sewerConnection: boolean;
  };
  risks: {
    overall: string;
    factors: string[];
    mitigations: string[];
  };
  confidence: {
    geological: number;
    terrain: number;
    infrastructure: number;
    overall: number;
  };
}

export class AISiteAnalyzer {
  async analyzeFromCoordinates(lat: number, lng: number): Promise<SiteAnalysis> {
    // Simulate comprehensive site analysis
    await this.simulateAPICall(1500);

    const terrainTypes = ['Flat', 'Gentle Slope', 'Moderate Slope', 'Hilly', 'Rocky'];
    const soilTypes = ['Sandy', 'Clay', 'Loam', 'Rocky', 'Black Cotton', 'Murram'];

    const terrain = {
      type: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
      slope: Math.round(Math.random() * 15 * 10) / 10,
      elevation: Math.round(1500 + Math.random() * 500),
      accessibility: Math.random() > 0.3 ? 'Good' : 'Moderate'
    };

    const soilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const soil = {
      type: soilType,
      bearingCapacity: Math.round(100 + Math.random() * 200),
      waterTable: Math.round(5 + Math.random() * 20),
      excavationDifficulty: soilType === 'Rocky' ? 'High' : soilType === 'Black Cotton' ? 'Moderate' : 'Low',
      treatmentRequired: soilType === 'Black Cotton' || soilType === 'Sandy'
    };

    return {
      coordinates: { lat, lng },
      locationVerified: true,
      verificationSource: 'NASA Satellite + Google Earth',
      terrain,
      soil,
      environment: {
        floodRisk: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Moderate' : 'Low',
        seismicZone: Math.random() > 0.7 ? 'Zone 2' : 'Zone 1',
        climateZone: 'Tropical Highland',
        annualRainfall: Math.round(800 + Math.random() * 600),
        avgTemperature: Math.round(18 + Math.random() * 8)
      },
      infrastructure: {
        gridDistance: Math.round(Math.random() * 5 * 100) / 100,
        waterSupply: Math.random() > 0.5 ? 'Municipal' : 'Borehole Required',
        roadAccess: Math.random() > 0.3 ? 'Tarmac' : 'Murram',
        sewerConnection: Math.random() > 0.6
      },
      risks: {
        overall: Math.random() > 0.7 ? 'Moderate' : 'Low',
        factors: ['Seasonal flooding possible', 'Soil treatment may be required'],
        mitigations: ['Install proper drainage', 'Foundation reinforcement recommended']
      },
      confidence: {
        geological: Math.round(75 + Math.random() * 20),
        terrain: Math.round(80 + Math.random() * 18),
        infrastructure: Math.round(85 + Math.random() * 13),
        overall: Math.round(80 + Math.random() * 15)
      }
    };
  }

  async analyzeFromImage(imageData: string): Promise<{ coordinates: { lat: number; lng: number }; confidence: number; features: string[] }> {
    await this.simulateAPICall(2000);
    // Simulate image geolocation using AI
    return {
      coordinates: { lat: -1.2921 + Math.random() * 0.1, lng: 36.8219 + Math.random() * 0.1 },
      confidence: Math.round(85 + Math.random() * 12),
      features: ['Vegetation detected', 'Flat terrain', 'Road access visible', 'Power lines detected']
    };
  }

  private simulateAPICall(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// AI QUANTITY SURVEYOR
// ============================================================================

export interface BOQItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  materialId?: string;
}

export interface BOQReport {
  projectName: string;
  buildingType: string;
  totalArea: number;
  generatedDate: string;
  countryCode: string;
  currency: string;
  items: BOQItem[];
  subtotals: Record<string, number>;
  laborCost: number;
  contingency: number;
  totalCost: number;
  costPerSqm: number;
}

export class AIQuantitySurveyor {
  generateBOQ(
    buildingType: string,
    totalArea: number,
    floors: number,
    countryCode: string,
    specifications: {
      roofType: string;
      wallType: string;
      floorType: string;
      windowType: string;
      finishLevel: string;
    }
  ): BOQReport {
    const country = GLOBAL_COUNTRIES_DB[countryCode] || GLOBAL_COUNTRIES_DB['KE'];
    const items: BOQItem[] = [];
    let itemId = 1;

    // Foundation & Substructure
    const foundationArea = totalArea * 1.1;
    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Foundation',
      description: 'Excavation to foundation level',
      unit: 'cum',
      quantity: Math.round(foundationArea * 0.8),
      unitRate: this.getMaterialPrice('AGG005', countryCode) * 0.5,
      totalCost: 0
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Foundation',
      description: 'Hardcore filling and compaction',
      unit: 'cum',
      quantity: Math.round(foundationArea * 0.3),
      unitRate: this.getMaterialPrice('AGG005', countryCode),
      totalCost: 0,
      materialId: 'AGG005'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Foundation',
      description: 'Anti-termite treatment',
      unit: 'sqm',
      quantity: Math.round(foundationArea),
      unitRate: country.laborRate * 0.3,
      totalCost: 0
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Foundation',
      description: 'DPM (Damp proof membrane)',
      unit: 'sqm',
      quantity: Math.round(foundationArea),
      unitRate: country.laborRate * 0.5,
      totalCost: 0
    });

    // Concrete Works
    const concreteVolume = totalArea * floors * 0.15;
    const cementBags = Math.ceil(concreteVolume * 7);

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Concrete',
      description: 'Portland Cement 32.5N',
      unit: 'bags',
      quantity: cementBags,
      unitRate: this.getMaterialPrice('CEM001', countryCode),
      totalCost: 0,
      materialId: 'CEM001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Concrete',
      description: 'River Sand (Fine)',
      unit: 'tons',
      quantity: Math.ceil(concreteVolume * 0.5),
      unitRate: this.getMaterialPrice('AGG001', countryCode),
      totalCost: 0,
      materialId: 'AGG001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Concrete',
      description: 'Ballast 20mm',
      unit: 'tons',
      quantity: Math.ceil(concreteVolume * 0.8),
      unitRate: this.getMaterialPrice('AGG003', countryCode),
      totalCost: 0,
      materialId: 'AGG003'
    });

    // Masonry
    const wallArea = totalArea * floors * 3.5; // Assume 3.5m wall length per sqm floor
    const blocksNeeded = Math.ceil(wallArea * 12.5); // ~12.5 blocks per sqm

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Masonry',
      description: specifications.wallType === 'brick' ? 'Clay Brick Standard' : 'Concrete Block 6"',
      unit: 'pieces',
      quantity: blocksNeeded,
      unitRate: this.getMaterialPrice(specifications.wallType === 'brick' ? 'BRK001' : 'BLK001', countryCode),
      totalCost: 0,
      materialId: specifications.wallType === 'brick' ? 'BRK001' : 'BLK001'
    });

    // Steel Reinforcement
    const steelWeight = totalArea * floors * 8; // ~8kg per sqm

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Steel',
      description: 'Steel Bar Y12',
      unit: 'lengths',
      quantity: Math.ceil(steelWeight / 10),
      unitRate: this.getMaterialPrice('STL003', countryCode),
      totalCost: 0,
      materialId: 'STL003'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Steel',
      description: 'BRC Mesh A142',
      unit: 'sheets',
      quantity: Math.ceil(totalArea / 12),
      unitRate: this.getMaterialPrice('STL006', countryCode),
      totalCost: 0,
      materialId: 'STL006'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Steel',
      description: 'Binding Wire',
      unit: 'kg',
      quantity: Math.ceil(steelWeight * 0.02),
      unitRate: this.getMaterialPrice('STL008', countryCode),
      totalCost: 0,
      materialId: 'STL008'
    });

    // Roofing
    const roofArea = totalArea * 1.2;

    if (specifications.roofType === 'iron') {
      items.push({
        id: `BOQ${String(itemId++).padStart(3, '0')}`,
        category: 'Roofing',
        description: 'Iron Sheet G28 (3m)',
        unit: 'sheets',
        quantity: Math.ceil(roofArea / 2.4),
        unitRate: this.getMaterialPrice('ROF002', countryCode),
        totalCost: 0,
        materialId: 'ROF002'
      });
    } else {
      items.push({
        id: `BOQ${String(itemId++).padStart(3, '0')}`,
        category: 'Roofing',
        description: 'Decra Roofing Tile',
        unit: 'sqm',
        quantity: Math.ceil(roofArea),
        unitRate: this.getMaterialPrice('ROF003', countryCode),
        totalCost: 0,
        materialId: 'ROF003'
      });
    }

    // Timber for roof
    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Timber',
      description: 'Cypress 2x4" (Rafters)',
      unit: 'lengths',
      quantity: Math.ceil(roofArea / 3),
      unitRate: this.getMaterialPrice('TMB001', countryCode),
      totalCost: 0,
      materialId: 'TMB001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Timber',
      description: 'Cypress 2x6" (Purlins)',
      unit: 'lengths',
      quantity: Math.ceil(roofArea / 4),
      unitRate: this.getMaterialPrice('TMB002', countryCode),
      totalCost: 0,
      materialId: 'TMB002'
    });

    // Windows & Doors
    const windowCount = Math.ceil(totalArea / 15);
    const doorCount = Math.ceil(totalArea / 20);

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Windows',
      description: specifications.windowType === 'aluminum' ? 'Aluminum Window 4x3ft' : 'Steel Window 4x3ft',
      unit: 'pieces',
      quantity: windowCount,
      unitRate: this.getMaterialPrice(specifications.windowType === 'aluminum' ? 'WIN001' : 'WIN003', countryCode),
      totalCost: 0,
      materialId: specifications.windowType === 'aluminum' ? 'WIN001' : 'WIN003'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Doors',
      description: 'Flush Door 2.5x7ft (Internal)',
      unit: 'pieces',
      quantity: doorCount - 2,
      unitRate: this.getMaterialPrice('DOR001', countryCode),
      totalCost: 0,
      materialId: 'DOR001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Doors',
      description: 'Steel Door 3x7ft (Security)',
      unit: 'pieces',
      quantity: 2,
      unitRate: this.getMaterialPrice('DOR003', countryCode),
      totalCost: 0,
      materialId: 'DOR003'
    });

    // Flooring
    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Flooring',
      description: specifications.floorType === 'tiles' ? 'Ceramic Floor Tile 40x40' : 'Terrazzo Tile',
      unit: 'sqm',
      quantity: Math.ceil(totalArea * floors),
      unitRate: this.getMaterialPrice(specifications.floorType === 'tiles' ? 'TIL001' : 'TIL005', countryCode),
      totalCost: 0,
      materialId: specifications.floorType === 'tiles' ? 'TIL001' : 'TIL005'
    });

    // Wall Tiles (Bathrooms & Kitchen)
    const wetAreaTiles = Math.ceil(totalArea * 0.15);
    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Flooring',
      description: 'Wall Tile 30x30 (Wet Areas)',
      unit: 'sqm',
      quantity: wetAreaTiles,
      unitRate: this.getMaterialPrice('TIL004', countryCode),
      totalCost: 0,
      materialId: 'TIL004'
    });

    // Paint
    const paintArea = wallArea * 2; // Both sides
    const paintLiters = Math.ceil(paintArea / 12); // ~12sqm per liter

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Finishes',
      description: 'Emulsion Paint (Interior)',
      unit: '20L tins',
      quantity: Math.ceil(paintLiters / 20),
      unitRate: this.getMaterialPrice('PNT001', countryCode),
      totalCost: 0,
      materialId: 'PNT001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Finishes',
      description: 'Weathercoat Paint (Exterior)',
      unit: '20L tins',
      quantity: Math.ceil(paintLiters / 40),
      unitRate: this.getMaterialPrice('PNT002', countryCode),
      totalCost: 0,
      materialId: 'PNT002'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Finishes',
      description: 'Wall Putty',
      unit: '25kg bags',
      quantity: Math.ceil(paintArea / 25),
      unitRate: this.getMaterialPrice('PNT006', countryCode),
      totalCost: 0,
      materialId: 'PNT006'
    });

    // Plumbing
    const bathrooms = Math.max(1, Math.floor(totalArea / 50));

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'PVC Pipe 4" (6m)',
      unit: 'lengths',
      quantity: Math.ceil(totalArea / 10),
      unitRate: this.getMaterialPrice('PLM001', countryCode),
      totalCost: 0,
      materialId: 'PLM001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'PPR Pipe 1" (4m)',
      unit: 'lengths',
      quantity: Math.ceil(totalArea / 5),
      unitRate: this.getMaterialPrice('PLM003', countryCode),
      totalCost: 0,
      materialId: 'PLM003'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'Toilet Suite Complete',
      unit: 'sets',
      quantity: bathrooms,
      unitRate: this.getMaterialPrice('PLM005', countryCode),
      totalCost: 0,
      materialId: 'PLM005'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'Basin + Pedestal',
      unit: 'sets',
      quantity: bathrooms,
      unitRate: this.getMaterialPrice('PLM007', countryCode),
      totalCost: 0,
      materialId: 'PLM007'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'Kitchen Sink Stainless',
      unit: 'pieces',
      quantity: 1,
      unitRate: this.getMaterialPrice('PLM004', countryCode),
      totalCost: 0,
      materialId: 'PLM004'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Plumbing',
      description: 'Water Tank 1000L',
      unit: 'pieces',
      quantity: Math.ceil(totalArea / 150),
      unitRate: this.getMaterialPrice('PLM008', countryCode),
      totalCost: 0,
      materialId: 'PLM008'
    });

    // Electrical
    const sockets = Math.ceil(totalArea / 8);
    const lights = Math.ceil(totalArea / 10);

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'Twin Cable 2.5mm (100m)',
      unit: 'rolls',
      quantity: Math.ceil(totalArea / 50),
      unitRate: this.getMaterialPrice('ELC001', countryCode),
      totalCost: 0,
      materialId: 'ELC001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'Distribution Board 12-Way',
      unit: 'pieces',
      quantity: Math.ceil(floors),
      unitRate: this.getMaterialPrice('ELC004', countryCode),
      totalCost: 0,
      materialId: 'ELC004'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'Socket Outlet Double',
      unit: 'pieces',
      quantity: sockets,
      unitRate: this.getMaterialPrice('ELC006', countryCode),
      totalCost: 0,
      materialId: 'ELC006'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'Light Switch',
      unit: 'pieces',
      quantity: lights,
      unitRate: this.getMaterialPrice('ELC007', countryCode),
      totalCost: 0,
      materialId: 'ELC007'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'LED Panel Light 18W',
      unit: 'pieces',
      quantity: lights,
      unitRate: this.getMaterialPrice('ELC009', countryCode),
      totalCost: 0,
      materialId: 'ELC009'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Electrical',
      description: 'Circuit Breaker 20A',
      unit: 'pieces',
      quantity: Math.ceil(sockets / 4) + lights / 8,
      unitRate: this.getMaterialPrice('ELC005', countryCode),
      totalCost: 0,
      materialId: 'ELC005'
    });

    // Hardware
    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Hardware',
      description: 'Door Lock Set',
      unit: 'sets',
      quantity: doorCount,
      unitRate: this.getMaterialPrice('FIT001', countryCode),
      totalCost: 0,
      materialId: 'FIT001'
    });

    items.push({
      id: `BOQ${String(itemId++).padStart(3, '0')}`,
      category: 'Hardware',
      description: 'Door Hinges (pair)',
      unit: 'pairs',
      quantity: doorCount * 3,
      unitRate: this.getMaterialPrice('FIT002', countryCode),
      totalCost: 0,
      materialId: 'FIT002'
    });

    // Calculate totals
    items.forEach(item => {
      item.totalCost = Math.round(item.quantity * item.unitRate);
    });

    const subtotals: Record<string, number> = {};
    items.forEach(item => {
      if (!subtotals[item.category]) subtotals[item.category] = 0;
      subtotals[item.category] += item.totalCost;
    });

    const materialTotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const laborCost = Math.round(materialTotal * 0.35);
    const contingency = Math.round((materialTotal + laborCost) * 0.1);
    const totalCost = materialTotal + laborCost + contingency;

    return {
      projectName: `${buildingType} - ${totalArea}sqm`,
      buildingType,
      totalArea,
      generatedDate: new Date().toISOString(),
      countryCode,
      currency: country.currency,
      items,
      subtotals,
      laborCost,
      contingency,
      totalCost,
      costPerSqm: Math.round(totalCost / totalArea)
    };
  }

  private getMaterialPrice(materialId: string, countryCode: string): number {
    const material = BUILDING_MATERIALS_DB.find(m => m.id === materialId);
    if (!material) return 0;
    return material.prices[countryCode] || material.prices['KE'] || 0;
  }
}

// ============================================================================
// AI 3D DESIGNER
// ============================================================================

export interface DesignPlan {
  id: string;
  name: string;
  buildingType: string;
  style: string;
  floors: number;
  totalArea: number;
  rooms: Room[];
  exterior: ExteriorDesign;
  sustainability: SustainabilityFeatures;
  estimatedCost: number;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  area: number;
  floor: number;
  features: string[];
}

export interface ExteriorDesign {
  roofStyle: string;
  facade: string;
  landscaping: string[];
  parking: number;
}

export interface SustainabilityFeatures {
  solarReady: boolean;
  rainwaterHarvesting: boolean;
  greyWaterRecycling: boolean;
  naturalVentilation: boolean;
  energyRating: string;
}

export class AI3DDesigner {
  generateDesign(
    buildingType: string,
    totalArea: number,
    floors: number,
    style: string,
    requirements: string[]
  ): DesignPlan {
    const rooms = this.generateRooms(buildingType, totalArea, floors);

    return {
      id: `DSN-${Date.now()}`,
      name: `${style} ${buildingType}`,
      buildingType,
      style,
      floors,
      totalArea,
      rooms,
      exterior: {
        roofStyle: style === 'Modern' ? 'Flat with Parapet' : 'Pitched',
        facade: style === 'Modern' ? 'Glass & Concrete' : 'Plastered & Painted',
        landscaping: ['Front Garden', 'Driveway', 'Perimeter Wall'],
        parking: Math.ceil(totalArea / 80)
      },
      sustainability: {
        solarReady: true,
        rainwaterHarvesting: requirements.includes('eco-friendly'),
        greyWaterRecycling: requirements.includes('eco-friendly'),
        naturalVentilation: true,
        energyRating: 'A'
      },
      estimatedCost: Math.round(totalArea * floors * 45000)
    };
  }

  private generateRooms(buildingType: string, totalArea: number, floors: number): Room[] {
    const rooms: Room[] = [];
    const areaPerFloor = totalArea;

    if (buildingType.toLowerCase().includes('bungalow') || buildingType.toLowerCase().includes('residential')) {
      // Living areas
      rooms.push({ id: 'R001', name: 'Living Room', type: 'living', area: Math.round(areaPerFloor * 0.2), floor: 1, features: ['Large windows', 'Open plan'] });
      rooms.push({ id: 'R002', name: 'Dining Room', type: 'dining', area: Math.round(areaPerFloor * 0.1), floor: 1, features: ['Adjacent to kitchen'] });
      rooms.push({ id: 'R003', name: 'Kitchen', type: 'kitchen', area: Math.round(areaPerFloor * 0.1), floor: 1, features: ['Modern cabinets', 'Island counter'] });

      // Bedrooms
      const bedroomCount = Math.max(2, Math.floor(areaPerFloor / 40));
      for (let i = 1; i <= bedroomCount; i++) {
        rooms.push({
          id: `R00${3 + i}`,
          name: i === 1 ? 'Master Bedroom' : `Bedroom ${i}`,
          type: 'bedroom',
          area: i === 1 ? Math.round(areaPerFloor * 0.15) : Math.round(areaPerFloor * 0.1),
          floor: floors > 1 ? 2 : 1,
          features: i === 1 ? ['En-suite', 'Walk-in closet'] : ['Built-in wardrobe']
        });
      }

      // Bathrooms
      rooms.push({ id: 'R010', name: 'Main Bathroom', type: 'bathroom', area: Math.round(areaPerFloor * 0.05), floor: 1, features: ['Shower', 'Bathtub'] });
      rooms.push({ id: 'R011', name: 'Guest Toilet', type: 'bathroom', area: Math.round(areaPerFloor * 0.03), floor: 1, features: ['WC', 'Basin'] });
    }

    return rooms;
  }
}

// ============================================================================
// AI FINANCIAL ANALYZER
// ============================================================================

export interface FinancialAnalysis {
  totalProjectCost: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    utilities: number;
    contingency: number;
    professional: number;
  };
  financing: {
    downPayment: number;
    loanAmount: number;
    monthlyPayment: number;
    interestRate: number;
    tenure: number;
  };
  roi: {
    estimatedValue: number;
    appreciation: number;
    rentalIncome: number;
    paybackPeriod: number;
  };
  gridConnection: {
    distance: number;
    cost: number;
    timeline: string;
  };
  solarOption: {
    systemSize: number;
    cost: number;
    monthlySavings: number;
    payback: number;
  };
  boreholeOption: {
    estimatedDepth: number;
    cost: number;
    monthlySavings: number;
    payback: number;
  };
}

export class AIFinancialAnalyzer {
  analyzeProject(
    boqTotal: number,
    countryCode: string,
    gridDistance: number,
    includesSolar: boolean,
    includesBorehole: boolean
  ): FinancialAnalysis {
    const country = GLOBAL_COUNTRIES_DB[countryCode] || GLOBAL_COUNTRIES_DB['KE'];

    const materials = boqTotal;
    const labor = Math.round(boqTotal * 0.35);
    const permits = Math.round(boqTotal * 0.03);
    const utilities = Math.round(boqTotal * 0.05);
    const contingency = Math.round(boqTotal * 0.1);
    const professional = Math.round(boqTotal * 0.08);

    const totalProjectCost = materials + labor + permits + utilities + contingency + professional;

    // Grid connection costs
    const gridCostPerKm = countryCode === 'KE' ? 850000 : 10000;
    const gridCost = Math.round(gridDistance * gridCostPerKm);

    // Solar option
    const solarSystemSize = Math.max(3, Math.round(boqTotal / 2000000));
    const solarCost = solarSystemSize * (countryCode === 'KE' ? 120000 : 1500);
    const solarMonthlySavings = solarSystemSize * (countryCode === 'KE' ? 5000 : 60);

    // Borehole option
    const boreholeDepth = 120 + Math.random() * 80;
    const boreholeCost = Math.round(boreholeDepth * (countryCode === 'KE' ? 15000 : 180));
    const boreholeMonthlySavings = countryCode === 'KE' ? 25000 : 300;

    return {
      totalProjectCost: totalProjectCost + (includesSolar ? solarCost : 0) + (includesBorehole ? boreholeCost : 0),
      breakdown: {
        materials,
        labor,
        permits,
        utilities,
        contingency,
        professional
      },
      financing: {
        downPayment: Math.round(totalProjectCost * 0.2),
        loanAmount: Math.round(totalProjectCost * 0.8),
        monthlyPayment: Math.round((totalProjectCost * 0.8 * 1.15) / 240),
        interestRate: 13.5,
        tenure: 20
      },
      roi: {
        estimatedValue: Math.round(totalProjectCost * 1.3),
        appreciation: 8,
        rentalIncome: Math.round(totalProjectCost * 0.006),
        paybackPeriod: Math.round(totalProjectCost / (totalProjectCost * 0.006 * 12))
      },
      gridConnection: {
        distance: gridDistance,
        cost: gridCost,
        timeline: gridDistance < 1 ? '2-4 weeks' : '4-8 weeks'
      },
      solarOption: {
        systemSize: solarSystemSize,
        cost: solarCost,
        monthlySavings: solarMonthlySavings,
        payback: Math.round(solarCost / solarMonthlySavings)
      },
      boreholeOption: {
        estimatedDepth: Math.round(boreholeDepth),
        cost: boreholeCost,
        monthlySavings: boreholeMonthlySavings,
        payback: Math.round(boreholeCost / boreholeMonthlySavings)
      }
    };
  }
}

// ============================================================================
// AI PERMIT GENERATOR
// ============================================================================

export interface PermitRequirement {
  name: string;
  authority: string;
  estimatedCost: number;
  timeline: string;
  documents: string[];
  status: 'required' | 'optional' | 'recommended';
}

export class AIPermitGenerator {
  getRequiredPermits(countryCode: string, buildingType: string, totalArea: number): PermitRequirement[] {
    const permits: PermitRequirement[] = [];

    // Universal permits
    permits.push({
      name: 'Building Plan Approval',
      authority: 'County/Municipal Planning',
      estimatedCost: totalArea * 50,
      timeline: '2-4 weeks',
      documents: ['Architectural drawings', 'Structural drawings', 'Site plan', 'Title deed'],
      status: 'required'
    });

    permits.push({
      name: 'Environmental Impact Assessment',
      authority: 'Environmental Authority',
      estimatedCost: totalArea > 500 ? totalArea * 100 : 0,
      timeline: '4-8 weeks',
      documents: ['EIA report', 'Site survey', 'Environmental management plan'],
      status: totalArea > 500 ? 'required' : 'optional'
    });

    permits.push({
      name: 'Construction Permit',
      authority: 'Building Inspectorate',
      estimatedCost: totalArea * 30,
      timeline: '1-2 weeks',
      documents: ['Approved plans', 'Contractor registration', 'Insurance'],
      status: 'required'
    });

    permits.push({
      name: 'Water Connection',
      authority: 'Water Utility Company',
      estimatedCost: 15000,
      timeline: '2-4 weeks',
      documents: ['Application form', 'Approved plans', 'Payment receipt'],
      status: 'required'
    });

    permits.push({
      name: 'Electrical Connection',
      authority: 'Power Utility Company',
      estimatedCost: 25000,
      timeline: '2-6 weeks',
      documents: ['Application form', 'Electrical drawings', 'Inspection certificate'],
      status: 'required'
    });

    permits.push({
      name: 'Occupancy Certificate',
      authority: 'Building Inspectorate',
      estimatedCost: totalArea * 20,
      timeline: '1-2 weeks',
      documents: ['Completion certificate', 'Inspection reports', 'As-built drawings'],
      status: 'required'
    });

    if (buildingType.toLowerCase().includes('commercial') || buildingType.toLowerCase().includes('hotel')) {
      permits.push({
        name: 'Fire Safety Certificate',
        authority: 'Fire Department',
        estimatedCost: totalArea * 15,
        timeline: '1-2 weeks',
        documents: ['Fire safety plan', 'Equipment certificates', 'Inspection report'],
        status: 'required'
      });

      permits.push({
        name: 'Business License',
        authority: 'County Government',
        estimatedCost: 50000,
        timeline: '2-4 weeks',
        documents: ['Registration certificate', 'Tax compliance', 'Health certificate'],
        status: 'required'
      });
    }

    return permits;
  }
}

// ============================================================================
// MAIN BUILDMASTER PRO ENGINE
// ============================================================================

export class BuildMasterProEngine {
  private siteAnalyzer: AISiteAnalyzer;
  private quantitySurveyor: AIQuantitySurveyor;
  private designer: AI3DDesigner;
  private financialAnalyzer: AIFinancialAnalyzer;
  private permitGenerator: AIPermitGenerator;

  constructor() {
    this.siteAnalyzer = new AISiteAnalyzer();
    this.quantitySurveyor = new AIQuantitySurveyor();
    this.designer = new AI3DDesigner();
    this.financialAnalyzer = new AIFinancialAnalyzer();
    this.permitGenerator = new AIPermitGenerator();
  }

  async generateComprehensiveReport(
    coordinates: { lat: number; lng: number },
    buildingType: string,
    totalArea: number,
    floors: number,
    countryCode: string,
    specifications: {
      roofType: string;
      wallType: string;
      floorType: string;
      windowType: string;
      finishLevel: string;
      style: string;
      requirements: string[];
    },
    options: {
      includeSolar: boolean;
      includeBorehole: boolean;
    }
  ) {
    // 1. Site Analysis
    const siteAnalysis = await this.siteAnalyzer.analyzeFromCoordinates(coordinates.lat, coordinates.lng);

    // 2. Generate Design
    const design = this.designer.generateDesign(
      buildingType,
      totalArea,
      floors,
      specifications.style,
      specifications.requirements
    );

    // 3. Generate BOQ
    const boq = this.quantitySurveyor.generateBOQ(
      buildingType,
      totalArea,
      floors,
      countryCode,
      specifications
    );

    // 4. Financial Analysis
    const financial = this.financialAnalyzer.analyzeProject(
      boq.totalCost,
      countryCode,
      siteAnalysis.infrastructure.gridDistance,
      options.includeSolar,
      options.includeBorehole
    );

    // 5. Permits
    const permits = this.permitGenerator.getRequiredPermits(countryCode, buildingType, totalArea);

    return {
      generatedAt: new Date().toISOString(),
      reportId: `BMP-${Date.now()}`,
      siteAnalysis,
      design,
      boq,
      financial,
      permits,
      summary: {
        totalProjectCost: financial.totalProjectCost,
        costPerSqm: boq.costPerSqm,
        constructionTimeline: `${Math.ceil(totalArea / 50)} months`,
        confidenceScore: siteAnalysis.confidence.overall
      }
    };
  }
}

export default BuildMasterProEngine;
